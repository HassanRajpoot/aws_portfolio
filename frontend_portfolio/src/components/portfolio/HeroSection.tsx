import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { MeshBackdrop } from "./MeshBackdrop";
import { TerminalIntro } from "./TerminalIntro";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-6rem)] flex-col justify-center px-6 py-16 md:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2"
      >
        <div className="space-y-8">
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-primary-container/20 bg-primary-container/10 px-3 py-1 font-label-mono text-xs text-primary-container"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary" />
            </span>
            <span>SYSTEM STATUS: OPERATIONAL</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="font-display-lg text-display-lg text-on-surface"
          >
            Engineering{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]">
              Next-Gen
            </span>{" "}
            Digital Architectures.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-xl text-lg leading-relaxed text-on-surface-variant"
          >
            Full-stack developer specializing in high-performance, scalable applications with
            technical precision and editorial aesthetics.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/projects"
              className="bg-primary-container px-8 py-4 text-sm font-bold uppercase tracking-widest text-on-primary-container transition-all terminal-glow hover:brightness-110 active:scale-95"
            >
              View projects
            </Link>
            <Link
              to="/contact"
              className="border border-outline-variant px-8 py-4 text-sm font-bold uppercase tracking-widest text-on-surface transition-all hover:bg-white/5 active:scale-95"
            >
              Start a build
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <TerminalIntro />
        </motion.div>
      </motion.div>
      <MeshBackdrop />
    </section>
  );
}
