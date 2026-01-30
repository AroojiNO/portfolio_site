"use client";

import React, { useState } from 'react';

// --- Data for the Experience Timeline (Updated from Resume) ---
const experiences = [
    {
    id: 1,
    organization: "School of Data Science",
    position: "Machine Learning Researcher",
    dates: "May 2025 - Present",
    description: [
      "Engineered an automated web scraping pipeline using Selenium and BeautifulSoup, extracting 1000+ records in 8 minutes (a 95.6% efficiency increase).",
      "Calculated anomaly detection of time series inconsistencies using NumPy and openpyxl, catching over 30 inconsistent data sets.",
      "Researched synthetic data generation for enhancing time-series prediction in language models."
    ],
    skills: ["Python", "Selenium", "BeautifulSoup", "NumPy"]
  },
  {
    id: 2,
    organization: "Mythics",
    position: "Software Engineer Intern",
    dates: "May 2025 - August 2025",
    description: [
      "Led a sales team of 5–10 through procurement of an internal AI prospecting tool that surfaces 20+ high-quality leads per run.",
      "Drove over $1M in net new pipeline opportunities per use by creating an intuitive sales opportunity dashboard.",
      "Automated data ingestion and enrichment with an Express.js backend API, cutting manual data entry by 100%."
    ],
    skills: ["React", "Express.js", "Oracle ADW Warehouse"]
  },
  {
    id: 3,
    organization: "Collaborative Robotics Lab",
    position: "Robotics Researcher",
    dates: "Jan 2025 - June 2025",
    description: [
      "Developed LLaMA-3 powered AI speech-to-text and text-to-speech, enabling human-robot communication and improving interaction latency by 25%.",
      "Designed and iterated on natural language systems optimized for low-latency deployment on embedded Stretch robots.",
      "Modularized ROS2 nodes for LLM-based communication, cutting integration time by ~40% and streamlining debugging."
    ],
    skills: ["LLaMA-3", "NLP", "ROS2", "Embedded Systems"]
  },
];

// --- Helper function to truncate text ---
const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
};

// --- The Main Experience Timeline Component ---
const ExperienceTimeline = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleToggle = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const cardClasses = "transition-all duration-300 ease-in-out hover:scale-[1.03] ";

  return (
    <section className="my-16">
      <h2 className="text-4xl font-semibold mb-12 text-accent text-center">
        Experience
      </h2>
      <div className="relative container mx-auto px-6 flex flex-col space-y-8">
        {/* The central timeline line */}
        <div 
          className="absolute z-0 w-2 h-full bg-gradient-to-b from-amber-400 to-blue-500 shadow-md inset-0 left-1/2 -translate-x-1/2"
        ></div>
        
        {/* Mapping over experiences */}
        {experiences.map((exp, index) => {
          const isExpanded = expandedId === exp.id;
          const isRightSide = index % 2 !== 0;

          return (
            <div key={exp.id} className={`relative z-10 flex w-full ${isRightSide ? 'justify-end md:pl-8' : 'justify-start md:pr-8'}`}>
              {/* Timeline Dot */}
              <div className={`absolute w-5 h-5 rounded-full mt-4 z-20 left-1/2 -translate-x-1/2 bg-amber-400 border-4 border-gray-800`}></div>

              {/* Experience Card */}
              <div 
                className={`glass p-6 rounded-lg shadow-lg w-full md:w-[48%] cursor-pointer transition-all duration-500 ease-in-out overflow-hidden ${
                  isRightSide ? 'self-end md:ml-[45%]' : 'self-start'
                } ${
                  isExpanded ? 'max-h-[500px]' : 'max-h-[260px] md:max-h-[240px]'
                } ${cardClasses}`}
                onClick={() => handleToggle(exp.id)}
              >
                {/* --- HEADER --- */}
                <div className="grid grid-cols-3 gap-x-4 items-start mb-2">
                  <div className="col-span-2">
                    {/* Updated Title Format */}
                    <h3 className="text-md font-bold text-white ">{exp.organization}, </h3>
                    <p className="text-lg text-violet-300 font-semibold ">{exp.position}</p>
                  </div>
                  <p className="text-sm text-gray-400 text-right ">{exp.dates}</p>
                </div>

                {/* --- VISIBLE SKILLS --- */}
                <div className="mt-2 mb-4">
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, i) => (
                        <span key={i} className="bg-gray-700/50 text-xs text-amber-300 font-semibold px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                </div>
                
                {/* --- COLLAPSIBLE DESCRIPTION --- */}
                <div className="text-gray-300">
                    {isExpanded ? (
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        {exp.description.map((point, i) => <li key={i}>{point}</li>)}
                      </ul>
                    ) : (
                      // Show truncated text when collapsed
                      <p className="text-sm">{truncateText(exp.description[0], 6)}</p>
                    )}
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
