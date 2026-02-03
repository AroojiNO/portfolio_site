"use client";

import React from "react";
import { ExperienceItem } from "../data/resumeData";

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
}

export default function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  return (
    <div className="space-y-6 print:space-y-3">
      {experiences.map((exp, index) => (
        <div
          key={index}
          className="print:break-inside-avoid p-4 rounded-lg border border-transparent hover:border-accent/20 hover:bg-accent/5 hover:shadow-[0_0_20px_rgba(255,223,128,0.15)] transition-all duration-300 -mx-4 print:mx-0 print:p-0 print:hover:border-transparent print:hover:bg-transparent print:hover:shadow-none"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
            <h3 className="text-lg md:text-xl font-semibold print:text-base">
              {exp.company}
            </h3>
            <span className="text-gray-400 text-sm md:text-base print:text-xs whitespace-nowrap">
              {exp.dates}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <p className="text-gray-300 italic text-sm md:text-base print:text-xs">
              {exp.position}
            </p>
            <span className="text-gray-400 text-sm md:text-base print:text-xs">
              {exp.location}
            </span>
          </div>
          <ul className="list-disc list-outside ml-5 space-y-1 print:space-y-0.5">
            {exp.bullets.map((bullet, bulletIndex) => (
              <li
                key={bulletIndex}
                className="text-gray-300 text-sm md:text-base print:text-xs leading-relaxed"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}