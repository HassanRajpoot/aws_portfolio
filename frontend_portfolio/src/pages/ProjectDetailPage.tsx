import { Link, Navigate, useParams } from "react-router-dom";
import { ProjectQuantumStory } from "./projects/ProjectQuantumStory";
import { useProject } from "@/hooks/useProjects";

export function ProjectDetailPage() {
  const { slug } = useParams();
  const { data: project, isLoading, isError } = useProject(slug);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16 md:px-8 text-on-surface">
        <p className="text-on-surface-variant">Loading project details...</p>
      </main>
    );
  }

  if (isError || (!isLoading && !project)) {
    return <Navigate to="/projects" replace />;
  }

  if (slug === "quantum-metrics") {
    return <ProjectQuantumStory project={project!} />;
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-8">
      <Link
        to="/projects"
        className="mb-8 inline-flex items-center gap-2 font-label-mono text-xs uppercase tracking-widest text-primary hover:text-white"
      >
        ← All projects
      </Link>
      <div className="glass-panel space-y-6 rounded-2xl p-8 md:p-12">
        <span className="font-label-mono text-[10px] uppercase tracking-widest text-secondary">
          {project!.category}
        </span>
        <h1 className="font-display-lg text-headline-md text-on-surface">{project!.title}</h1>
        <p className="text-lg text-on-surface-variant">{project!.description}</p>
        <div className="flex flex-wrap gap-2 pt-4">
          {project!.tags && project!.tags.map((t) => (
            <span key={t} className="bg-white/5 px-3 py-1 font-label-mono text-xs text-slate-400">
              {t}
            </span>
          ))}
        </div>
        <p className="pt-6 text-sm text-on-surface-variant">
          Full case study for this deployment is in progress. Reach out via{" "}
          <Link className="text-primary underline" to="/contact">
            contact
          </Link>{" "}
          for architecture diagrams and metrics.
        </p>
      </div>
    </main>
  );
}
