"use client";

import { useState, ChangeEvent, useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useGSAP } from "@gsap/react";

import TopographyHero from "./components/TopographyHero";
import SkillsShowcase from "./components/SkillsShowcase";
import Link from "next/link";
import SocialMediaLinks from "./components/SocialButtons";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

  const isAutoScrolling = useRef(false);
  useGSAP(() => {
    if (!heroRef.current || !welcomeSectionRef.current) {
      console.warn("Hero or Welcome section ref is not available for animation.");
      return;
    }

    // Set initial states for the animation
    // Welcome section starts slightly below its final position and invisible
    gsap.set(welcomeSectionRef.current, { y: 100, autoAlpha: 0 });

    // Create a GSAP timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: "5% top", // Start when the top of the hero section hits the top of the viewport
        end: "bottom top",
        scrub: 1,
        //markers: true, // For debugging

        onEnter: (self) => {
          // Only trigger auto-scroll if scrolling down and not already auto-scrolling
          if (self.direction === 1 && !isAutoScrolling.current) {
            isAutoScrolling.current = true;

            gsap.to(window, {
              scrollTo: {
                y: welcomeSectionRef.current!, // Scroll to the top of the welcome section
                offsetY: 120 // Adjust if you have a sticky header or need padding
              },
              duration: 2.0, // Duration of the auto-scroll animation
              ease: "power2.inOut",
              onComplete: () => {
                isAutoScrolling.current = false;
                // Refresh ScrollTrigger positions after programmatic scroll
                ScrollTrigger.refresh();
              },
              onInterrupt: () => {
                // If user manually scrolls during the auto-scroll, stop the auto-scroll
                if (isAutoScrolling.current) {
                  gsap.killTweensOf(window); // Kills the specific scrollTo tween
                  isAutoScrolling.current = false;
                }
              }
            });
          }
        },
        
        onEnterBack: (self) => {
          // Auto-scroll up to hero section
          if (self.direction === -1 && !isAutoScrolling.current) {
            console.log(`ON ENTER BACK: Auto-scrolling UP to hero at scrollY: ${window.scrollY}`);
            isAutoScrolling.current = true;
            gsap.to(window, {
              scrollTo: {
                y: heroRef.current!, // Target top of hero section (or 0 if hero is at page top)
                offsetY: 0
              },
              duration: 2.5,
              ease: "power2.inOut",
              onComplete: () => {
                isAutoScrolling.current = false;
                ScrollTrigger.refresh();
              },
              onInterrupt: () => {
                if (isAutoScrolling.current) {
                  gsap.killTweensOf(window);
                  isAutoScrolling.current = false;
                }
              }
            });
          }
        },
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
      }, 0.2); // Starts slightly after the hero animation begins

  }, { scope: mainRef }); // Scope the context to mainRef if you use string selectors, good practice.

  const projects = [
    { title: "PromptLite", description: "(HooHacks 2025) Chrome extension for sustainable ChatGPT prompting.", href: "https://devpost.com/software/ecochat" },
    { title: "JavaFX Drone Show", description: "Image Bit Mapping for 'Dot' Drones", href: "https://github.com/AroojiNO/Drone-Show-Prototype" },
    //{ title: "Project Three", description: "Short description here.", href: "#" },
  ];

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
            <h1 className=" text-5xl md:text-6xl font-bold">Noah Arooji</h1>
            <p className="mt-6 text-lg text-white md:text-xl max-w-md md:max-w-lg">
              CS + STAT Portfolio
            </p>
            <Link href="/resume" passHref>
              <button className="mt-4 px-5 py-2 border border-yellow-400 text-yellow-300 rounded-full hover:bg-yellow-500 hover:text-black transition-colors duration-300 text-lg">
                View Resume
              </button>
            </Link>
          </div>
        </div>
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
      <div className="min-h-screen relative z-10 max-w-4xl mx-auto px-8 py-4 space-y-6 ">
        {/* Welcome */}
        <section ref={welcomeSectionRef} className="my-16 py-4 ">
          <h1 className="text-5xl font-bold mb-4">Welcome!</h1>
          <p className="text-lg text-gray-300">
            I’m Noah—a software engineer and researcher creating clean design
            and performant code.
          </p>
        </section>

        {/* About Me */}
        <section className="glass text-opacity-80 justify-center items-center flex flex-col p-8 rounded-lg">
          <img
            src="../../personal-photo.png"
            alt="Profile"
            className="w-32 h-32 rounded-full mb-4 object-cover border-2 border-accent"
          />
          <SocialMediaLinks
            socialProfiles={[
              {
                name: "LinkedIn",
                url: "https://www.linkedin.com/in/noah-arooji/",
                iconSrc: "../../linkedin-logo.png",
              },
              {
                name: "GitHub",
                url: "https://github.com/AroojiNO",
                iconSrc: "../../github.png",
              },
              {
                name: "Email",
                url: "mailto:noaharooji@gmail.com",
                iconSrc: "../../gmail.png",
              },
            ]}
          />
          <h2 className="text-2xl font-semibold mb-4 text-accent text-center">
            About Me
          </h2>
          <p className="text-gray-200 text-center">
            I’m currently a Computer Science & Applied Statistics student at <i>The
            University of Virginia</i>, working on full‑stack web apps and Machine
            Learning projects. <br></br> <br></br>
            In my spare time, I enjoy personal fitnesss and helping others learn
            about exercise. Come train with me! <br></br> <br></br>
          </p>
          <Link
            href="https://rec.virginia.edu/staff/personal-trainers/"
            className="text-3xl text-blue-400 hover:underline transition-colors duration-300"
          >
            {" "}
            UVA Recreation
          </Link>
        </section>

        {/* Technologies / Skills */}
        <SkillsShowcase />

        {/* Experience */}
        <section className="">{/* NEEDS TO BE COMPLETED */}</section>

        {/* Projects */}
        <section className="">
          <h2 className="text-3xl font-semibold mb-6 text-accent text-center">
            Projects
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <a
                key={p.title}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass p-6 hover:scale-[1.02] transition-transform"
              >
                <h3 className="text-xl font-medium mb-2">{p.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{p.description}</p>
                <span className="text-accent font-semibold">View →</span>
              </a>
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