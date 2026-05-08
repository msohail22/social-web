import type { AuthUser, SignInForm, SignUpForm } from "../../types/auth";
import {
	AUTH_USERS_EMAIL_INDEX_SQL,
	AUTH_USERS_SCHEMA_SQL,
	normalizeEmail,
	toAuthUser,
	type AuthUserRow,
} from "./auth.schema";

const PASSWORD_HASH_ITERATIONS = 100_000;

export class EmailAlreadyExistsError extends Error {
	constructor() {
		super("An account already exists for this email.");
		this.name = "EmailAlreadyExistsError";
	}
}

export const createAuthUser = async (
	db: D1Database,
	{ name, email, password }: SignUpForm,
): Promise<AuthUser> => {
	await ensureAuthSchema(db);

	const normalizedEmail = normalizeEmail(email);
	const existingUser = await findAuthUserRowByEmail(db, normalizedEmail);

	if (existingUser) {
		throw new EmailAlreadyExistsError();
	}

	const salt = crypto.randomUUID();
	const row: AuthUserRow = {
		id: crypto.randomUUID(),
		name: name.trim(),
		email: normalizedEmail,
		password_hash: await hashPassword(password, salt),
		password_salt: salt,
		created_at: new Date().toISOString(),
	};

	await db
		.prepare(
			`
				INSERT INTO auth_users (id, name, email, password_hash, password_salt, created_at)
				VALUES (?, ?, ?, ?, ?, ?)
			`,
		)
		.bind(row.id, row.name, row.email, row.password_hash, row.password_salt, row.created_at)
		.run();

	return toAuthUser(row);
};

export const findAuthUserByCredentials = async (
	db: D1Database,
	{ email, password }: SignInForm,
): Promise<AuthUser | null> => {
	await ensureAuthSchema(db);

	const userRow = await findAuthUserRowByEmail(db, normalizeEmail(email));

	if (!userRow) {
		return null;
	}

	const passwordHash = await hashPassword(password, userRow.password_salt);

	if (!timingSafeEqual(passwordHash, userRow.password_hash)) {
		return null;
	}

	return toAuthUser(userRow);
};

const ensureAuthSchema = async (db: D1Database): Promise<void> => {
	await db.prepare(AUTH_USERS_SCHEMA_SQL).run();
	await db.prepare(AUTH_USERS_EMAIL_INDEX_SQL).run();
};

const findAuthUserRowByEmail = async (
	db: D1Database,
	email: string,
): Promise<AuthUserRow | null> => {
	return db
		.prepare(
			`
				SELECT id, name, email, password_hash, password_salt, created_at
				FROM auth_users
				WHERE email = ?
				LIMIT 1
			`,
		)
		.bind(email)
		.first<AuthUserRow>();
};

const hashPassword = async (password: string, salt: string): Promise<string> => {
	const encoder = new TextEncoder();
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		encoder.encode(password),
		"PBKDF2",
		false,
		["deriveBits"],
	);
	const hash = await crypto.subtle.deriveBits(
		{
			name: "PBKDF2",
			hash: "SHA-256",
			salt: encoder.encode(salt),
			iterations: PASSWORD_HASH_ITERATIONS,
		},
		keyMaterial,
		256,
	);

	return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const timingSafeEqual = (left: string, right: string): boolean => {
	if (left.length !== right.length) {
		return false;
	}

	let result = 0;

	for (let index = 0; index < left.length; index += 1) {
		result |= left.charCodeAt(index) ^ right.charCodeAt(index);
	}

	return result === 0;
};
