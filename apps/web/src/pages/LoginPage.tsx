import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f4ef]">
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-16">
        <section className="w-full rounded-3xl border border-amber-100 bg-white/90 p-8 shadow-[0_18px_40px_rgba(18,16,12,0.12)]">
          <div>
            <h1 className="text-3xl font-semibold text-[#12100c]">Log in</h1>
            <p className="mt-2 text-sm text-[#655a52]">
              First login creates your account.
            </p>
          </div>

          <form
            className="mt-8 grid gap-4"
            onSubmit={async (event) => {
              event.preventDefault();
              setError(null);
              setIsSubmitting(true);

              try {
                await login(email.trim(), password);
                navigate("/home", { replace: true });
              } catch (err) {
                const message =
                  err instanceof Error ? err.message : "Login failed";
                setError(message);
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <label className="grid gap-2 text-sm font-medium text-[#3f3731]">
              <span>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@socialweb.dev"
                className="h-12 rounded-2xl border border-amber-100 bg-white px-4 text-base text-[#12100c] shadow-sm outline-none transition focus:border-[#0ea5a0] focus:ring-2 focus:ring-[#0ea5a0]/30"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-[#3f3731]">
              <span>Password</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
                className="h-12 rounded-2xl border border-amber-100 bg-white px-4 text-base text-[#12100c] shadow-sm outline-none transition focus:border-[#0ea5a0] focus:ring-2 focus:ring-[#0ea5a0]/30"
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 rounded-2xl bg-[#0ea5a0] px-5 text-base font-semibold text-white shadow-lg shadow-[#0ea5a0]/30 transition hover:bg-[#0b8c88] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Signing in..." : "Continue"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
