import { Link } from "react-router-dom";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { ExperienceBlock } from "@/components/resume/ExperienceBlock";
import { useExperience, useEducation, useCertifications } from "@/hooks/useResume";
import { usePublicSettings } from "@/hooks/useSettings";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "PRESENT";
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

export function ResumePage() {
  const { data: experiences, isLoading: loadingExp } = useExperience();
  const { data: education, isLoading: loadingEdu } = useEducation();
  const { data: certifications } = useCertifications();
  const { data: settings } = usePublicSettings();

  return (
    <main className="mx-auto max-w-container-max px-6 pb-24 pt-8 md:px-12">
      <header className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
            <span className="font-label-mono uppercase text-indigo-400">Available for deployment</span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface">{settings?.site_title || "Alex_Rivers.sh"}</h1>
          <p className="max-w-2xl text-body-base text-on-surface-variant">
            {settings?.about_me || "Senior full-stack architect: distributed systems, reactive UI, and cloud-native delivery."}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="flex items-center gap-2 rounded px-6 py-3 font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-indigo-500 bg-indigo-600"
          >
            <MaterialIcon name="download" />
            Download PDF
          </button>
          <Link
            to="/contact"
            className="flex items-center gap-2 rounded border border-indigo-500/30 px-6 py-3 font-medium text-indigo-400 transition-all hover:bg-indigo-500/10"
          >
            <MaterialIcon name="mail" />
            Get in touch
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        <section className="space-y-gutter md:col-span-8">
          <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-4">
            <MaterialIcon name="history" className="text-indigo-500" />
            <h2 className="font-headline-md text-headline-md uppercase tracking-tight">
              Deployment history
            </h2>
            <div className="h-px flex-grow bg-white/10" />
          </div>
          
          {loadingExp && <p className="text-on-surface-variant">Loading experience...</p>}
          
          {experiences?.map((exp) => (
            <ExperienceBlock
              key={exp.id}
              period={`${formatDate(exp.start_date)} — ${formatDate(exp.end_date)}`}
              title={exp.role_title}
              company={exp.company_name}
              badges={[exp.location, exp.employment_type].filter(Boolean) as string[]}
              bullets={
                exp.description
                  ? exp.description.split("\n").filter(Boolean).map((text) => ({ text }))
                  : []
              }
              tags={[]}
            />
          ))}
        </section>

        <aside className="space-y-gutter md:col-span-4">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <MaterialIcon name="school" className="text-indigo-500" />
              <h2 className="font-headline-md text-xl uppercase tracking-tight">Academic base</h2>
            </div>
            
            {loadingEdu && <p className="text-sm text-on-surface-variant">Loading education...</p>}
            
            <div className="space-y-4">
              {education?.map((edu) => (
                <div key={edu.id} className="glass-panel rounded-xl border-l-4 border-indigo-500 p-6">
                  <p className="mb-2 font-label-mono text-indigo-500">
                    {formatDate(edu.start_date)} — {formatDate(edu.end_date)}
                  </p>
                  <h4 className="font-bold uppercase text-on-surface">{edu.degree}</h4>
                  <p className="text-sm text-on-surface-variant">{edu.institution}</p>
                  {edu.details && (
                    <p className="mt-2 font-mono text-[10px] text-slate-500">{edu.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-8 flex items-center gap-4">
              <MaterialIcon name="verified" className="text-indigo-500" />
              <h2 className="font-headline-md text-xl uppercase tracking-tight">Verified auth</h2>
            </div>
            <div className="space-y-4">
              {certifications?.map((c) => (
                <div
                  key={c.id}
                  className="glass-panel flex items-center gap-4 rounded-xl p-4 transition-all hover:border-indigo-500/50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded bg-indigo-500/10">
                    <MaterialIcon name={c.icon as any} className="text-indigo-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase">{c.title}</h4>
                    {c.meta && (
                      <p className="font-mono text-xs text-slate-500">{c.meta}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
