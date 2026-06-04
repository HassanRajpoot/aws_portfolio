import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";
import { useProjects } from "@/hooks/useProjects";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function FeaturedProjectsSection() {
  const { data: projects, isLoading, isError } = useProjects();

  return (
    <section className="px-6 py-24 md:px-8" id="projects">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading kicker="01 // DEPLOYMENTS" title="Featured projects" />
          <Link
            to="/projects"
            className="font-label-mono text-xs uppercase tracking-widest text-primary hover:text-white transition-colors"
          >
            View all →
          </Link>
        </div>
        {isLoading && <p className="text-on-surface-variant">Loading projects...</p>}
        {isError && <p className="text-red-400">Error loading projects.</p>}
        
        {projects && projects.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-8 md:flex-row md:items-stretch"
          >
            {projects.slice(0, 3).map((p) => (
              <div key={p.slug} className="flex-1">
                <ProjectCard project={p} />
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
