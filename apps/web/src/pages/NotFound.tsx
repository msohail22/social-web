import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-900 text-slate-200">
      <h1 className="text-7xl font-bold">404</h1>
      <p className="mt-3 text-lg">Oops! Page not found.</p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-500 px-5 py-2 text-white transition hover:bg-blue-600"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;