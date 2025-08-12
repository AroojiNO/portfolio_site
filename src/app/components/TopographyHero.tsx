import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";

// Noise functions GLSL (can be kept separate or injected)
const noiseFunctionsGLSL = `
// 2D Random
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// 2D Perlin Noise (Value Noise variant)
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    return mix(a, b, u.x) +
            (c - a) * u.y * (1.0 - u.x) +
            (d - b) * u.y * u.x;
}

// Fractal Brownian Motion (fBm)
float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) { // 4 octaves
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}
`;

// Vertex shader: full-screen triangle (remains simple)
const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Fragment shader: For organic blob, sharp contour lines, and 2.5D mouse parallax
const fragmentShader = `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec2 uMouse;
uniform float uSpacing;

${noiseFunctionsGLSL}

void main() {
  // --- UV & Centering & Aspect Correction ---
  // Map fragment coordinates to a -1 to 1 range for the shortest dimension,
  // and apply aspect ratio correction. This makes the base circle truly circular.
  vec2 aspect = vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));
  vec2 uv = (gl_FragCoord.xy / iResolution.xy - 0.5) * aspect;

  // --- Mouse Parallax Effect ---
  // Apply a subtle shift to the UV coordinates based on mouse position.
  // This creates a "window" or "tilting" effect.
  // Adjust parallaxFactor to control the strength of the effect.
  float parallaxFactor = 0.05; // How much the shape "tilts" with the mouse
  vec2 parallaxOffset = (uMouse - 0.5) * parallaxFactor;
  uv -= parallaxOffset;


  // --- Blob Shape Calculation ---
  float angle = atan(uv.y, uv.x);
  float baseRadius = 2.500; // Base size of the blob (adjust for desired screen coverage)

  // Lobe Distortion (creates undulating edges)
  float lobeFrequency = 1.0; // Number of lobes
  float lobeAmplitude = 0.00000008;
  float lobeTimePhase = iTime * 0.40;
  float lobeDistortion = lobeAmplitude * sin(angle * lobeFrequency + lobeTimePhase);

  // Perlin Noise Distortion (organic irregularities)
  float noiseFrequency = 1.2;
  float noiseAmplitude = 1.525;
  float noiseTimePhase = iTime * 0.05;
  // Sample noise based on angle and a time-varied component for waviness
  vec2 noiseSamplePoint = uv * noiseFrequency; // using angle gives more consistent distortion around circle
  float noiseVal = fbm(noiseSamplePoint + vec2(noiseTimePhase, -noiseTimePhase * 0.7)); 
  float noiseDistortion = noiseAmplitude * (noiseVal - 0.5); // Center the noise effect

  float distortedRadius = baseRadius + lobeDistortion + noiseDistortion;

  // Calculate distance from the (possibly parallax-shifted) center
  float dist = length(uv);

  // --- Contour Lines ---
  // Value that gets contoured: difference between pixel distance and the blob's edge.
  // This makes lines follow the blob's shape.
  float contourValue = dist - distortedRadius;

  // Animate the contour lines by shifting their phase with time
  float linePhase = iTime * 0.004; // Controls speed of lines moving along the shape
  float lineDensityFactor = 20.0; // Increase for more lines given a uSpacing value

  float ringVal = mod(contourValue * lineDensityFactor + linePhase, uSpacing);

  // Define line thickness and antialiasing for sharp, thin lines
  float lineThickness = 0.045; // Very thin lines
  float lineAntialias = 0.035; // Soften edges slightly

  float contourLine = smoothstep(0.0, lineAntialias, ringVal) - smoothstep(lineThickness, lineThickness + lineAntialias, ringVal);

  // --- Fade lines near the center ---
  // These radii are in the same 'uv' space as 'dist' and 'baseRadius'.
  // Lines will be fully faded if dist < centralFadeEndRadius.
  // Lines will be fully visible if dist > centralFadeStartRadius.
  float centralFadeEndRadius = 0.00;  // Lines fully gone inside this radius from center
  float centralFadeStartRadius = 0.0; // Lines start appearing and become fully visible by this radius

  float centerFadeFactor = smoothstep(centralFadeEndRadius, centralFadeStartRadius, dist);

  float finalContourLineStrength = contourLine * centerFadeFactor;

  // --- Coloring & Glow ---
  // Three color sets for lines
  vec3 lineColorSet1A = vec3(0.60, 0.35, 0.95); // Bright Purple
  vec3 lineColorSet1B = vec3(0.35, 0.50, 1.00); // Lighter Blue

  vec3 lineColorSet2A = vec3(1.0, 0.75, 0.2);   // Amber (#FFC01D)
  vec3 lineColorSet2B = vec3(0.29, 0.34, 0.67); // Indigo (#4956AB)

  vec3 lineColorSet3A = vec3(0.0, 0.8, 0.5);    // Emerald (#00CC80)
  vec3 lineColorSet3B = vec3(0.56, 0.0, 1.0);   // Violet (#8F00FF)

  // Pick which color set to use based on angle and time, so different parts transition at different times
  float colorCycle = mod(iTime * 0.08 + angle * 1.5, 3.0);

  vec3 colorA;
  vec3 colorB;
  if (colorCycle < 1.0) {
    colorA = mix(lineColorSet1A, lineColorSet2A, colorCycle);
    colorB = mix(lineColorSet1B, lineColorSet2B, colorCycle);
  } else if (colorCycle < 2.0) {
    colorA = mix(lineColorSet2A, lineColorSet3A, colorCycle - 1.0);
    colorB = mix(lineColorSet2B, lineColorSet3B, colorCycle - 1.0);
  } else {
    colorA = mix(lineColorSet3A, lineColorSet1A, colorCycle - 2.0);
    colorB = mix(lineColorSet3B, lineColorSet1B, colorCycle - 2.0);
  }

  float colorMixFactor = 0.5 + 0.5 * sin(angle * 2.5 + iTime * 0.2);
  vec3 finalLineColor = mix(colorA, colorB, colorMixFactor);

  // Start with the base color for the blob's body
  float blobMask = smoothstep(distortedRadius, distortedRadius - 0.05, dist);
  vec3 baseColor = vec3(0.01, 0.005, 0.02);
  vec3 color = baseColor * blobMask;

  // Add the sharp contour lines. They should be bright and only appear within the blob.
  color = mix(color, finalLineColor, finalContourLineStrength * blobMask);

  // Subtle overall glow for the blob body, concentrated near the edges
  // This glow should be softer and more spread out than the lines.
  float glowFalloff = 0.35; // How far the glow extends from the edge
  float glowIntensity = 0.05;
  // Glow emanates from slightly inside the distortedRadius outwards
  float glowShape = smoothstep(distortedRadius + glowFalloff, distortedRadius - glowFalloff * 0.5, dist);
  color += mix(colorA, colorB, 0.6) * glowShape * glowIntensity * blobMask;


  gl_FragColor = vec4(color, blobMask); // Use blobMask for alpha to fade edges smoothly
}`;


interface TopographyHeroProps {
  spacing?: number; // uSpacing in shader: affects distance between contour lines
  pointerEvents?: boolean;
  enableMouseInteraction?: boolean;
}

const TopographyHero: React.FC<TopographyHeroProps> = ({
  spacing = 0.4, // Default spacing for contour lines. Adjust this!
  pointerEvents = true,
  enableMouseInteraction = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(null);
  const mousePosition = useRef(new Vec2(0.5, 0.5));
  const targetMousePosition = useRef(new Vec2(0.5, 0.5));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 1.5) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // Standard alpha blending
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl); // Full-screen triangle
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec2(container.clientWidth, container.clientHeight) },
        uMouse: { value: mousePosition.current },
        uSpacing: { value: spacing }
      },
      transparent: true, // Important for blending with page background
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      program.uniforms.iResolution.value.set(width, height);
    };
    window.addEventListener("resize", resize);
    resize(); // Initial call

    const startTime = performance.now();
    const updateLoop = (t: number) => { // Renamed to avoid conflict with 'update' name if defined elsewhere
      program.uniforms.iTime.value = (performance.now() - startTime) * 0.001;

      if (enableMouseInteraction) {
        // Smooth mouse movement (lerp)
        mousePosition.current.lerp(targetMousePosition.current, 0.07); // Adjust smoothing factor
        program.uniforms.uMouse.value.copy(mousePosition.current);
      } else {
        // Ensure mouse is centered if interaction is disabled or not active
        if(mousePosition.current.x !== 0.5 || mousePosition.current.y !== 0.5){
            targetMousePosition.current.set(0.5,0.5); // Gently move back to center
            mousePosition.current.lerp(targetMousePosition.current, 0.02);
            program.uniforms.uMouse.value.copy(mousePosition.current);
        }
      }

      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(updateLoop);
    };
    animationFrameId.current = requestAnimationFrame(updateLoop);

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableMouseInteraction || !container) return;
      const rect = container.getBoundingClientRect();
      targetMousePosition.current.set(
        e.clientX / rect.width, // No subtraction of rect.left if canvas is full window
        1.0 - (e.clientY / rect.height) // Y is inverted; no subtraction of rect.top
      );
    };

    const handleMouseLeave = () => {
      if (!enableMouseInteraction) return;
      targetMousePosition.current.set(0.5, 0.5); // Reset to center
    };

    // Use window for mouse move if the canvas container is full screen
    // Otherwise, use 'container'
    const eventTarget = window; // Assuming full screen hero
    if (enableMouseInteraction) {
      eventTarget.addEventListener("mousemove", handleMouseMove as EventListener);
      // Only add mouseleave if container is not full window, otherwise mouse rarely leaves window
      // For full window, it's better to let it drift back to center if interaction stops.
      // container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      window.removeEventListener("resize", resize);
      if (enableMouseInteraction) {
        eventTarget.removeEventListener("mousemove", handleMouseMove as EventListener);
        // container.removeEventListener("mouseleave", handleMouseLeave);
      }
      if (gl.canvas && container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      const loseContextExt = gl.getExtension("WEBGL_lose_context");
      if (loseContextExt) loseContextExt.loseContext();
    };
  }, [spacing, enableMouseInteraction]);

  return (
    <div
      ref={containerRef}
      className={`absolute items-center inset-0 w-full h-full ${pointerEvents ? "" : "pointer-events-none"} -z-10`}
      style={{ background: "transparent", justifyContent: "center", alignItems: "center" }}
    >
      {/* Canvas is appended here. The -z-10 and fixed positioning
          helps ensure it's a background element.
          Your main page content should have a higher z-index. */}
    </div>
  );
};

// In your page structure (e.g. app/page.tsx)
// export default function Page() {
//   return (
//     <div className="bg-gray-900 min-h-screen"> {/* Or your desired page background */}
//       <TopographyHero spacing={0.35} enableMouseInteraction={true} />
//       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white p-4 pointer-events-none">
//          <div className="pointer-events-auto"> {/* Enable pointer events for this content block */}
//            <h1 className="text-5xl md:text-6xl font-bold">Noah</h1>
//            <p className="mt-4 text-lg md:text-xl max-w-md md:max-w-lg">
//              I'm Noah – a software engineer and researcher passionate about clean design and performant code.
//            </p>
//            <button className="mt-8 px-8 py-3 border border-yellow-400 text-yellow-300 rounded-full hover:bg-yellow-400 hover:text-black transition-colors duration-300 text-lg">
//              View Resume
//            </button>
//          </div>
//       </div>
//     </div>
//   );
// }

export default TopographyHero;