type Props = {
  kicker: string;
  title: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ kicker, title, align = "left", className = "" }: Props) {
  const alignCls = align === "center" ? "text-center" : "";
  return (
    <div className={`space-y-4 ${alignCls} ${className}`.trim()}>
      <span className="font-label-mono text-primary uppercase tracking-[0.3em]">{kicker}</span>
      <h2 className="font-display-lg text-headline-md text-on-surface">{title}</h2>
    </div>
  );
}
