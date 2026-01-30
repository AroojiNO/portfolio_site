"use client";

import React from "react";
import { education } from "../data/resumeData";

export default function EducationSection() {
  return (
    <div>
      <div className="mb-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1">
          <h3 className="text-lg md:text-xl font-semibold print:text-base">
            {education.institution}
          </h3>
          <span className="text-gray-400 text-sm md:text-base print:text-xs">
            {education.expectedGraduation}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
          <p className="text-gray-300 italic text-sm md:text-base print:text-xs">
            {education.degree}
            {education.degree2 && `, ${education.degree2}`}
          </p>
          <span className="text-gray-300 text-sm md:text-base print:text-xs">
            GPA: {education.gpa}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-gray-400 text-sm md:text-base print:text-xs">
            <strong>Relevant Coursework:</strong>{" "}
            {education.coursework.join(", ")}
          </span>
        </div>
      </div>
    </div>
  );
}
