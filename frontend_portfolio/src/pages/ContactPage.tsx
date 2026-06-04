import { FormEvent } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { FormField } from "@/components/contact/FormField";
import { usePublicSettings } from "@/hooks/useSettings";
import { useContact } from "@/hooks/useContact";

export function ContactPage() {
  const { data: settings, isLoading: isLoadingSettings } = usePublicSettings();
  const contactMutation = useContact();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    if (!payload.name || !payload.email || !payload.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await contactMutation.mutateAsync(payload);
      toast.success("Message transmitted successfully.");
      e.currentTarget.reset();
    } catch (error) {
      toast.error("Transmission failed. Please try again later.");
    }
  }

  const contactEmail = settings?.contact_email || "loading...";

  return (
    <main className="mx-auto max-w-container-max px-4 pb-24 pt-8 md:px-16">
      <header className="mb-16 max-w-3xl">
        <span className="mb-4 block font-label-mono uppercase tracking-widest text-primary">
          Initialization complete
        </span>
        <h1 className="mb-6 font-display-lg text-on-surface">Let&apos;s build the future together.</h1>
        <p className="max-w-2xl text-body-base text-on-surface-variant">
          Architectural consultations, full-stack delivery, or embedded with your team — reach out
          with scope, timeline, and constraints.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        <section className="glass-panel rounded-xl p-8 shadow-2xl md:col-span-7">
          <div className="mb-8 flex items-center gap-2">
            <MaterialIcon name="mail" className="text-primary" />
            <h2 className="font-headline-md text-on-surface">Secure channel</h2>
          </div>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField label="Name_ID">
                <input
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 font-body-sm text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </FormField>
              <FormField label="Email_Address">
                <input
                  name="email"
                  type="email"
                  placeholder="you@company.io"
                  className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 font-body-sm text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </FormField>
            </div>
            <FormField label="Subject_Header">
              <input
                name="subject"
                type="text"
                placeholder="Project / role / partnership"
                className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 font-body-sm text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </FormField>
            <FormField label="Payload_Content">
              <textarea
                name="message"
                rows={5}
                placeholder="Describe the scope of your mission..."
                className="w-full rounded-lg border border-white/10 bg-surface-container-lowest px-4 py-3 font-body-sm text-on-surface transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </FormField>
            <button
              type="submit"
              disabled={contactMutation.isPending}
              className="glow-button flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 font-space-grotesk font-bold uppercase tracking-widest text-on-primary transition-transform duration-200 hover:scale-[1.01] disabled:opacity-50"
            >
              <MaterialIcon name={contactMutation.isPending ? "hourglass_empty" : "send"} className="text-sm" />
              {contactMutation.isPending ? "Transmitting..." : "Transmit message"}
            </button>
          </form>
        </section>

        <aside className="flex flex-col gap-gutter md:col-span-5">
          <div className="glass-panel rounded-xl p-8">
            <h3 className="mb-6 font-label-mono text-xs uppercase tracking-widest text-primary">
              Direct uplink
            </h3>
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-4 border-b border-white/5 py-4 transition-colors hover:text-primary"
            >
              <MaterialIcon name="alternate_email" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Email</p>
                <p className="font-mono text-sm">{isLoadingSettings ? "..." : contactEmail}</p>
              </div>
            </a>
            <div className="flex items-center gap-4 py-4">
              <MaterialIcon name="schedule" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Availability</p>
                <p className="text-sm text-on-surface">UTC ± meeting windows</p>
              </div>
            </div>
          </div>
          <div className="glass-panel flex flex-1 flex-col justify-between rounded-xl p-8">
            <div>
              <h3 className="mb-2 font-headline-md text-on-surface">Office terminal</h3>
              <p className="text-sm text-on-surface-variant">
                Prefer a structured brief? Attach architecture diagrams or RFCs in follow-up.
              </p>
            </div>
            <div className="mt-8 rounded border border-white/10 bg-black/40 p-4 font-mono text-xs text-tertiary">
              <span className="text-slate-500">$</span> awaiting payload…
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
