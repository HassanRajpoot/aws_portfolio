import { NavLink, Link } from "react-router-dom";
import { publicNav } from "@/config/nav";
import { usePublicSettings } from "@/hooks/useSettings";
import { isSignedIn } from "@/lib/auth";

function navClassName(isActive: boolean) {
  return [
    "font-space-grotesk tracking-tight text-sm transition-colors duration-200",
    isActive
      ? "text-indigo-400 font-bold border-b-2 border-indigo-500 pb-1"
      : "text-slate-400 font-medium hover:text-white",
  ].join(" ");
}

export function SiteHeader() {
  const adminLoggedIn = isSignedIn();
  const { data: settings } = usePublicSettings();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4 md:px-8">
        <Link
          to="/"
          className="font-display-lg text-xl font-bold tracking-tighter text-indigo-500"
        >
          {settings?.site_title || "DevEngine"}{" "}
          <span className="text-on-surface-variant text-sm font-normal tracking-normal">
            {settings?.site_subtitle || "Portfolio"}
          </span>
        </Link>

        <nav className="hidden items-center space-x-8 md:flex">
          {publicNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => navClassName(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="material-symbols-outlined text-slate-400 transition-colors hover:text-white"
            aria-label="Terminal"
          >
            terminal
          </button>

          {adminLoggedIn ? (
            <Link
              to="/admin/dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary transition-colors hover:bg-primary/20"
              aria-label="Admin logged in"
              title="Admin logged in"
            >
              <span className="material-symbols-outlined text-lg">account_circle</span>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
