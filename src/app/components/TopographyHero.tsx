import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl"; // Added Vec2

// Vertex shader: full-screen triangle (remains the same)
const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Fragment shader: Updated for organic blob and contour lines
const fragmentShader = `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 uMouse; // For potential mouse interaction
uniform float uSpacing; // Controls density of contour lines

// 2D Random
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D Perlin Noise (Value Noise variant)
float noise (vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);
    // Alternative: vec2 u = smoothstep(0.,1.,f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.y * u.x;
}

// Fractal Brownian Motion (fBm) for more detailed noise
float fbm (vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 0.0;
    for (int i = 0; i < 4; i++) { // 4 octaves
        value += amplitude * noise(st);
        st *= 2.0; // Double the frequency
        amplitude *= 0.5; // Halve the amplitude
    }
    return value;
}


// (Keep the Perlin noise, fbm, and distortion logic as is from the previous good version)

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);
  vec2 mouseInfluence = (uMouse - 0.5) * 0.2;
  vec2 centerOffset = mouseInfluence;
  vec2 p = uv - centerOffset;

  float angle = atan(p.y, p.x);
  float baseRadius = 0.6;

  float lobeFrequency = 5.0;
  float lobeAmplitude = 0.1;
  float lobeDistortion = lobeAmplitude * sin(angle * lobeFrequency + iTime * 0.5);

  float noiseFrequency = 2.5;
  float noiseAmplitude = 0.15;
  // Readjust noise influence if it's making the shape too 'busy' for distinct lines
  float noiseDistortion = noiseAmplitude * fbm(vec2(p.x * noiseFrequency + iTime * 0.2, p.y * noiseFrequency + iTime * 0.2));

  float distortedRadius = baseRadius + lobeDistortion + noiseDistortion;
  float dist = length(p);

  // --- Contour Lines ---
  float contourValue = dist - distortedRadius; // Value to be contoured
  float linePhase = iTime * 0.4; // Animation for lines moving inward/outward

  // uSpacing defines the distance between lines.
  // contourValue is scaled to make uSpacing more intuitive (e.g. 0.1 for 10 lines in a unit)
  // The multiplication factor (e.g., 20.0 here) determines how many line 'bands' appear
  // for a given change in contourValue. Adjust this factor and uSpacing.
  float scaledContourValue = contourValue * 20.0; // Increase this for more lines / denser packing

  float ringVal = mod(scaledContourValue + linePhase, uSpacing);

  // Make lines thinner and sharper
  // lineThickness is now a very small absolute value for thin lines
  float lineThickness = 0.05; // Target a small absolute thickness
  float lineAntialias = 0.005; // Small value for antialiasing the thin line

  // Create a sharp step for the line, then smooth it slightly for antialiasing
  float contourLine = smoothstep(0.0, lineAntialias, ringVal) - smoothstep(lineThickness, lineThickness + lineAntialias, ringVal);
  // This creates a line of 'lineThickness' width.

  // --- Coloring ---
  float blobShape = smoothstep(0.02, -0.01, dist - distortedRadius); // Soft edge for the blob

  vec3 baseBlobColor = vec3(0.02, 0.01, 0.01); // Very dark base for the blob volume
  vec3 lineColor1 = vec3(0.65, 0.40, 1.00);   // Purple (from original reference)
  vec3 lineColor2 = vec3(0.40, 0.55, 1.00);   // Blue (from original reference)

  // Mix line colors - can be simpler or more complex
  float colorMixFactor = 0.5 + 0.5 * sin(angle * 1.5 + iTime * 0.15);
  vec3 finalLineColor = mix(lineColor1, lineColor2, colorMixFactor);

  // Base color of the blob (could be almost black or very dark blue/purple)
  vec3 color = baseBlobColor * blobShape;

  // Add the distinct lines. They should be bright.
  // Multiply by blobShape to ensure lines are only within the blob.
  color = mix(color, finalLineColor, contourLine * blobShape);

  // Subtle overall glow for the blob body itself, not from the lines broadening.
  // This glow should be behind or around the lines.
  // Make the glow softer and more spread out than the lines.
  float glowFalloff = 0.3; // How far the glow extends
  float glowIntensity = 0.3; // How bright the glow is
  float glowFactor = smoothstep(distortedRadius + glowFalloff, distortedRadius - glowFalloff * 0.5, dist);
  color += mix(lineColor1, lineColor2, 0.5) * glowFactor * glowIntensity * blobShape; // Average color for glow


  gl_FragColor = vec4(color, blobShape);
}`;

interface TopographyHeroProps {
  /** Distance between contour lines (higher = fewer lines, visually more spaced out) */
  spacing?: number;
  /** Enable or disable pointer events on the canvas container */
  pointerEvents?: boolean; // Kept from original, useful prop
  /** Enable mouse interaction with the shader */
  enableMouseInteraction?: boolean;
}

const TopographyHero: React.FC<TopographyHeroProps> = ({
  spacing = 2, // Adjusted default for the new shader logic
  pointerEvents = true,
  enableMouseInteraction = true, // Default to true for subtle effect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();
  const mousePosition = useRef(new Vec2(0.5, 0.5)); // Using OGL's Vec2
  const targetMousePosition = useRef(new Vec2(0.5, 0.5));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, antialias: true }); // Added antialias
    const gl = renderer.gl;
    // gl.clearColor(0, 0, 0, 0); // Not strictly needed if alpha is true and page bg is dark
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl); // Full-screen triangle
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec2(container.clientWidth, container.clientHeight) },
        uMouse: { value: mousePosition.current }, // Pass the ref's current value
        uSpacing: { value: spacing }
      },
      transparent: true, // Important for blending with page
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      program.uniforms.iResolution.value.set(width, height);
    };
    window.addEventListener("resize", resize);
    resize();

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableMouseInteraction) return;
      const rect = container.getBoundingClientRect();
      targetMousePosition.current.set(
        (e.clientX - rect.left) / rect.width,
        1.0 - (e.clientY - rect.top) / rect.height // Y is inverted in WebGL
      );
    };

    const handleMouseLeave = () => {
      if (!enableMouseInteraction) return;
      targetMousePosition.current.set(0.5, 0.5); // Reset to center
    };

    if (enableMouseInteraction) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    const startTime = performance.now();
    const update = (t: number) => {
      program.uniforms.iTime.value = (performance.now() - startTime) * 0.001;

      if (enableMouseInteraction) {
        // Smooth mouse movement (lerp)
        mousePosition.current.lerp(targetMousePosition.current, 0.05);
        program.uniforms.uMouse.value.copy(mousePosition.current);
      } else {
        // Ensure mouse is centered if interaction is disabled
         mousePosition.current.set(0.5, 0.5);
         program.uniforms.uMouse.value.copy(mousePosition.current);
      }


      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(update);
    };
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("resize", resize);
      if (enableMouseInteraction) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (gl.canvas && container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      // Attempt to gracefully lose context
      const loseContextExt = gl.getExtension("WEBGL_lose_context");
      if (loseContextExt) {
        loseContextExt.loseContext();
      }
      // OGL might have its own cleanup, but being explicit is good
      // program.remove(); // If OGL supports this
      // geometry.remove(); // If OGL supports this
    };
  }, [spacing, enableMouseInteraction]); // Add enableMouseInteraction to dependency array

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-screen overflow-hidden ${pointerEvents ? "" : "pointer-events-none"}`}
      style={{ background: "transparent" }} // Ensure canvas transparency shows through
    >
      {/* Text and CTA overlay remains the same */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white p-4">
        <h1 className="text-5xl font-bold font-sans">Noah Arooji</h1> {/* Updated to match image */}
        <p className="mt-4 text-lg md:text-xl max-w-md md:max-w-lg"> {/* Adjusted text size and margins */}
          CS + STAT Portfolio
        </p>
        <button
          className="mt-8 px-8 py-3 border border-yellow-400 text-yellow-300 rounded-full hover:bg-yellow-400 hover:text-black transition-colors duration-300 text-lg" // Enhanced styling
        >
          View Resume
        </button>
      </div>
    </div>
  );
};

export default TopographyHero;