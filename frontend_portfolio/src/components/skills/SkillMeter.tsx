type Props = {
  name: string;
  valueLabel: string;
  score: number;
  accent: "primary" | "secondary" | "tertiary";
};

const bar: Record<Props["accent"], string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

const label: Record<Props["accent"], string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
};

export function SkillMeter({ name, valueLabel, score, accent }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between">
        <span className="font-body-sm text-on-surface-variant">{name}</span>
        <span className={`font-label-mono text-[10px] ${label[accent]}`}>{valueLabel}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-surface-variant">
        <div 
          className={`progress-glow h-full ${bar[accent]}`} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
}
