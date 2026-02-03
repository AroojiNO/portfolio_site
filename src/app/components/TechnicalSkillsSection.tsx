"use client";

import React from "react";
import { technicalSkills } from "../data/resumeData";

export default function TechnicalSkillsSection() {
  return (
    <div className="space-y-2">
      {/* Languages */}
      <div className="flex flex-col sm:flex-row print:flex-row">
        <span className="font-semibold text-gray-300 min-w-[140px] text-sm md:text-base print:text-xs print:min-w-[100px]">
          Languages:
        </span>
        <span className="text-gray-300 text-sm md:text-base print:text-xs">
          {technicalSkills.languages.join(", ")}
        </span>
      </div>

      {/* Frameworks */}
      <div className="flex flex-col sm:flex-row print:flex-row">
        <span className="font-semibold text-gray-300 min-w-[140px] text-sm md:text-base print:text-xs print:min-w-[100px]">
          Frameworks:
        </span>
        <span className="text-gray-300 text-sm md:text-base print:text-xs">
          {technicalSkills.frameworks.join(", ")}
        </span>
      </div>

      {/* Certifications */}
      <div className="flex flex-col sm:flex-row print:flex-row">
        <span className="font-semibold text-gray-300 min-w-[140px] text-sm md:text-base print:text-xs print:min-w-[100px]">
          Certifications:
        </span>
        <span className="text-gray-300 text-sm md:text-base print:text-xs">
          {technicalSkills.certifications.join(", ")}
        </span>
      </div>
    </div>
  );
}