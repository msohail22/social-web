import type { AuthUser } from "./auth";

export type Bindings = CloudflareBindings & {
	AUTH_SECRET?: string;
	DB: D1Database;
};

export type AppEnv = {
	Bindings: Bindings;
	Variables: {
		user: AuthUser | null;
	};
};
