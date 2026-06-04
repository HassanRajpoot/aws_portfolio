import { SkillCategoryPanel } from "@/components/skills/SkillCategoryPanel";
import { useSkills, SkillCategory } from "@/hooks/useSkills";

export function SkillsPage() {
  const { data: skills, isLoading, isError } = useSkills();

  // Create a single grouped category for all backend skills
  const singleCategory: SkillCategory | null = skills ? {
    id: "core",
    title: "Core Capabilities",
    icon: "code",
    accent: "primary",
    colSpan: "lg:col-span-12",
    meters: skills.map((s) => ({
      name: s.name,
      valueLabel: s.value_label || "PROFICIENT",
      score: s.score || 80,
    })),
  } : null;

  return (
    <main className="px-6 py-16 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16">
          <div className="mb-4 flex items-center gap-4">
            <span className="h-1 w-12 bg-primary" />
            <span className="font-label-mono text-label-mono uppercase text-primary">
              System capabilities
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface mb-6">Skills & tech stack</h1>
          <p className="max-w-2xl font-body-base text-on-surface-variant">
            Depth across the lifecycle: product UI, service boundaries, data stores, and how code
            ships to production.
          </p>
        </header>

        {isLoading && <p className="text-on-surface-variant">Loading skills...</p>}
        {isError && <p className="text-red-400">Failed to load skills.</p>}

        {singleCategory && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
            <SkillCategoryPanel category={singleCategory} />
          </div>
        )}
      </div>
    </main>
  );
}
