import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useSkills } from "@/hooks/useSkills";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function SkillStackSection() {
  const { data: skills, isLoading } = useSkills();

  return (
    <section
      className="border-y border-white/5 bg-surface-container-low/30 py-24 md:py-32"
      id="skills"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mb-16 text-center">
          <SectionHeading kicker="02 // CAPABILITIES" title="The tech stack" align="center" />
          <p className="mx-auto mt-4 max-w-xl text-sm text-on-surface-variant">
            End-to-end ownership from interface to infrastructure.{" "}
            <Link className="text-primary underline-offset-2 hover:underline" to="/skills">
              See the full matrix
            </Link>
            .
          </p>
        </div>
        
        {isLoading && <p className="text-center text-on-surface-variant">Loading capabilities...</p>}

        {skills && skills.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 gap-px border border-white/10 bg-white/5 md:grid-cols-4"
          >
            {skills.slice(0, 4).map((p) => (
              <motion.div
                key={p.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(128, 131, 255, 0.05)" }}
                className="glass-panel flex h-full flex-col items-center justify-center space-y-4 p-8 transition-colors md:p-12"
              >
                <MaterialIcon name={p.icon || "code"} className="text-4xl text-primary" filled />
                <span className="font-display-lg text-sm text-on-surface">{p.name}</span>
                <span className="text-center font-label-mono text-[10px] text-slate-500">
                  {p.value_label || "Capability"}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
