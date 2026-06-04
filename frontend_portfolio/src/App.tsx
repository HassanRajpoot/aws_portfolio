import { lazy, Suspense, type ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { isSignedIn } from "@/lib/auth";
import { ContactPage } from "@/pages/ContactPage";
import { AdminSignInPage } from "@/pages/AdminSignInPage";
import { AdminSettingsPage } from "@/pages/AdminSettingsPage";
import { HomePage } from "@/pages/HomePage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { ResumePage } from "@/pages/ResumePage";
import { SkillsPage } from "@/pages/SkillsPage";

const AdminDashboard = lazy(() =>
  import("@/components/stitch/AdminDashboard").then((m) => ({ default: m.AdminDashboard }))
);
const ResumeManager = lazy(() =>
  import("@/components/stitch/ResumeManager").then((m) => ({ default: m.ResumeManager }))
);
const ProjectEditor = lazy(() =>
  import("@/components/stitch/ProjectEditor").then((m) => ({ default: m.ProjectEditor }))
);

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background font-body-base text-on-surface">
      <div className="font-label-mono text-sm uppercase tracking-widest text-primary">Loading...</div>
    </div>
  );
}

function AdminProtected({ children }: { children: ReactNode }) {
  if (!isSignedIn()) {
    return <Navigate to="/admin/sign-in" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        <Route path="/admin/sign-in" element={<AdminSignInPage />} />
        <Route path="/admin" element={<Navigate to="/admin/sign-in" replace />} />

        <Route
          path="/admin/dashboard"
          element={
            <AdminProtected>
              <Suspense fallback={<AdminFallback />}>
                <AdminDashboard />
              </Suspense>
            </AdminProtected>
          }
        />
        <Route
          path="/admin/resume"
          element={
            <AdminProtected>
              <Suspense fallback={<AdminFallback />}>
                <ResumeManager />
              </Suspense>
            </AdminProtected>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminProtected>
              <AdminSettingsPage />
            </AdminProtected>
          }
        />
        <Route
          path="/admin/project-editor"
          element={
            <AdminProtected>
              <Suspense fallback={<AdminFallback />}>
                <ProjectEditor />
              </Suspense>
            </AdminProtected>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
