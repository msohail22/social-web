import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMe, logout } from "../services/auth";

export default function HomePage() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
  });

  useEffect(() => {
    if (isError) {
      navigate("/login", { replace: true });
    }
  }, [isError, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <main className="min-h-screen bg-[#f7f4ef] px-6 py-16">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Placeholder
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[#12100c]">
            Welcome home
          </h1>
          <p className="mt-2 text-[#655a52]">
            This is your post-login landing page. Replace it with the feed.
          </p>
        </header>

        <section className="rounded-3xl border border-amber-100 bg-white/80 p-8 shadow-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[#655a52]">Session</p>
              <p className="mt-1 text-lg font-semibold text-[#12100c]">
                {data?.user.email ?? (isLoading ? "Checking session..." : "")}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-[#12100c] px-5 py-2 text-sm font-semibold text-[#12100c] transition hover:bg-[#12100c] hover:text-white"
            >
              Log out
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
