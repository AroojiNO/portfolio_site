import React from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string; // Spacing below the heading; defaults to mb-12
}

// Shared heading so every main page section title has the same size, color and spacing.
export default function SectionHeading({ title, subtitle, className = "mb-12" }: SectionHeadingProps) {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-3xl md:text-4xl font-semibold text-accent">{title}</h2>
      {subtitle && <p className="mt-3 text-gray-300">{subtitle}</p>}
    </div>
  );
}
