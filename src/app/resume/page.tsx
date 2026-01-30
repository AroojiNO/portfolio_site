"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ResumeHeader from "../components/ResumeHeader";
import ResumeSection from "../components/ResumeSection";
import EducationSection from "../components/EducationSection";
import TechnicalSkillsSection from "../components/TechnicalSkillsSection";
import ExperienceSection from "../components/ExperienceSection";
import ProjectsSection from "../components/ProjectsSection";
import { experience, projects, leadership } from "../data/resumeData";
import "./print.css";

gsap.registerPlugin(ScrollTrigger);

export default function ResumePage() {
  const mainRef = useRef<HTMLDivElement>(null);

  // Subtle fade-in animation on scroll
  useGSAP(() => {
    if (!mainRef.current) return;

    const sections = mainRef.current.querySelectorAll("section");

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, { scope: mainRef });

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Resume - Noah Arooji.pdf";
    link.download = "Noah_Arooji_Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0d] text-white pt-32 pb-12 px-4 print:py-0 print:px-0 print:bg-white">
      <div
        ref={mainRef}
        className="resume-container max-w-4xl mx-auto glass p-8 md:p-12 print:glass-none print:p-0 print:shadow-none print:border-none"
      >
        {/* Download Button */}
        <div className="flex justify-end mb-6 print:hidden">
          <button
            onClick={handleDownload}
            className="px-6 py-2 border border-accent text-accent rounded-lg hover:bg-accent hover:text-dark transition-colors duration-300 flex items-center gap-2"
            aria-label="Download Resume PDF"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download Resume
          </button>
        </div>

        {/* Resume Header */}
        <ResumeHeader />

        {/* Education Section */}
        <ResumeSection title="Education">
          <EducationSection />
        </ResumeSection>

        {/* Technical Skills Section */}
        <ResumeSection title="Technical Skills">
          <TechnicalSkillsSection />
        </ResumeSection>

        {/* Experience Section */}
        <ResumeSection title="Experience">
          <ExperienceSection experiences={experience} />
        </ResumeSection>

        {/* Projects Section */}
        <ResumeSection title="Projects / Leadership">
          <ProjectsSection projects={projects} />
          <div className="mt-6 print:mt-3">
            <ExperienceSection experiences={leadership} />
          </div>
        </ResumeSection>

        {/* Footer */}
        <footer className="text-center mt-8 pt-6 border-t border-gray-700/50 text-gray-400 text-sm print:hidden">
          <p className="mt-1">© {new Date().getFullYear()} Noah Arooji</p>
        </footer>
      </div>
    </main>
  );
}