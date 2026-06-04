import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function ContactCtaSection() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-32" id="contact">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-5xl text-center"
      >
        <div className="glass-panel terminal-glow space-y-8 rounded-3xl p-12 md:p-16">
          <h2 className="font-display-lg text-headline-md text-on-surface text-glow">
            Ready for your next build?
          </h2>
          <p className="mx-auto max-w-xl text-on-surface-variant leading-relaxed">
            Freelance engagements, architecture reviews, and greenfield product work. Currently
            accepting select projects for Q3/Q4.
          </p>
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Link
              to="/contact"
              className="bg-primary px-10 py-4 text-sm font-bold uppercase tracking-widest text-on-primary transition-all hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(192,193,255,0.2)]"
            >
              Open secure channel
            </Link>
            <a
              href="mailto:hello@devengine.io"
              className="border border-outline px-10 py-4 text-sm font-bold uppercase tracking-widest text-on-surface transition-all hover:bg-white/5 active:scale-95"
            >
              Email directly
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
