"use client";

import React, { useState } from "react";
import { ProjectItem } from "../data/resumeData";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

function ImageCarousel({ images }: { images?: string[] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
        <p className="text-gray-400 text-center px-4">
          Project images coming soon
        </p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full group">
      {/* Image Display */}
      <div className="relative w-full rounded-lg overflow-hidden">
        <img
          src={images[currentImageIndex]}
          alt={`Project screenshot ${currentImageIndex + 1}`}
          className="w-full h-auto rounded-lg shadow-lg"
          onError={(e) => {
            // Fallback for broken images
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23374151'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%239CA3AF'%3EImage Placeholder%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Navigation Arrows - Only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-dark/80 hover:bg-dark/95 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-dark/80 hover:bg-dark/95 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-accent w-6"
                    : "bg-gray-400 hover:bg-gray-300"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <div className="space-y-16">
      {projects.map((project, index) => (
        <div
          key={index}
          className="group relative"
        >
          {/* Project Card */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8 rounded-xl border border-gray-800/50 bg-gradient-to-br from-dark/50 to-dark/30 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(114,49,255,0.15)] transition-all duration-500">

            {/* Left Column - Project Details */}
            <div className="flex flex-col justify-between space-y-4">
              {/* Header */}
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {project.name}
                  </h3>
                  <span className="text-accent text-sm md:text-base font-medium whitespace-nowrap">
                    {project.date}
                  </span>
                </div>

                {/* Technologies */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-gray-400 text-sm md:text-base italic">
                    {project.technologies}
                  </div>
                </div>

                {/* Description Bullets */}
                <ul className="space-y-3 mb-6">
                  {project.bullets.map((bullet, bulletIndex) => (
                    <li
                      key={bulletIndex}
                      className="flex items-start gap-3 text-gray-300 text-sm md:text-base leading-relaxed"
                    >
                      <span className="text-accent mt-1.5 flex-shrink-0">▸</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Links */}
              {project.links && (
                <div className="flex gap-3 flex-wrap">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-dark border border-gray-600 hover:border-accent text-gray-300 hover:text-accent rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      GitHub →
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-accent hover:bg-accent/80 text-dark rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      Live Demo →
                    </a>
                  )}
                  {project.links.devpost && (
                    <a
                      href={project.links.devpost}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-dark border border-gray-600 hover:border-soft-orange text-gray-300 hover:text-soft-orange rounded-lg transition-all duration-300 text-sm font-medium"
                    >
                      Devpost →
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Image Carousel */}
            <div className="lg:order-last order-first">
              <ImageCarousel images={project.images} />
            </div>
          </div>

          {/* Divider between projects (not on last item) */}
          {index < projects.length - 1 && (
            <div className="mt-12 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          )}
        </div>
      ))}
    </div>
  );
}
