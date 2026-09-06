"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">{leftIcon}</div>
        )}
        <input
          className={`w-full bg-[#F8FAF9] dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm outline-none ${
            error
              ? "text-rose-500"
              : ""
          } ${leftIcon ? "pl-10" : "px-4"} ${rightIcon ? "pr-10" : "px-4"} py-3 ${className}`}
          {...props}
        />
        {rightIcon && <div className="absolute right-3 text-slate-400">{rightIcon}</div>}
      </div>
      {error && <span className="text-xs font-medium text-rose-500 mt-0.5">{error}</span>}
    </div>
  );
};
