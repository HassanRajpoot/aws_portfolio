import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { Project } from "@/types/project";

const categoryRing: Record<Project["categoryStyle"], string> = {
  primary: "border-primary/30 text-primary",
  secondary: "border-secondary/30 text-secondary",
  tertiary: "border-tertiary/30 text-tertiary",
};

const cardVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function ProjectCard({ project }: { project: Project }) {
  const ring = categoryRing[project.categoryStyle];
  return (
    <motion.div variants={cardVariants} className="flex h-full flex-col">
      <Link
        to={`/projects/${project.slug}`}
        className="group relative flex h-full flex-col overflow-hidden glass-panel transition-all duration-500 hover:-translate-y-2"
      >
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.imageSrc}
            alt={project.imageAlt}
            className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
        </div>
        <div className="flex flex-1 flex-col space-y-4 p-8">
          <div className="flex items-start justify-between">
            <span
              className={`border px-2 py-1 font-label-mono text-[10px] uppercase tracking-widest ${ring}`}
            >
              {project.category}
            </span>
            <MaterialIcon
              name={project.icon}
              className="text-slate-500 transition-colors group-hover:text-primary"
            />
          </div>
          <h3 className="font-display-lg text-xl text-on-surface">{project.title}</h3>
          <p className="line-clamp-2 font-body-sm text-sm text-on-surface-variant">
            {project.description}
          </p>
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="bg-white/5 px-2 py-0.5 font-label-mono text-[10px] text-slate-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
