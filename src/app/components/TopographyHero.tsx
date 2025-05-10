import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

// Vertex shader: full-screen triangle
const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Fragment shader: dynamic contour lines with configurable spacing
const fragmentShader = `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform float uSpacing;

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution;
  vec2 centered = uv - 0.5;
  centered.x *= iResolution.x / iResolution.y;

  float radius = length(centered);
  float angle = atan(centered.y, centered.x);

  // Distortion offset
  float offset = sin(angle * 3.0 + iTime * 0.4) * (uSpacing * 0.2);
  // Rings by spacing
  float ringVal = mod(radius + offset, uSpacing);
  // Line mask thickness ~20% of spacing
  float mask = smoothstep(uSpacing * 0.22, uSpacing * 0.18, ringVal);

  vec3 base = vec3(0.02, 0.02, 0.04);
  vec3 highlight = vec3(0.65, 0.40, 1.00);
  vec3 color = mix(base, highlight, mask);

  gl_FragColor = vec4(color, 1.0);
}`;

interface BlobHeroProps {
  /** Distance between contour lines (higher = fewer lines) */
  spacing?: number;
  /** Enable or disable pointer events on the canvas container */
  pointerEvents?: boolean;
}

const BlobHero: React.FC<BlobHeroProps> = ({ spacing = 0.05, pointerEvents = true }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: [container.clientWidth, container.clientHeight] },
        uSpacing: { value: spacing }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      program.uniforms.iResolution.value = [width, height];
    };
    window.addEventListener("resize", resize);
    resize();

    const start = performance.now();
    const update = (t: number) => {
      program.uniforms.iTime.value = (t - start) * 0.001;
      renderer.render({ scene: mesh });
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);

    return () => {
      window.removeEventListener("resize", resize);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [spacing]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden ${pointerEvents ? "" : "pointer-events-none"}`}
    >
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-5xl font-bold">Noah Arooji</h1>
        <p className="mt-2 text-xl max-w-lg">
          I’m Noah—a software engineer and researcher passionate about clean design and performant code.
        </p>
        <button
          className="mt-6 px-6 py-2 border border-yellow-500 text-yellow-400 rounded-full hover:bg-yellow-500 hover:text-black transition"
        >
          View Resume
        </button>
      </div>
    </div>
  );
};

export default BlobHero;