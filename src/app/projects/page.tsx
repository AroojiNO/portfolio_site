"use client";

import { projects } from "../data/resumeData";
import ProjectsSection from "../components/ProjectsSection";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-dark text-white">
      <div className="max-w-6xl mx-auto px-8 py-36">
        <ProjectsSection projects={projects} />
      </div>
    </main>
  );
}
