"use client";

import { useRef, useEffect } from "react";

export default function PsychedelicColorBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    function draw() {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Full left-to-right sweeping gradient with sine wave offset
      const offset = Math.sin(t * 0.0005) * (w / 2);

      const gradient = ctx.createLinearGradient(
        w / 2 + offset, 0,
        w / 2 - offset, h
      );

      gradient.addColorStop(0, '#ffba08');     // golden yellow (leading)
      gradient.addColorStop(0.4, '#e85d04');   // vibrant orange
      gradient.addColorStop(0.7, '#6a040f');   // deep red
      gradient.addColorStop(0.85, '#723180');  // bright purple
      gradient.addColorStop(1, '#370617');     // purple-black (trailing)

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      t++;
      requestAnimationFrame(draw);
    }

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen z-0"
      style={{ pointerEvents: "none" }}
    />
  );
}
