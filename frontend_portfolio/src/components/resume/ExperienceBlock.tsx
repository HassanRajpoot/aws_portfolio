import { MaterialIcon } from "@/components/ui/MaterialIcon";

type Bullet = { text: string; accent?: "indigo" | "muted" };

type Props = {
  period: string;
  title: string;
  company: string;
  badges: string[];
  bullets: Bullet[];
  tags: string[];
  tagVariant?: "indigo" | "muted";
};

export function ExperienceBlock({
  period,
  title,
  company,
  badges,
  bullets,
  tags,
  tagVariant = "indigo",
}: Props) {
  const tagCls =
    tagVariant === "indigo"
      ? "rounded-full bg-indigo-500/10 text-indigo-400"
      : "rounded-full bg-slate-800 text-slate-400";
  return (
    <div className="glass-panel space-y-6 rounded-xl p-8">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <p className="mb-1 font-label-mono uppercase text-slate-500">{period}</p>
          <h3 className="font-headline-md text-2xl text-on-surface">{title}</h3>
          <p className="font-medium text-on-surface-variant">{company}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] uppercase text-slate-400"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
      <ul className="space-y-3 text-on-surface-variant">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-3">
            <MaterialIcon
              name="double_arrow"
              className={`mt-1.5 text-xs ${b.accent === "muted" ? "text-slate-500" : "text-indigo-500"}`}
            />
            <span>{b.text}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 pt-2">
        {tags.map((t) => (
          <span key={t} className={`px-3 py-1 font-mono text-xs ${tagCls}`}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
