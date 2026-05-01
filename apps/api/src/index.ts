import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const app = new Hono<{ Bindings: CloudflareBindings }>();

const PASSWORD_ITERATIONS = 100_000;
const PASSWORD_HASH_BYTES = 32;
const DEFAULT_SESSION_TTL_DAYS = 7;
const textEncoder = new TextEncoder();

type AuthUser = {
  id: string;
  email: string;
};

const toBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCodePoint(byte);
  }
  return btoa(binary);
};

const fromBase64 = (value: string): Uint8Array => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    const codePoint = binary.codePointAt(i);
    bytes[i] = codePoint ?? 0;
  }
  return bytes;
};

const timingSafeEqual = (a: Uint8Array, b: Uint8Array): boolean => {
  if (a.length !== b.length) {
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
};

const hashPassword = async (password: string, salt: Uint8Array): Promise<string> => {
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    PASSWORD_HASH_BYTES * 8,
  );

  return toBase64(bits);
};

const verifyPassword = async (
  password: string,
  saltBase64: string,
  expectedHash: string,
): Promise<boolean> => {
  const salt = fromBase64(saltBase64);
  const hash = await hashPassword(password, salt);
  return timingSafeEqual(fromBase64(hash), fromBase64(expectedHash));
};

const normalizeEmail = (value: string): string => value.trim().toLowerCase();

const getSessionUser = async (
  c: Context<{ Bindings: CloudflareBindings }>,
): Promise<AuthUser | null> => {
  const sessionId = getCookie(c, "session");
  if (!sessionId) {
    return null;
  }

  const result = await c.env.DB.prepare(
    "SELECT users.id as id, users.email as email FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.id = ? AND sessions.expires_at > unixepoch()",
  )
    .bind(sessionId)
    .first<AuthUser>();

  return result ?? null;
};

app.use("*", async (c, next) => {
  const allowed = new Set(
    [
      c.env.FRONTEND_ORIGIN,
      "http://localhost:5173",
      "http://127.0.0.1:5173",
    ].filter(Boolean),
  );

  const middleware = cors({
    origin: (origin) => {
      if (!origin) {
        return false;
      }

      if (allowed.has(origin)) {
        return origin;
      }

      if (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")) {
        return origin;
      }

      return false;
    },
    credentials: true,
  });

  return middleware(c, next);
});

app.get("/message", (c) => c.text("Hello Hono!"));

app.post("/auth/login", async (c) => {
  const body = await c.req.json().catch(() => null);
  const email = typeof body?.email === "string" ? normalizeEmail(body.email) : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email.includes("@") || password.length < 6) {
    return c.text("Invalid credentials", 400);
  }

  const existingUser = await c.env.DB.prepare(
    "SELECT id, password_hash, password_salt FROM users WHERE email = ?",
  )
    .bind(email)
    .first<{ id: string; password_hash: string; password_salt: string }>();

  let userId = existingUser?.id ?? null;

  if (existingUser) {
    const valid = await verifyPassword(
      password,
      existingUser.password_salt,
      existingUser.password_hash,
    );
    if (!valid) {
      return c.text("Invalid email or password", 401);
    }
  } else {
    userId = crypto.randomUUID();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordHash = await hashPassword(password, salt);

    await c.env.DB.prepare(
      "INSERT INTO users (id, email, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?, unixepoch())",
    )
      .bind(userId, email, passwordHash, toBase64(salt))
      .run();
  }

  const sessionId = crypto.randomUUID();
  const ttlDays = Number(c.env.SESSION_TTL_DAYS || DEFAULT_SESSION_TTL_DAYS);
  const ttlSeconds = Math.max(1, Math.floor(ttlDays * 24 * 60 * 60));
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;

  await c.env.DB.prepare(
    "INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, unixepoch(), ?)",
  )
    .bind(sessionId, userId, expiresAt)
    .run();

  setCookie(c, "session", sessionId, {
    httpOnly: true,
    sameSite: "Lax",
    secure: c.req.url.startsWith("https://"),
    maxAge: ttlSeconds,
    path: "/",
  });

  return c.json({ user: { id: userId, email } });
});

app.get("/auth/me", async (c) => {
  const user = await getSessionUser(c);
  if (!user) {
    return c.text("Unauthorized", 401);
  }
  return c.json({ user });
});

app.post("/auth/logout", async (c) => {
  const sessionId = getCookie(c, "session");
  if (sessionId) {
    await c.env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
  }

  deleteCookie(c, "session", {
    path: "/",
  });

  return c.json({ ok: true });
});

export default app;
