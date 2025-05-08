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

      // speed up sliding gradient
      const speed = 3;              // ↑ increase to taste

      const totalSpan = w * 2;
      const offset = (t * speed) % totalSpan;
      const windowW = w;            // window always width = canvas width
      const x0 = -windowW + offset;
      const x1 = x0 + windowW;

      const gradient = ctx.createLinearGradient(
        x0, 0,
        x1, 0
      );

      // reposition purple into the center of the color stops
      gradient.addColorStop(0,   '#ffba08');
      gradient.addColorStop(0.25,'#e85d04');
      gradient.addColorStop(0.5, '#723180');  // purple
      gradient.addColorStop(0.75,'#6a040f');
      gradient.addColorStop(1,   '#370617');

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
