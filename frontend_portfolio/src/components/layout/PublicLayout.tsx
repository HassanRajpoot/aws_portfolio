import { Outlet } from "react-router-dom";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background font-body-base text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <SiteHeader />
      <div className="pt-24">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
