import { Component, type ErrorInfo, type ReactNode } from "react";

interface State {
  error: Error | null;
}

/** Shows what went wrong (and a reset button) instead of a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("FusionLearn crashed:", error, info.componentStack);
  }

  reset = () => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" style={{ fontFamily: "sans-serif", padding: 24, maxWidth: 640, margin: "40px auto" }}>
        <h1>Something went wrong</h1>
        <p>FusionLearn hit an error and could not display this page.</p>
        <pre style={{ whiteSpace: "pre-wrap", background: "#f1f5f9", padding: 12, borderRadius: 8, color: "#b91c1c" }}>
          {this.state.error.message}
        </pre>
        <button type="button" onClick={this.reset} style={{ padding: "10px 16px", cursor: "pointer" }}>
          Clear saved data and reload
        </button>
      </div>
    );
  }
}
