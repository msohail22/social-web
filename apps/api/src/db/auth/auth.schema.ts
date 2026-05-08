import type { AuthUser } from "../../types/auth";

export type AuthUserRow = {
	id: string;
	name: string;
	email: string;
	password_hash: string;
	password_salt: string;
	created_at: string;
};

export const AUTH_USERS_SCHEMA_SQL = `
	CREATE TABLE IF NOT EXISTS auth_users (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		password_hash TEXT NOT NULL,
		password_salt TEXT NOT NULL,
		created_at TEXT NOT NULL
	);
`;

export const AUTH_USERS_EMAIL_INDEX_SQL = `
	CREATE INDEX IF NOT EXISTS idx_auth_users_email ON auth_users (email);
`;

export const toAuthUser = (row: AuthUserRow): AuthUser => ({
	id: row.id,
	name: row.name,
	email: row.email,
	createdAt: row.created_at,
});

export const normalizeEmail = (email: string): string => email.trim().toLowerCase();
