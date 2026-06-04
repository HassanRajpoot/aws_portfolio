import { SectionHeading } from "@/components/ui/SectionHeading";
import { useProjects } from "@/hooks/useProjects";
import { ProjectCard } from "@/components/portfolio/ProjectCard";

export function ProjectsPage() {
  const { data: projects, isLoading, isError } = useProjects();

  return (
    <main className="px-6 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <SectionHeading kicker="Deployments" title="All projects" />
          <p className="mt-4 text-on-surface-variant">
            Case studies across data platforms, systems tooling, and commerce. Open a project for
            architecture notes, stack, and outcomes.
          </p>
        </div>
        
        {isLoading && <p className="text-on-surface-variant">Loading projects...</p>}
        {isError && <p className="text-red-400">Error loading projects.</p>}
        
        {projects && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <div key={p.slug} className={i === 1 ? "lg:mt-10" : ""}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
