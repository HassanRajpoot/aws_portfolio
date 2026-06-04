import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isSignedIn, signIn } from "@/lib/auth";

export function AdminSignInPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      await signIn(email, password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err: unknown) {
      // Extract DRF validation errors
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as Record<string, unknown>).response === "object"
      ) {
        const resp = (err as { response: { data?: unknown } }).response;
        const data = resp?.data;
        if (typeof data === "object" && data !== null) {
          const detail =
            (data as Record<string, unknown>).detail ??
            (data as Record<string, unknown>).non_field_errors;
          if (Array.isArray(detail)) {
            setError(detail.join(" "));
          } else if (typeof detail === "string") {
            setError(detail);
          } else {
            setError("Invalid email or password.");
          }
        } else {
          setError("Invalid email or password.");
        }
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="glass-panel w-full max-w-md rounded-2xl p-8 md:p-10">
        <p className="font-label-mono text-[10px] uppercase tracking-widest text-primary">Admin access</p>
        <h1 className="mt-2 font-display-lg text-headline-md text-on-surface">Sign in</h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          Single-user mode is enabled. Only the owner account can access admin.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="font-label-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="font-label-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary/20"
              placeholder="********"
            />
          </div>
          {error ? <p className="text-xs text-rose-300">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-bold uppercase tracking-widest text-on-primary transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <Link to="/" className="mt-6 inline-block text-xs text-slate-400 hover:text-primary">
          {"<- Back to portfolio"}
        </Link>
      </div>
    </main>
  );
}
