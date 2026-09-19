"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import TopographyHero from "./components/TopographyHero";
import SkillsShowcase from "./components/SkillsShowcase";
import Experiences from "./components/Experiences";
import SectionHeading from "./components/SectionHeading";
import Link from "next/link";
import SocialMediaLinks, { GitHubIcon, LinkedInIcon } from "./components/SocialButtons";
import { ChevronDown, Mail } from "lucide-react";
import { contactInfo, projects } from "./data/resumeData";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  const mainRef = useRef<HTMLElement>(null); // Optional: for scoping GSAP context
  const heroRef = useRef<HTMLElement>(null);
  const welcomeSectionRef = useRef<HTMLElement>(null); // Ref for the actual welcome section
  const glowsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!heroRef.current || !welcomeSectionRef.current || !glowsRef.current) {
      console.warn("Hero, Welcome section or glows ref is not available for animation.");
      return;
    }

    // Set initial states for the animation
    // Welcome section starts slightly below its final position and invisible
    gsap.set(welcomeSectionRef.current, { y: 100, autoAlpha: 0 });
    // Background glows stay hidden over the hero
    gsap.set(glowsRef.current, { autoAlpha: 0 });

    // Create a GSAP timeline that follows the scrollbar (no automatic scrolling)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "5% top", // Start when the top of the hero section hits the top of the viewport
        end: "bottom top",
        scrub: 1,
        //markers: true, // For debugging
      }
    });

    // 1. Animate the hero section out
    tl.to(heroRef.current, {
        autoAlpha: 0.1,     // Fade out
        yPercent: 0,    // Move slightly upwards (e.g., 15% of its own height)
        ease: "power1.in" // Easing function
      }, 0) // The '0' means this animation starts at the beginning of the timeline

    // 2. Animate the welcome section in
    // The '0.1' means this animation starts 0.1 seconds (on the timeline's scale) after the previous one begins.
    // Adjust this offset to control the overlap or sequence of animations.
    .to(welcomeSectionRef.current, {
        autoAlpha: 1,     // Fade in
        y: 0,             // Slide to its original position (from y: 100)
        ease: "power1.out" // Easing function
      }, 0.2) // Starts slightly after the hero animation begins

    // 3. Fade the background glows in as the hero leaves
    .to(glowsRef.current, {
        autoAlpha: 1,
        ease: "none"
      }, 0);

  }, { scope: mainRef }); // Scope the context to mainRef if you use string selectors, good practice.

  // Get first 2 projects for featured section
  const featuredProjects = projects.slice(0, 2);

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen bg-dark text-white font-sans"
    >
      {/* Hero Component */}
      <section
        ref={heroRef}
        className="bg-dark relative h-screen flex flex-col justify-center items-center overflow-hidden z-0 "
        style={{
          borderRadius: "10px",
          transition: "border-radius 0.3s ease",
          boxShadow: "0 0 0 100vmax rgba(0, 0, 0, 0.5)",
        }}
      >
        <TopographyHero 
          spacing={2.25}/>
        <div className="relative z-10 flex flex-col items-center justify-center inset-0 text-center text-white p-4 z-10">
          <div className="pointer-events-auto ">
            {" "}
            {/* Enable pointer events for this content block */}
            <h1 className=" text-5xl md:text-6xl">Noah Arooji</h1>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <div className="mt-2 text-center">
            <div className="mx-auto h-[1px] w-56 bg-gradient-to-r from-amber-300/60 via-amber-200 to-amber-300/60"></div>
            <p className="mt-3 text-lg text-slate-200 font-bold tracking-wide">
              Software Engineer & Machine Learning Researcher
            </p>
          </div>
          </div>
            <Link
              href="/resume"
              className="mt-4 inline-block px-5 py-2 border border-accent text-accent rounded-full hover:bg-accent hover:text-dark transition-colors duration-300 text-lg"
            >
              View Resume
            </Link>
          </div>
        </div>
        {/* Fade the hero's bottom edge into the page background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-dark" />
        <button
          type="button"
          onClick={() => window.scrollTo({ top: heroRef.current?.offsetHeight ?? window.innerHeight, behavior: "smooth" })}
          aria-label="Scroll to content"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-accent/70 hover:text-accent transition-colors duration-300 motion-safe:animate-bounce"
        >
          <ChevronDown className="h-8 w-8" />
        </button>
      </section>
      {/* Glassmorphic Effect */}
      <div
        className="relative z-10 bg-dark"
        style={{
          width: "100%",
          height: "60%",
          position: "absolute",
          zIndex: 0,
        }}
      ></div>
      {/* Ambient glows fixed to the screen, so the content scrolls over them and they feel far away.
          They echo the hero's amber and indigo lines and fade in as the hero scrolls out (see useGSAP above). */}
      <div ref={glowsRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
        <div className="glow glow-amber -left-[30vmax] -top-[32vmax] h-[80vmax] w-[80vmax] [--drift-duration:60s] [--pulse-duration:9s]" />
        <div className="glow glow-indigo -right-[38vmax] -top-[5vmax] h-[90vmax] w-[90vmax] [--drift-duration:72s] [--drift-delay:-36s] [--pulse-duration:12s] [--pulse-delay:-5s]" />
        <div className="glow glow-indigo -left-[32vmax] -bottom-[50vmax] h-[85vmax] w-[85vmax] [--drift-duration:84s] [--drift-delay:-20s] [--pulse-duration:14s] [--pulse-delay:-9s]" />
      </div>
      <div className="min-h-screen relative z-10 max-w-4xl mx-auto px-8 py-12 space-y-6 ">
        {/* Welcome */}
        <section ref={welcomeSectionRef} className="my-24 py-4 ">
          <h1 className="text-5xl font-bold mb-4">Welcome!</h1>
        </section>

        {/* About Me */}
        <section className="glass text-opacity-80 justify-center items-center flex flex-col p-8 rounded-lg">
          <img
            src="../../personal-photo.png"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover border-2 border-accent"
          />
          <SocialMediaLinks
            containerClassName="mb-4"
            socialProfiles={[
              {
                name: "LinkedIn",
                url: `https://www.${contactInfo.linkedin}`,
                icon: <LinkedInIcon className="h-5 w-5" />,
              },
              {
                name: "GitHub",
                url: `https://${contactInfo.github}`,
                icon: <GitHubIcon className="h-5 w-5" />,
              },
              {
                name: "Email",
                url: `mailto:${contactInfo.email}`,
                icon: <Mail className="h-5 w-5" />,
                ariaLabel: "Email me",
              },
            ]}
          />
          <SectionHeading title="About Me" className="mb-4" />
          <p className="text-gray-200 text-center text-xl">
            I’m currently a Computer Science and Applied Statistics student at <i>The
            University of Virginia</i>, working on full‑stack web apps and Machine
            Learning projects. <br></br> <br></br>
            In my spare time, I enjoy personal fitness and helping others learn
            about exercise. <br></br> <br></br>
          </p>
        </section>

        {/* Experience */}
        <section className="">
          <Experiences />
        </section>

        {/* Technologies / Skills */}
        <SkillsShowcase />

        {/* Featured Projects */}
        <section className="my-16">
          <SectionHeading title="Featured Projects" subtitle="Recent highlights from my work" />
          <div className="grid gap-6 sm:grid-cols-2">
            {featuredProjects.map((project) => (
              <Link
                key={project.name}
                href="/projects"
                className="glass p-6 hover:scale-[1.02] transition-transform"
              >
                <h3 className="text-xl font-medium mb-2">{project.name}</h3>
                <p className="text-sm text-accent mb-2">{project.technologies}</p>
                <p className="text-gray-300 text-sm mb-4">{project.bullets[0]}</p>
                <span className="text-accent font-semibold">Learn More →</span>
              </Link>
            ))}
          </div>
        </section>
        {/* Footer */}
        <section className="">
          <footer className="text-center py-4 text-sm">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Noah Arooji. All rights reserved.
            </p>
            <p className="text-gray-400 tx-sm">
              Built with Next.js + Tailwind CSS.
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}