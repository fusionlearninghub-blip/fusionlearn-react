import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { LearningProvider } from "./state/LearningContext";
import { ThemeProvider } from "./hooks/useTheme";
import { ToastProvider } from "./state/ToastContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
    <HashRouter>
      <ThemeProvider>
        <LearningProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </LearningProvider>
      </ThemeProvider>
    </HashRouter>
    </ErrorBoundary>
  </StrictMode>,
);
