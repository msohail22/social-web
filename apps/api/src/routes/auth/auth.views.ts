import type { AuthUser, SignInForm, SignUpForm } from "../../types/auth";
import { authPath } from "../paths";

type AuthPageProps<TValues = Record<string, never>> = {
	currentUser: AuthUser | null;
	error?: string;
	status?: string;
	values?: Partial<TValues>;
};

export const renderSignUpPage = ({
	currentUser,
	error,
	values,
}: AuthPageProps<SignUpForm>): string => {
	return renderPage(
		"Sign up",
		`
			${renderSessionBanner(currentUser)}
			<section class="panel">
				<div>
					<p class="eyebrow">Social Web</p>
					<h1>Create account</h1>
				</div>
				${renderError(error)}
				<form method="post" action="${authPath("/sign-up")}">
					<label>
						Name
						<input name="name" autocomplete="name" value="${escapeHtml(values?.name ?? "")}" required />
					</label>
					<label>
						Email
						<input name="email" type="email" autocomplete="email" value="${escapeHtml(values?.email ?? "")}" required />
					</label>
					<label>
						Password
						<input name="password" type="password" autocomplete="new-password" minlength="8" required />
					</label>
					<button type="submit">Sign up</button>
				</form>
				<a class="link" href="${authPath("/sign-in")}">I already have an account</a>
			</section>
		`,
	);
};

export const renderSignInPage = ({
	currentUser,
	error,
	values,
}: AuthPageProps<SignInForm>): string => {
	return renderPage(
		"Sign in",
		`
			${renderSessionBanner(currentUser)}
			<section class="panel">
				<div>
					<p class="eyebrow">Social Web</p>
					<h1>Sign in</h1>
				</div>
				${renderError(error)}
				<form method="post" action="${authPath("/sign-in")}">
					<label>
						Email
						<input name="email" type="email" autocomplete="email" value="${escapeHtml(values?.email ?? "")}" required />
					</label>
					<label>
						Password
						<input name="password" type="password" autocomplete="current-password" required />
					</label>
					<button type="submit">Sign in</button>
				</form>
				<a class="link" href="${authPath("/sign-up")}">Create a new account</a>
			</section>
		`,
	);
};

export const renderLogoutPage = ({
	currentUser,
	status,
}: AuthPageProps): string => {
	const statusMessage = getStatusMessage(status);

	return renderPage(
		"Logout",
		`
			<section class="panel">
				<div>
					<p class="eyebrow">Social Web</p>
					<h1>${currentUser ? "Account" : "Signed out"}</h1>
				</div>
				${statusMessage ? `<p class="success">${escapeHtml(statusMessage)}</p>` : ""}
				${
					currentUser
						? `
							<div class="account">
								<span>${escapeHtml(currentUser.name)}</span>
								<small>${escapeHtml(currentUser.email)}</small>
							</div>
							<form method="post" action="${authPath("/logout")}">
								<button type="submit">Log out</button>
							</form>
						`
						: `
							<div class="actions">
								<a class="button-link" href="${authPath("/sign-in")}">Sign in</a>
								<a class="button-link secondary" href="${authPath("/sign-up")}">Sign up</a>
							</div>
						`
				}
			</section>
		`,
	);
};

const renderPage = (title: string, body: string): string => `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<title>${escapeHtml(title)} | Social Web</title>
		<style>
			:root {
				color: #18202f;
				background: #f6f7f9;
				font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
			}

			* {
				box-sizing: border-box;
			}

			body {
				min-height: 100vh;
				margin: 0;
				display: grid;
				place-items: center;
				padding: 24px;
			}

			.panel {
				width: min(100%, 420px);
				display: grid;
				gap: 22px;
				padding: 32px;
				background: #ffffff;
				border: 1px solid #dde2ea;
				border-radius: 8px;
				box-shadow: 0 24px 50px rgba(24, 32, 47, 0.12);
			}

			.eyebrow,
			h1,
			p {
				margin: 0;
			}

			.eyebrow {
				color: #627084;
				font-size: 0.78rem;
				font-weight: 700;
				letter-spacing: 0;
				text-transform: uppercase;
			}

			h1 {
				margin-top: 6px;
				font-size: 2rem;
				line-height: 1.1;
			}

			form {
				display: grid;
				gap: 16px;
			}

			label {
				display: grid;
				gap: 8px;
				color: #313b4d;
				font-size: 0.92rem;
				font-weight: 700;
			}

			input {
				width: 100%;
				height: 44px;
				border: 1px solid #c7ced9;
				border-radius: 8px;
				padding: 0 12px;
				color: #18202f;
				font: inherit;
			}

			input:focus {
				border-color: #147d72;
				box-shadow: 0 0 0 3px rgba(20, 125, 114, 0.16);
				outline: none;
			}

			button,
			.button-link {
				min-height: 44px;
				display: inline-flex;
				align-items: center;
				justify-content: center;
				border: 0;
				border-radius: 8px;
				padding: 0 16px;
				background: #147d72;
				color: #ffffff;
				font: inherit;
				font-weight: 800;
				text-decoration: none;
				cursor: pointer;
			}

			.secondary {
				background: #e8edf3;
				color: #18202f;
			}

			.link {
				color: #147d72;
				font-weight: 800;
				text-decoration: none;
			}

			.error,
			.success,
			.session,
			.account {
				border-radius: 8px;
				padding: 12px 14px;
			}

			.error {
				background: #fff0f0;
				color: #a13636;
			}

			.success {
				background: #eaf8f1;
				color: #166b45;
			}

			.session,
			.account {
				display: grid;
				gap: 4px;
				background: #edf4f7;
				color: #253246;
			}

			.session small,
			.account small {
				color: #627084;
			}

			.actions {
				display: grid;
				grid-template-columns: 1fr 1fr;
				gap: 12px;
			}
		</style>
	</head>
	<body>
		${body}
	</body>
</html>`;

const renderSessionBanner = (user: AuthUser | null): string => {
	if (!user) {
		return "";
	}

	return `
		<div class="session">
			<span>${escapeHtml(user.name)}</span>
			<small>${escapeHtml(user.email)}</small>
		</div>
	`;
};

const renderError = (error?: string): string => {
	return error ? `<p class="error">${escapeHtml(error)}</p>` : "";
};

const getStatusMessage = (status?: string): string | null => {
	if (status === "signed-in") {
		return "Signed in.";
	}

	if (status === "signed-up") {
		return "Account created.";
	}

	if (status === "signed-out") {
		return "Signed out.";
	}

	return null;
};

const escapeHtml = (value: string): string =>
	value.replace(/[&<>"']/g, (char) => {
		const entities: Record<string, string> = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		};

		return entities[char] ?? char;
	});
