"use client";

import React, { useState } from 'react';

// --- Data for the Experience Timeline (Updated from Resume) ---
const experiences = [
    {
    id: 1,
    organization: "Amazon Web Services",
    position: "Software Development Engineer Intern",
    dates: "May 2026 - August 2026",
    description: [
      "Designed and built a value insights system surfacing $15M in actionable price intelligence daily, replacing manual spreadsheets with an on-demand dashboard and cutting manual record pricing by 99% for internal metering teams",
      "Architected a distributed pricing application in Java hosted on AWS Fargate, leveraging an event-driven pipeline to process 7,000 billing records per minute with 99.94% file success rate",
      "Engineered data ingestion to handle 5M writes per hour to InfluxDB, optimizing batch writes and time-series indexing to serve sub-second time-range queries to React.js (TypeScript) dashboards"
    ],
    skills: ["Java", "AWS Fargate", "InfluxDB", "TypeScript"]
  },
  {
    id: 2,
    organization: "School of Data Science",
    position: "Machine Learning Researcher",
    dates: "April 2025 - Present",
    description: [
      "Trained a CLIP-based multimodal retrieval model using PyTorch, aligning time-series chart embeddings with natural language descriptions across 3,000+ Federal Reserve economic blog posts",
      "Built scalable preprocessing pipelines in Pandas and NumPy, transforming raw economic time-series records into structured contrastive learning pairs, reducing data preparation time by 95%",
      "Optimized model training through systematic data quality filtering and time-series alignment, removing 30+ insufficient data pairs and improving validation recall convergence by 45% across encoder configuration experiments"
    ],
    skills: ["PyTorch", "CLIP", "Pandas", "NumPy"]
  },
  {
    id: 3,
    organization: "Mythics",
    position: "Software Engineer Intern",
    dates: "May 2025 - August 2025",
    description: [
      "Led a cross-functional team of 5–10 through development of a full-stack client prospecting tool surfacing 20+ high-quality business leads and $1M in generated business pipelines per use",
      "Built interactive data visualization components in React.js with modular state management, rendering client metrics across filterable lead scoring views, reducing lead evaluation time by 40% across 3 internal teams",
      "Architected data ingestion and enrichment with REST API endpoints leveraging Express.js and Oracle ADW to fetch 50,000+ records in sub 600ms latency"
    ],
    skills: ["React", "Express.js", "Oracle ADW Warehouse"]
  },
  {
    id: 4,
    organization: "Collaborative Robotics Lab",
    position: "Machine Learning Researcher",
    dates: "Jan 2025 - June 2025",
    description: [
      "Managed the development of Llama-3 powered AI speech-to-text and text-to-speech, enabling human-robot communication, improving interaction latency by 25%.",
      "Implemented an intuitive GUI enhancing robot responses and blocking hallucinations, while maintaining sub-300ms response times between participants and robots",
      "Led the modularization of ROS2 nodes for LLM-based communication, lowering integration time by approximately 40%"
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
                  isExpanded ? 'max-h-[900px]' : 'max-h-[260px] md:max-h-[240px]'
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
