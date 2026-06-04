import type { ReactNode } from "react";

type Props = {
  label: string;
  children: ReactNode;
};

export function FormField({ label, children }: Props) {
  const id = label.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="font-label-mono text-[10px] uppercase tracking-widest text-on-surface-variant"
      >
        {label}
      </label>
      <div id={id}>{children}</div>
    </div>
  );
}
