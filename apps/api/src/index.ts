import { Hono } from "hono";
import { cors } from "hono/cors";
import { attachAuthUser } from "./middleware";
import { authRoutes } from "./routes/auth/auth.routes";
import { API_BASE_PATH, authPath } from "./routes/paths";
import type { AppEnv } from "./types/bindings";

const app = new Hono<AppEnv>();

app.use(
	"*",
	cors({
		origin: (origin) => origin,
		allowHeaders: ["Content-Type"],
		allowMethods: ["GET", "POST", "OPTIONS"],
		credentials: true,
	}),
);

app.use("*", attachAuthUser);

app.get("/", (c) => c.redirect(authPath("/sign-in")));
app.get(`${API_BASE_PATH}/health`, (c) => c.json({ ok: true }));
app.get(`${API_BASE_PATH}/message`, (c) => c.text("Social Web API"));

app.route(authPath(), authRoutes);

app.get("/message", (c) => c.redirect(`${API_BASE_PATH}/message`));
app.get("/auth/*", (c) => c.redirect(`${API_BASE_PATH}${c.req.path}`));
app.get("/signup", (c) => c.redirect(authPath("/sign-up")));
app.get("/login", (c) => c.redirect(authPath("/sign-in")));
app.get("/logout", (c) => c.redirect(authPath("/logout")));

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
