"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { usePlatform } from "@/store/PlatformContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = usePlatform();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center shadow-xs"
      title={`Switch to ${theme === "light" ? "Dark" : "Light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-indigo-600" />
      ) : (
        <Sun className="w-5 h-5 text-amber-400" />
      )}
    </button>
  );
}
