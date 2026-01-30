// Reusable section wrapper for resume sections
// Provides consistent styling and spacing

import React from "react";

interface ResumeSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function ResumeSection({
  title,
  children,
  className = "",
}: ResumeSectionProps) {
  return (
    <section className={`mb-8 print:mb-4 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-accent border-b border-accent/30 pb-2 print:text-xl print:mb-2 print:pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}