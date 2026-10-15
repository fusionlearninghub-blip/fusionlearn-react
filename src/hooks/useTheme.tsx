import {
  createContext, useContext, useEffect, useMemo, useState, type ReactNode,
} from "react";
import type { Theme } from "../types";
import { loadTheme, saveTheme } from "../lib/storage";

interface Ctx {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<Ctx>({ theme: "light", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(loadTheme);

  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    saveTheme(theme);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) }),
    [theme],
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
