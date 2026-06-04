import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signOut } from "@/lib/auth";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";

export function AdminSettingsPage() {
  const navigate = useNavigate();
  const { data: settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    navigate("/admin/sign-in", { replace: true });
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const payload = {
      site_title: formData.get("site_title") as string,
      site_subtitle: formData.get("site_subtitle") as string,
      about_me: formData.get("about_me") as string,
      contact_email: formData.get("contact_email") as string,
      is_maintenance_mode: formData.get("maintenance") === "on",
    };
    updateMutation.mutate(payload, {
      onSuccess: () => toast.success("Settings saved."),
      onError: () => toast.error("Failed to save settings."),
    });
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="font-label-mono text-sm uppercase tracking-widest text-primary">
          Loading settings…
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-6 pb-16 pt-24 md:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="rounded-lg border border-white/10 bg-surface-container-low px-4 py-2 font-label-mono text-[10px] uppercase tracking-widest text-slate-300 transition-colors hover:text-white"
            >
              ← Back to dashboard
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2 font-label-mono text-[10px] uppercase tracking-widest text-rose-300 transition-colors hover:text-rose-200 disabled:opacity-50"
            >
              {signingOut ? "Signing out…" : "Sign out"}
            </button>
          </div>

          <div>
            <p className="font-label-mono text-[10px] uppercase tracking-widest text-primary">
              Owner workspace
            </p>
            <h1 className="font-display-lg text-headline-md text-on-surface">Settings</h1>
            <p className="text-sm text-on-surface-variant">
              Global controls for your single-owner portfolio workspace.
            </p>
          </div>
        </header>

        <form onSubmit={handleSave} className="space-y-8">
          <section className="glass-panel rounded-xl p-6 md:p-8">
            <h2 className="mb-6 font-headline-md text-xl text-on-surface">General</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2">
                <span className="font-label-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Site title
                </span>
                <input
                  name="site_title"
                  className="w-full rounded-lg border border-white/10 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
                  defaultValue={settings?.site_title ?? ""}
                />
              </label>
              <label className="space-y-2">
                <span className="font-label-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Site subtitle
                </span>
                <input
                  name="site_subtitle"
                  className="w-full rounded-lg border border-white/10 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
                  defaultValue={settings?.site_subtitle ?? ""}
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="font-label-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Contact email
                </span>
                <input
                  name="contact_email"
                  type="email"
                  className="w-full rounded-lg border border-white/10 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary"
                  defaultValue={settings?.contact_email ?? ""}
                />
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="font-label-mono text-[10px] uppercase tracking-widest text-slate-500">
                  About Me / Career Bio
                </span>
                <textarea
                  name="about_me"
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-primary font-body-base"
                  defaultValue={settings?.about_me ?? ""}
                />
              </label>
            </div>
          </section>

          <section className="glass-panel rounded-xl p-6 md:p-8">
            <h2 className="mb-6 font-headline-md text-xl text-on-surface">Publishing</h2>
            <div className="space-y-4 text-sm text-on-surface-variant">
              <label className="flex items-center justify-between rounded-lg border border-white/10 bg-surface-container-low px-4 py-3">
                <span>Enable maintenance banner</span>
                <input
                  name="maintenance"
                  type="checkbox"
                  defaultChecked={settings?.is_maintenance_mode ?? false}
                  className="h-4 w-4 accent-indigo-500"
                />
              </label>
            </div>
          </section>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full rounded-lg bg-primary py-3 text-sm font-bold uppercase tracking-widest text-on-primary transition-all hover:brightness-110 active:scale-[0.99] disabled:opacity-50 md:w-auto md:px-12"
          >
            {updateMutation.isPending ? "Saving…" : "Save settings"}
          </button>
        </form>
      </div>
    </main>
  );
}
