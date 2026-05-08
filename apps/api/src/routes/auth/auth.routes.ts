import { Hono } from "hono";
import {
	createAuthUser,
	EmailAlreadyExistsError,
	findAuthUserByCredentials,
	normalizeEmail,
} from "../../db/auth";
import { clearAuthSession, requireAuth, setAuthSession } from "../../middleware";
import type { SignInForm, SignUpForm } from "../../types/auth";
import type { AppEnv } from "../../types/bindings";
import { authPath } from "../paths";
import {
	renderLogoutPage,
	renderSignInPage,
	renderSignUpPage,
} from "./auth.views";

export const authRoutes = new Hono<AppEnv>();

authRoutes.get("/sign-up", (c) => {
	return c.html(renderSignUpPage({ currentUser: c.get("user") }));
});

authRoutes.post("/sign-up", async (c) => {
	const form = await parseSignUpForm(c.req.raw);
	const error = validateSignUpForm(form);

	if (error) {
		if (wantsJson(c.req.raw)) {
			return c.json({ error }, 400);
		}

		return c.html(
			renderSignUpPage({
				currentUser: c.get("user"),
				error,
				values: form,
			}),
			400,
		);
	}

	let user;

	try {
		user = await createAuthUser(c.env.DB, form);
	} catch (error) {
		if (error instanceof EmailAlreadyExistsError) {
			if (wantsJson(c.req.raw)) {
				return c.json({ error: error.message }, 409);
			}

			return c.html(
				renderSignUpPage({
					currentUser: c.get("user"),
					error: error.message,
					values: form,
				}),
				409,
			);
		}

		throw error;
	}

	await setAuthSession(c, user);

	if (wantsJson(c.req.raw)) {
		return c.json({ user }, 201);
	}

	return c.redirect(authPath("/logout?status=signed-up"));
});

authRoutes.get("/sign-in", (c) => {
	return c.html(renderSignInPage({ currentUser: c.get("user") }));
});

authRoutes.post("/sign-in", async (c) => {
	const form = await parseSignInForm(c.req.raw);
	const user = await findAuthUserByCredentials(c.env.DB, form);

	if (!user) {
		if (wantsJson(c.req.raw)) {
			return c.json({ error: "Use a valid email and password." }, 401);
		}

		return c.html(
			renderSignInPage({
				currentUser: c.get("user"),
				error: "Use a valid email and password.",
				values: form,
			}),
			401,
		);
	}

	await setAuthSession(c, user);

	if (wantsJson(c.req.raw)) {
		return c.json({ user });
	}

	return c.redirect(authPath("/logout?status=signed-in"));
});

authRoutes.get("/logout", (c) => {
	return c.html(
		renderLogoutPage({
			currentUser: c.get("user"),
			status: c.req.query("status"),
		}),
	);
});

authRoutes.post("/logout", (c) => {
	clearAuthSession(c);

	if (wantsJson(c.req.raw)) {
		return c.json({ ok: true });
	}

	return c.html(renderLogoutPage({ currentUser: null, status: "signed-out" }));
});

authRoutes.get("/me", requireAuth, (c) => {
	return c.json({ user: c.get("user") });
});

const parseSignUpForm = async (request: Request): Promise<SignUpForm> => {
	if (isJsonRequest(request)) {
		const body = (await request.json().catch(() => ({}))) as Partial<SignUpForm>;

		return {
			name: String(body.name ?? ""),
			email: normalizeEmail(String(body.email ?? "")),
			password: String(body.password ?? ""),
		};
	}

	const form = await request.formData();

	return {
		name: String(form.get("name") ?? ""),
		email: normalizeEmail(String(form.get("email") ?? "")),
		password: String(form.get("password") ?? ""),
	};
};

const parseSignInForm = async (request: Request): Promise<SignInForm> => {
	if (isJsonRequest(request)) {
		const body = (await request.json().catch(() => ({}))) as Partial<SignInForm>;

		return {
			email: normalizeEmail(String(body.email ?? "")),
			password: String(body.password ?? ""),
		};
	}

	const form = await request.formData();

	return {
		email: normalizeEmail(String(form.get("email") ?? "")),
		password: String(form.get("password") ?? ""),
	};
};

const validateSignUpForm = ({ name, email, password }: SignUpForm): string | null => {
	if (!name.trim()) {
		return "Enter your name.";
	}

	if (!email.includes("@")) {
		return "Enter a valid email address.";
	}

	if (password.length < 8) {
		return "Use at least 8 characters for the password.";
	}

	return null;
};

const isJsonRequest = (request: Request): boolean => {
	return request.headers.get("content-type")?.includes("application/json") ?? false;
};

const wantsJson = (request: Request): boolean => {
	return (
		isJsonRequest(request) ||
		(request.headers.get("accept")?.includes("application/json") ?? false)
	);
};
