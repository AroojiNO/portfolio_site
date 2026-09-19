"use client";

import { projects } from "../data/resumeData";
import ProjectsSection from "../components/ProjectsSection";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-dark text-white">
      <div className="max-w-6xl mx-auto px-8 py-24">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 text-accent">Projects</h1>
        </div>

        <ProjectsSection projects={projects} />
      </div>
    </main>
  );
}
