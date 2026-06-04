import { Link } from "react-router-dom";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { Project } from "@/types/project";

const heroImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDbufBunb0_-F8JRx9SWGaV5XjQ84xxU-vRDZsDZqJ3mAqvkGkoIsMfpSBilBIc2IXz8BVdMqpQJya6ZTjPAVjHvk5ouV1aauwBBNmVlCVQ9RvGd9GCsr-XbgkTGU0e2DLSNeNyQL1YJ4RUGtSg_Uc9y1hjjV3EYs8f_ROkJ4CYIAgf_7TOr_0W3EYNNHtOnHtyHseljYvXeCK4br0DEhjwX_Y1yO4lPPF4n4Y6CrtDbJ3QeMsDLgXplMIcMuzTP7LBgQIGkts2XuBu";

const gallery = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBpQjIWrelCutkARqJgYo9iKRYz2xOj__N3Aok9qsQ_zyBQspjY10ryk90EzCbOXEVQ4kfLieZg4zrv7uP2hpz7ZJtR4TslELPv2hGAX7H8MiG3Uzvzdlb5nZ1FI74EV2XEo4F_2jYAkTlNENB0jvIAf2h16E3HMh4plDu6ZZdMB3j0ByEURfbW5YdS4QZ-4gMEf56iZIrDWdFvPo1S60waeuH14Ws41SjWn1hC5bj-rLKMeFW2Ne9Fo1KA314QmgBMoxvpmIU_sGp9",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDPHeHhtrGwXQyEvla6qSLWb0GR0breKj2cOyr_tHGxwVxBljtvfEpWa5Vo9cbLVcNxULkCY5jgboIxN1GUX07CrAwmLIZX7Bye-hBkgT60GhCDuiHuVW9jH5rqir6BlLZLjjvljEEyWRT0w1OTqz6EosmwAWgMXAdCWkqs_3yADEA7Aa3SwRpuzgpxfDkTruoqK588vHkoBJ1qVQuRBEkAoZjQqhW_00yc-BDS7p8ImvmtJZ3LArLvd7s-GL-q0InXfjAyx_HXtktB",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDtnwU1HJ11lY4qVfgBmX0KsG33QpdVfPT13f6jgCAN6Cf_UpMw4azwoRCRl8iAy2cMEDVjVBlfCQzKSiG6z8514hOQoDoZuk6JJTAxaNiJIZwPZGehfaRkQb_BMhXVyXPlHKA30VFrZJ7gKEz2FmlyeeslY95zg5EXXMaBvLetJHFzcaw4WYJ5JqhHaaExIKEm7bs551jgJV8NOo1PAcBaspjA2xwRUY1tqi2y7Jf-pMDPQ5JV8LaNMqsfp4MSNmL_ac4Ldv6AsMSV",
];

type Props = { project: Project };

export function ProjectQuantumStory({ project }: Props) {
  return (
    <main className="min-h-screen w-full pb-16">
      <div className="border-b border-white/5 px-6 py-6 md:px-12">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-label-mono text-xs uppercase tracking-widest text-primary hover:text-white"
        >
          ← All projects
        </Link>
      </div>
      <section className="relative h-[min(70vh,640px)] w-full overflow-hidden">
        <img src={heroImg} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12">
          <div className="mx-auto flex max-w-container-max flex-col gap-4">
            <span className="flex items-center gap-2 font-label-mono uppercase tracking-[0.3em] text-indigo-400">
              <span className="h-px w-8 bg-indigo-500" />
              Deployment ID: AX-902
            </span>
            <h1 className="font-display-lg text-display-lg text-on-surface">QUANTUM_FLOW v1.0</h1>
            <p className="max-w-2xl font-body-base text-on-surface-variant">
              {project.description} Real-time pipeline architecture for high-concurrency financial
              workloads.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-container-max gap-gutter px-6 py-12 md:grid-cols-12 md:px-12">
        <div className="flex flex-col gap-gutter md:col-span-4">
          <div className="glass-panel flex flex-col gap-4 rounded-lg p-6">
            <h3 className="border-b border-white/5 pb-2 font-label-mono uppercase text-indigo-400">
              Technical stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Rust", "Kubernetes", "gRPC", "WebAssembly", "PostgreSQL", "Redis"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 font-mono text-[10px] uppercase text-indigo-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-panel flex flex-col gap-3 rounded-lg p-6">
            <h3 className="border-b border-white/5 pb-2 font-label-mono uppercase text-indigo-400">
              Actions
            </h3>
            <a
              className="flex items-center justify-between rounded bg-indigo-600 p-3 text-white transition-all hover:bg-indigo-500"
              href="https://example.com/live-demo"
            >
              <span className="font-mono text-xs font-bold">LIVE_DEMO</span>
              <MaterialIcon name="open_in_new" className="text-sm" />
            </a>
            <a
              className="flex items-center justify-between rounded border border-white/10 p-3 text-on-surface transition-all hover:bg-white/5"
              href="https://github.com"
            >
              <span className="font-mono text-xs font-bold">SOURCE_CODE</span>
              <MaterialIcon name="terminal" className="text-sm" />
            </a>
          </div>
          <div className="glass-panel rounded-lg bg-indigo-500/5 p-6">
            <div className="mb-2 flex items-center gap-2">
              <MaterialIcon name="memory" className="text-tertiary" />
              <h3 className="font-label-mono uppercase text-tertiary">Core metrics</h3>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              <div>
                <span className="font-display-lg text-2xl text-on-surface">0.4ms</span>
                <p className="font-mono text-[10px] uppercase text-slate-500">Latency</p>
              </div>
              <div>
                <span className="font-display-lg text-2xl text-on-surface">1.2M</span>
                <p className="font-mono text-[10px] uppercase text-slate-500">Req/sec</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-gutter md:col-span-8">
          <div className="glass-panel rounded-lg p-8">
            <h2 className="mb-6 flex items-center gap-3 font-headline-md text-headline-md text-on-surface">
              <span className="h-8 w-2 bg-indigo-500" />
              Project overview
            </h2>
            <p className="mb-6 leading-relaxed text-on-surface-variant">
              QUANTUM_FLOW addresses synchronization across geographically distributed trading nodes.
              A custom consensus layer in Rust preserves ACID semantics under a sub-millisecond
              latency ceiling.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="border-l-2 border-indigo-500/30 bg-white/5 p-4">
                <h4 className="mb-2 font-label-mono text-xs text-indigo-400">OBJECTIVE</h4>
                <p className="text-sm text-on-surface-variant">
                  Minimize propagation delay across Tier-4 data centers while maintaining 99.999%
                  uptime.
                </p>
              </div>
              <div className="border-l-2 border-indigo-500/30 bg-white/5 p-4">
                <h4 className="mb-2 font-label-mono text-xs text-indigo-400">RESOLUTION</h4>
                <p className="text-sm text-on-surface-variant">
                  Multi-threaded sharding with zero-copy memory mapping for hot paths.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            {[
              {
                icon: "bolt" as const,
                title: "Asynchronous engine",
                body: "Non-blocking I/O on the Tokio runtime for maximum CPU efficiency.",
              },
              {
                icon: "security" as const,
                title: "End-to-end encryption",
                body: "Hardware-accelerated AES-256-GCM at the transport layer.",
              },
              {
                icon: "query_stats" as const,
                title: "Real-time telemetry",
                body: "Prometheus + Grafana with millisecond-level visibility.",
              },
              {
                icon: "hub" as const,
                title: "Dynamic scaling",
                body: "Kubernetes controller for throughput-aware autoscaling.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="glass-panel rounded-lg p-6 transition-colors hover:border-indigo-500/40"
              >
                <MaterialIcon name={f.icon} className="mb-4 text-3xl text-indigo-500" />
                <h4 className="mb-2 font-space-grotesk text-lg font-bold text-on-surface">{f.title}</h4>
                <p className="text-sm text-on-surface-variant">{f.body}</p>
              </div>
            ))}
          </div>

          <div className="glass-panel rounded-lg p-8">
            <h2 className="mb-6 flex items-center gap-3 font-headline-md text-headline-md text-on-surface">
              <span className="h-8 w-2 bg-indigo-500" />
              Engineering challenges
            </h2>
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-surface-container-high font-mono text-xl text-indigo-400">
                  01
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-on-surface">The race condition paradox</h4>
                  <p className="text-sm text-on-surface-variant">
                    Lock-free structures and atomic reference counting replaced coarse locking under
                    peak load.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-surface-container-high font-mono text-xl text-indigo-400">
                  02
                </div>
                <div>
                  <h4 className="mb-2 font-bold text-on-surface">Memory fragmentation</h4>
                  <p className="text-sm text-on-surface-variant">
                    Pool allocator strategy stabilized long-running ingestion workers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {gallery.map((src, i) => (
              <div key={src} className="glass-panel h-48 overflow-hidden rounded-lg">
                <img
                  src={src}
                  alt={i === 0 ? "Architecture" : i === 1 ? "IDE" : "Metrics"}
                  className="h-full w-full cursor-zoom-in object-cover grayscale transition-all hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
