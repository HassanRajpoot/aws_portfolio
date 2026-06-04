import { Link } from "react-router-dom";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function ResumePreviewSection() {
  return (
    <section className="px-6 py-24 md:px-8 md:py-32" id="resume">
      <div className="mx-auto grid max-w-7xl items-start gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="space-y-12">
          <div className="space-y-4">
            <SectionHeading kicker="03 // EXPERIENCE" title="Professional trajectory" />
            <p className="leading-relaxed text-on-surface-variant">
              Six+ years shipping for startups and enterprise. Documentation, reliability, and
              measurable outcomes come standard.
            </p>
          </div>
          <div className="space-y-8">
            <div className="relative border-l border-primary-container/30 pl-8">
              <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-primary-container" />
              <span className="font-label-mono text-xs text-primary">2021 — PRESENT</span>
              <h4 className="mt-1 text-lg font-bold text-on-surface">Senior Full-Stack Engineer</h4>
              <p className="mt-1 font-label-mono text-sm uppercase tracking-widest text-slate-500">
                TechSphere Solutions
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Mission-critical cloud infrastructure and microservices for fintech.
              </p>
            </div>
            <div className="relative border-l border-white/10 pl-8">
              <span className="font-label-mono text-xs text-slate-500">2018 — 2021</span>
              <h4 className="mt-1 text-lg font-bold text-on-surface">Software Developer</h4>
              <p className="mt-1 font-label-mono text-sm uppercase tracking-widest text-slate-500">
                Nova Graphics Inc.
              </p>
              <p className="mt-2 text-sm text-on-surface-variant">
                Data visualization and responsive interfaces for analysts.
              </p>
            </div>
          </div>
          <Link
            to="/resume"
            className="inline-flex items-center gap-3 border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:bg-white/10 active:scale-95"
          >
            <MaterialIcon name="download" className="text-sm" />
            Full resume
          </Link>
        </div>
        <div className="relative">
          <div className="glass-panel relative z-10 rotate-2 rounded-xl p-8 shadow-2xl transition-transform duration-500 hover:rotate-0">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded bg-indigo-500 font-bold text-slate-950">
                  DE
                </div>
                <div>
                  <h5 className="text-sm font-bold">DevEngine</h5>
                  <p className="text-[10px] text-slate-500">Curriculum Vitae v24.1</p>
                </div>
              </div>
              <MaterialIcon name="verified" className="text-slate-500" />
            </div>
            <div className="space-y-6">
              <div className="h-2 w-3/4 rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="h-1.5 w-full rounded-full bg-white/5" />
                <div className="h-1.5 w-5/6 rounded-full bg-white/5" />
                <div className="h-1.5 w-4/6 rounded-full bg-white/5" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-4">
                <div className="h-8 rounded border border-indigo-500/20 bg-indigo-500/20" />
                <div className="h-8 rounded border border-indigo-500/20 bg-indigo-500/20" />
                <div className="h-8 rounded border border-indigo-500/20 bg-indigo-500/20" />
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 rounded-full bg-primary-container/20 blur-3xl" />
          <div className="glass-panel absolute -right-2 top-10 -z-10 h-full w-full -rotate-3 rounded-xl opacity-50" />
        </div>
      </div>
    </section>
  );
}
