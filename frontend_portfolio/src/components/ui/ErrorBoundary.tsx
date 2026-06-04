import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
          <div className="glass-panel max-w-lg rounded-2xl p-10">
            <p className="font-label-mono text-[10px] uppercase tracking-widest text-rose-400">
              System error
            </p>
            <h1 className="mt-3 font-display-lg text-headline-md text-on-surface">
              Something went wrong
            </h1>
            <p className="mt-4 text-sm text-on-surface-variant">
              An unexpected error occurred. Please refresh the page or navigate back.
            </p>
            {this.state.error && (
              <pre className="mt-6 overflow-auto rounded-lg border border-white/10 bg-surface-container-lowest p-4 text-left font-label-mono text-xs text-rose-300">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = "/";
              }}
              className="mt-6 rounded-lg bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-on-primary transition-all hover:brightness-110"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
