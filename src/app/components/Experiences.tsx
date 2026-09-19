"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { experience } from '../data/resumeData';
import SectionHeading from './SectionHeading';

// --- The Main Experience Timeline Component ---
const ExperienceTimeline = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="my-16">
      <SectionHeading title="Experience" />
      <div className="relative flex flex-col space-y-8">
        {/* The timeline line: along the left edge on phones, centered from md up */}
        <div
          className="absolute z-0 top-0 bottom-0 left-2.5 md:left-1/2 w-1 md:w-2 -translate-x-1/2 rounded-full bg-gradient-to-b from-amber-400 to-violet-500 shadow-md"
        ></div>

        {/* Mapping over experiences */}
        {experience.map((exp, index) => {
          const isExpanded = expandedIndex === index;
          const isRightSide = index % 2 !== 0;

          return (
            <div
              key={exp.company}
              className={`relative z-10 pl-10 md:w-1/2 ${isRightSide ? 'md:ml-auto md:pl-8' : 'md:pl-0 md:pr-8'}`}
            >
              {/* Timeline Dot */}
              <div
                className={`absolute top-7 z-20 w-5 h-5 -translate-x-1/2 rounded-full left-2.5 bg-amber-400 border-4 border-gray-800 ${
                  isRightSide ? 'md:left-0' : 'md:left-full'
                }`}
              ></div>

              {/* Experience Card */}
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onClick={() => handleToggle(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggle(index);
                  }
                }}
                className="glass shadow-lg cursor-pointer transition-transform duration-300 ease-in-out hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-accent"
              >
                {/* --- HEADER --- */}
                <h3 className="text-xl font-bold text-white">{exp.company}</h3>
                <p className="text-violet-300 font-semibold">{exp.position}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {exp.dates} · {exp.location}
                </p>

                {/* --- SKILLS --- */}
                {exp.skills && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span key={skill} className="bg-gray-700/50 text-xs text-amber-300 font-semibold px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* --- SUMMARY --- */}
                <p className="mt-4 text-sm text-gray-300">{exp.summary ?? exp.bullets[0]}</p>

                {/* --- COLLAPSIBLE DETAILS --- */}
                <div
                  className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="list-disc list-outside ml-5 pt-4 space-y-2 text-sm text-gray-300">
                      {exp.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-accent">
                  {isExpanded ? 'Hide details' : 'Show details'}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ExperienceTimeline;
