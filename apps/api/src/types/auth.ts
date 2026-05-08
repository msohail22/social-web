export type AuthUser = {
	id: string;
	name: string;
	email: string;
	createdAt: string;
};

export type AuthSession = {
	user: AuthUser;
	issuedAt: string;
};

export type SignUpForm = {
	name: string;
	email: string;
	password: string;
};

export type SignInForm = {
	email: string;
	password: string;
};
