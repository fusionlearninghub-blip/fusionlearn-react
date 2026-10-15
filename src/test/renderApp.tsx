import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { LearningProvider } from "../state/LearningContext";
import { ThemeProvider } from "../hooks/useTheme";
import { ToastProvider } from "../state/ToastContext";

export function renderApp(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>
        <LearningProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </LearningProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}
