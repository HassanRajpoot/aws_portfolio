import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { SkillCategory } from "@/hooks/useSkills";
import { SkillMeter } from "./SkillMeter";

const titleIcon: Record<SkillCategory["accent"], string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export function SkillCategoryPanel({ category }: { category: SkillCategory }) {
  const iconCls = titleIcon[category.accent];
  return (
    <section
      className={`glass-panel glow-indigo group relative overflow-hidden rounded-xl p-8 ${category.colSpan}`}
    >
      <div className="pointer-events-none absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
        <MaterialIcon name={category.icon} className="text-[120px]" />
      </div>
      <div className="relative z-10">
        <div className="mb-8 flex items-center gap-3">
          <MaterialIcon name={category.icon} className={iconCls} />
          <h2 className="font-headline-md text-headline-md uppercase tracking-tighter">{category.title}</h2>
        </div>
        <div
          className={
            category.id === "frontend"
              ? "grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-12"
              : "flex-grow space-y-8"
          }
        >
          {category.meters.map((m) => (
            <SkillMeter key={m.name} {...m} accent={category.accent} />
          ))}
        </div>
        {category.chips && (
          <div className="mt-8 flex flex-wrap gap-2 border-t border-white/5 pt-8">
            {category.chips.map((c) => (
              <span
                key={c}
                className="rounded bg-secondary/10 px-2 py-1 font-label-mono text-[10px] text-secondary"
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
