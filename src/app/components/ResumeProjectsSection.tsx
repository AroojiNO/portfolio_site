"use client";

import React from "react";
import { ProjectItem } from "../data/resumeData";

interface ResumeProjectsSectionProps {
  projects: ProjectItem[];
}

export default function ResumeProjectsSection({ projects }: ResumeProjectsSectionProps) {
  return (
    <div className="space-y-5 print:space-y-3">
      {projects.map((project, index) => (
        <div
          key={index}
          className="print:break-inside-avoid p-4 rounded-lg border border-transparent hover:border-primary/20 hover:bg-primary/5 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 -mx-4 print:mx-0 print:p-0 print:hover:border-transparent print:hover:bg-transparent print:hover:shadow-none"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg md:text-xl font-semibold print:text-base">
                {project.name}
              </h3>
              {project.links && (
                <div className="flex gap-2 print:hidden">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-soft-orange transition-colors text-xs"
                    >
                      [GitHub]
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-soft-orange transition-colors text-xs"
                    >
                      [Demo]
                    </a>
                  )}
                  {project.links.devpost && (
                    <a
                      href={project.links.devpost}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-soft-orange transition-colors text-xs"
                    >
                      [Devpost]
                    </a>
                  )}
                </div>
              )}
            </div>
            <span className="text-gray-400 text-sm md:text-base print:text-xs whitespace-nowrap">
              {project.date}
            </span>
          </div>
          <p className="text-gray-400 italic text-sm mb-2 print:text-xs print:mb-1">
            {project.technologies}
          </p>
          <ul className="list-disc list-outside ml-5 space-y-1 print:space-y-0.5">
            {project.bullets.map((bullet, bulletIndex) => (
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
