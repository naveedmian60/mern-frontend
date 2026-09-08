import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <p className="spec text-6xl text-brass">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Page not found.</h1>
      <p className="mt-2 text-sm text-ink-soft">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary mt-8 rounded-full px-8 py-3.5 text-sm font-medium">
        Back to Home
      </Link>
    </div>
  );
} 