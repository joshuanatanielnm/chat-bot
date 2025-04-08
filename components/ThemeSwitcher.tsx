"use client";

import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2 bg-[var(--background-secondary)] p-1 rounded-lg">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md transition-colors w-full ${
          theme === "light"
            ? "bg-[var(--accent)] text-white"
            : "hover:bg-[var(--accent-hover)]"
        }`}
        aria-label="Light mode"
      >
        <Sun size={18} className="mx-auto" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md transition-colors w-full ${
          theme === "dark"
            ? "bg-[var(--accent)] text-white"
            : "hover:bg-[var(--accent-hover)]"
        }`}
        aria-label="Dark mode"
      >
        <Moon size={18} className="mx-auto" />
      </button>
      <button
        onClick={() => setTheme("ghibli")}
        className={`p-2 rounded-md transition-colors w-full ${
          theme === "ghibli"
            ? "bg-[var(--accent)] text-white"
            : "hover:bg-[var(--accent-hover)]"
        }`}
        aria-label="Ghibli mode"
      >
        <Palette size={18} className="mx-auto" />
      </button>
    </div>
  );
}
