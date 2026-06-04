import { Link } from "react-router-dom";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { usePublicSettings } from "@/hooks/useSettings";

export function SiteFooter() {
  const { data: settings } = usePublicSettings();

  return (
    <footer className="w-full border-t border-white/5 bg-slate-950">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-12 md:flex-row md:px-8">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="font-display-lg font-bold text-indigo-500">
            {settings?.site_title || "DevEngine"}
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
            © {new Date().getFullYear()} — Built with technical precision
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 font-mono text-[10px] uppercase tracking-widest">
          <a className="text-slate-600 transition-colors hover:text-indigo-400" href="https://github.com">
            GitHub
          </a>
          <a className="text-slate-600 transition-colors hover:text-indigo-400" href="https://linkedin.com">
            LinkedIn
          </a>
          <Link className="text-slate-600 transition-colors hover:text-indigo-400" to="/contact">
            Contact
          </Link>
        </div>
        <div className="flex gap-4">
          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-primary hover:text-primary">
            <MaterialIcon name="terminal" className="text-sm" />
          </div>
          <Link
            to="/contact"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-primary hover:text-primary"
            aria-label="Email"
          >
            <MaterialIcon name="alternate_email" className="text-sm" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
