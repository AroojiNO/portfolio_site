"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Threads from "./components/Threads";
import TopographyHero from "./components/TopographyHero";

export default function HomePage() {
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  const projects = [
    { title: "Project One", description: "Short description here.", href: "#" },
    { title: "Project Two", description: "Short description here.", href: "#" },
    { title: "Project Three", description: "Short description here.", href: "#" },
  ];

  return (
    <main className="relative min-h-screen bg-dark text-white font-sans">
      {/* Hero Component */}
      <TopographyHero />
      {/* Glassmorphic Effect */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 py-12 space-y-16">
        <div style={{ width: "150%", height: "100%", position: "absolute", left:0, zIndex: -1 }}> 
          <Threads
            amplitude={1.75}
            distance={0.2}
            enableMouseInteraction={false}
            color={[0.447, 0.192, 1]}
          />
        </div>
        {/* Welcome */}
        <section>
          <h1 className="text-5xl font-bold mb-4">Welcome!</h1>
          <p className="text-lg text-gray-300">
            I’m Noah—a software engineer and researcher passionate about clean
            design and performant code.
          </p>
        </section>

        {/* About Me */}
        <section className="glass border-soft-orange">
          <h2 className="text-2xl font-semibold mb-3 text-accent">About Me</h2>
          <p className="text-gray-200">
            I’m currently a CS & Applied Statistics student at UVA, working on
            full‑stack web apps and ML projects.
          </p>
        </section>

        {/* Image Uploader */}
        <section className="glass border-soft-orange">
          <h2 className="text-2xl font-semibold mb-3 text-accent">
            Upload a Photo
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block text-sm text-gray-200 mb-4"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-full border-2 border-soft-orange"
            />
          )}
        </section>

        {/* Projects */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-accent">Projects</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.title}
                href={p.href}
                className="glass p-6 hover:scale-[1.02] transition-transform"
              >
                <h3 className="text-xl font-medium mb-2">{p.title}</h3>
                <p className="text-gray-200 mb-4">{p.description}</p>
                <span className="text-accent font-semibold">View →</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}