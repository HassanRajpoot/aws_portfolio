export function TerminalIntro() {
  return (
    <div className="glass-panel terminal-glow overflow-hidden rounded-xl border border-white/10">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/50" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
          <div className="h-3 w-3 rounded-full bg-green-500/50" />
        </div>
        <div className="font-label-mono text-[10px] uppercase tracking-widest text-slate-500">
          bash — 80x24
        </div>
      </div>
      <div className="p-6 font-label-mono text-sm leading-relaxed">
        <div className="flex items-start gap-2">
          <span className="text-tertiary">➜</span>
          <span className="text-secondary">~</span>
          <span className="text-on-surface">whoami</span>
        </div>
        <div className="mt-2 text-on-surface-variant">
          DevEngine_v2.0.4
          <br />
          Full-Stack Architect
          <br />
          Location: [REDACTED]
          <br />
          Current_Stack: [React, Node, Rust, PostgreSQL]
        </div>
        <div className="mt-4 flex items-start gap-2">
          <span className="text-tertiary">➜</span>
          <span className="text-secondary">~</span>
          <span className="text-on-surface">grep &quot;skills&quot; profile.json</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-primary">
          <span>&quot;Cloud_Computing&quot;</span>
          <span>&quot;Distributed_Systems&quot;</span>
          <span>&quot;UI_UX_Engineering&quot;</span>
          <span>&quot;API_Design&quot;</span>
        </div>
        <div className="mt-4 flex items-start gap-2">
          <span className="text-tertiary">➜</span>
          <span className="text-secondary">~</span>
          <span className="inline-block h-5 w-2 animate-pulse bg-primary-container" />
        </div>
      </div>
    </div>
  );
}
