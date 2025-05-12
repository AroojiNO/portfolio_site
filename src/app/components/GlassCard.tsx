"use client";
import gsap from "gsap";
import { useEffect, useRef } from "react";

interface GlassCardProps {
  children: React.ReactNode
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current!
    const mm = gsap.matchMedia()
    mm.add("(hover: hover)", () => {
      el.addEventListener("mousemove", (e) => {
        const { width, height, left, top } = el.getBoundingClientRect()
        const x = ((e.clientX - left) / width - 0.5) * 20
        const y = ((e.clientY - top) / height - 0.5) * 20
        gsap.to(el, { "--tw-bg-opacity": 0.2, x, y, duration: 0.3 })
      })
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, "--tw-bg-opacity": 0.05, duration: 0.5 })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <div
      ref={ref}
      className={"glass transition-transform" + className}
      style={{ willChange: "transform" }}
    >
      {children}
    </div>
  )
}