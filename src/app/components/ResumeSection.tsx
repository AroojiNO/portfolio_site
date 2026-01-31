// Reusable section wrapper for resume sections
// Provides consistent styling and spacing

import React from "react";

interface ResumeSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  onFocus?: () => void;
}

export default function ResumeSection({
  title,
  children,
  className = "",
  onFocus,
}: ResumeSectionProps) {
  const isClickable = !!onFocus;

  return (
    <section
      className={`mb-8 print:mb-4 ${className} ${
        isClickable
          ? "cursor-pointer transition-all duration-300 hover:scale-[1.01] print:cursor-default print:hover:scale-100"
          : ""
      }`}
      onClick={isClickable ? onFocus : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onFocus();
              }
            }
          : undefined
      }
    >
      <h2
        className={`text-2xl md:text-3xl font-semibold mb-4 text-accent border-b border-accent/30 pb-2 print:text-xl print:mb-2 print:pb-1 ${
          isClickable ? "flex items-center justify-between group" : ""
        }`}
      >
        <span>{title}</span>
        {isClickable && (
          <span className="text-sm text-gray-400 group-hover:text-accent transition-colors print:hidden">
            Click to focus
          </span>
        )}
      </h2>
      {children}
    </section>
  );
}