"use client";

import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ResumeHeader from "../components/ResumeHeader";
import ResumeSection from "../components/ResumeSection";
import EducationSection from "../components/EducationSection";
import TechnicalSkillsSection from "../components/TechnicalSkillsSection";
import ExperienceSection from "../components/ExperienceSection";
import ResumeProjectsSection from "../components/ResumeProjectsSection";
import { experience, projects, leadership } from "../data/resumeData";
import "./print.css";

gsap.registerPlugin(ScrollTrigger);

export default function ResumePage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [focusedSection, setFocusedSection] = useState<string | null>(null);

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

  const handleOpenFocus = (sectionTitle: string) => {
    setFocusedSection(sectionTitle);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseFocus = () => {
    setFocusedSection(null);
    // Restore body scroll
    document.body.style.overflow = 'unset';
  };

  // Render section content based on title
  const renderSectionContent = (title: string) => {
    switch (title) {
      case "Education":
        return <EducationSection />;
      case "Technical Skills":
        return <TechnicalSkillsSection />;
      case "Experience":
        return <ExperienceSection experiences={experience} />;
      case "Projects / Leadership":
        return (
          <>
            <ResumeProjectsSection projects={projects} />
            <div className="mt-6 print:mt-3">
              <ExperienceSection experiences={leadership} />
            </div>
          </>
        );
      default:
        return null;
    }
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
        <ResumeSection title="Education" onFocus={() => handleOpenFocus("Education")}>
          <EducationSection />
        </ResumeSection>

        {/* Technical Skills Section */}
        <ResumeSection title="Technical Skills" onFocus={() => handleOpenFocus("Technical Skills")}>
          <TechnicalSkillsSection />
        </ResumeSection>

        {/* Experience Section */}
        <ResumeSection title="Experience" onFocus={() => handleOpenFocus("Experience")}>
          <ExperienceSection experiences={experience} />
        </ResumeSection>

        {/* Projects Section */}
        <ResumeSection title="Projects / Leadership" onFocus={() => handleOpenFocus("Projects / Leadership")}>
          <ResumeProjectsSection projects={projects} />
          <div className="mt-6 print:mt-3">
            <ExperienceSection experiences={leadership} />
          </div>
        </ResumeSection>

        {/* Footer */}
        <footer className="text-center mt-8 pt-6 border-t border-gray-700/50 text-gray-400 text-sm print:hidden">
          <p className="mt-1">© {new Date().getFullYear()} Noah Arooji</p>
        </footer>
      </div>

      {/* Focus Modal Overlay */}
      {focusedSection && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden"
          onClick={handleCloseFocus}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Focused Section Content */}
          <div
            className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto glass p-8 md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseFocus}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent/20 transition-colors duration-300 group"
              aria-label="Close focus mode"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-400 group-hover:text-accent transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Section Title */}
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-accent border-b border-accent/30 pb-3">
              {focusedSection}
            </h2>

            {/* Section Content */}
            {renderSectionContent(focusedSection)}
          </div>
        </div>
      )}
    </main>
  );
}