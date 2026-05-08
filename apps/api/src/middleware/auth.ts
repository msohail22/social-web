import { deleteCookie, getSignedCookie, setSignedCookie } from "hono/cookie";
import type { Context, MiddlewareHandler } from "hono";
import { authPath } from "../routes/paths";
import type { AuthSession, AuthUser } from "../types/auth";
import type { AppEnv } from "../types/bindings";

const AUTH_COOKIE_NAME = "social_web_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const LOCAL_AUTH_SECRET = "local-static-social-web-auth-secret";

export const attachAuthUser: MiddlewareHandler<AppEnv> = async (c, next) => {
	const session = await readAuthSession(c);

	c.set("user", session?.user ?? null);

	await next();
};

export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
	if (!c.get("user")) {
		if (wantsJson(c.req.raw)) {
			return c.json({ error: "Authentication required." }, 401);
		}

		return c.redirect(authPath("/sign-in"));
	}

	await next();
};

export const setAuthSession = async (
	c: Context<AppEnv>,
	user: AuthUser,
): Promise<void> => {
	const session: AuthSession = {
		user,
		issuedAt: new Date().toISOString(),
	};

	await setSignedCookie(c, AUTH_COOKIE_NAME, encodeSession(session), getAuthSecret(c), {
		httpOnly: true,
		maxAge: SESSION_MAX_AGE_SECONDS,
		path: "/",
		sameSite: "Lax",
		secure: isSecureRequest(c),
	});

	c.set("user", user);
};

export const clearAuthSession = (c: Context<AppEnv>): void => {
	deleteCookie(c, AUTH_COOKIE_NAME, {
		path: "/",
		secure: isSecureRequest(c),
	});

	c.set("user", null);
};

const readAuthSession = async (c: Context<AppEnv>): Promise<AuthSession | null> => {
	const cookieValue = await getSignedCookie(c, getAuthSecret(c), AUTH_COOKIE_NAME);

	if (!cookieValue) {
		return null;
	}

	return decodeSession(cookieValue);
};

const getAuthSecret = (c: Context<AppEnv>): string => {
	return c.env.AUTH_SECRET ?? LOCAL_AUTH_SECRET;
};

const isSecureRequest = (c: Context<AppEnv>): boolean => {
	return new URL(c.req.url).protocol === "https:";
};

const encodeSession = (session: AuthSession): string => {
	const bytes = new TextEncoder().encode(JSON.stringify(session));
	let binary = "";

	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
};

const decodeSession = (value: string): AuthSession | null => {
	try {
		const paddedValue = value.padEnd(value.length + ((4 - (value.length % 4)) % 4), "=");
		const binary = atob(paddedValue.replaceAll("-", "+").replaceAll("_", "/"));
		const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
		const session = JSON.parse(new TextDecoder().decode(bytes)) as AuthSession;

		if (!session.user?.id || !session.user.email || !session.user.name) {
			return null;
		}

		return session;
	} catch {
		return null;
	}
};

const wantsJson = (request: Request): boolean => {
	return request.headers.get("accept")?.includes("application/json") ?? false;
};
