import React, { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2, RenderTarget, Texture } from "ogl";
import type { OGLRenderingContext } from "ogl";

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

// Cursor push simulation. Each texel stores how far the lines at that spot are pushed (xy)
// and how fast that push is changing (zw), both in units of the hero's short side.
// Every step springs the push toward a soft clearing around the cursor: the lines ease out of
// the way while it lingers, then drift back once it has gone, overshooting a little as they settle.
const simVertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const simFragmentShader = `
precision highp float;
uniform sampler2D uState;
uniform vec2 uTexel;     // one sim texel, in texture coordinates
uniform vec2 uAspect;    // hero size divided by its short side
uniform vec2 uMouse;     // cursor, in short-side units from the hero's bottom-left
uniform float uStrength; // 1 while the cursor is on the page, 0 once it leaves
uniform float uDt;
varying vec2 vUv;

void main() {
  vec4 state = texture2D(uState, vUv);
  vec2 offset = state.xy;
  vec2 velocity = state.zw;

  // Where the cursor wants the lines: pushed out of a soft circle around it, strongest at the
  // cursor and fading with distance. Space squeezes in toward the cursor, so lines thin out
  // and fade there. pushStrength near 1.0 clears the very centre, lower leaves faint lines.
  float pushStrength = 0.95;
  float pushRadius = 0.18;
  vec2 fromMouse = vUv * uAspect - uMouse;
  vec2 target = fromMouse * pushStrength * uStrength * exp(-dot(fromMouse, fromMouse) / (pushRadius * pushRadius));

  // Let each spot feel its neighbours, so a push ripples gently into the surrounding lines
  vec2 cell = uTexel * uAspect;
  vec2 left = texture2D(uState, vUv - vec2(uTexel.x, 0.0)).xy;
  vec2 right = texture2D(uState, vUv + vec2(uTexel.x, 0.0)).xy;
  vec2 down = texture2D(uState, vUv - vec2(0.0, uTexel.y)).xy;
  vec2 up = texture2D(uState, vUv + vec2(0.0, uTexel.y)).xy;
  vec2 spread = (left + right - 2.0 * offset) / (cell.x * cell.x) + (down + up - 2.0 * offset) / (cell.y * cell.y);

  // Damped spring toward the target, tuned separately for lines moving away and lines returning.
  // Lower stiffness = slower, lower damping = more wobble.
  float pushStiffness = 25.0;
  float pushDamping = 8.0;
  float returnStiffness = 3.0;
  float returnDamping = 2.1;
  float pushing = clamp((length(target) - length(offset)) / 0.01, 0.0, 1.0);
  float stiffness = mix(returnStiffness, pushStiffness, pushing);
  float damping = mix(returnDamping, pushDamping, pushing);
  float spreadAmount = 0.02;
  vec2 accel = (target - offset) * stiffness + spread * spreadAmount - velocity * damping;
  velocity += accel * uDt;
  offset += velocity * uDt;

  gl_FragColor = vec4(offset, velocity);
}`;

const SIM_SIZE = 128;      // the push varies smoothly, so a small texture is plenty
const SIM_STEP = 1 / 60;   // fixed step, so the spring feels the same at any frame rate
const SIM_MAX_STEPS = 4;   // per frame, so a slow frame can't snowball
const SIM_SETTLE_TIME = 6; // seconds after the cursor last changed before the sim can sleep

// Two half-float targets to ping-pong between, or null if this device can't render to them
// (the hero then just draws without the cursor push)
function createSimTargets(gl: OGLRenderingContext): [RenderTarget, RenderTarget] | null {
  const renderer = gl.renderer;
  let type: number;
  let internalFormat: number;
  if (renderer.isWebgl2) {
    const gl2 = gl as WebGL2RenderingContext;
    gl2.getExtension("EXT_color_buffer_half_float");
    type = gl2.HALF_FLOAT;
    internalFormat = gl2.RGBA16F;
  } else {
    const halfFloat = renderer.extensions["OES_texture_half_float"];
    if (!halfFloat) return null;
    type = halfFloat.HALF_FLOAT_OES;
    internalFormat = gl.RGBA;
  }
  const filter = renderer.isWebgl2 || renderer.extensions["OES_texture_half_float_linear"] ? gl.LINEAR : gl.NEAREST;
  const options = { width: SIM_SIZE, height: SIM_SIZE, type, format: gl.RGBA, internalFormat, minFilter: filter, depth: false };
  const targets: [RenderTarget, RenderTarget] = [new RenderTarget(gl, options), new RenderTarget(gl, options)];
  const complete = targets.every((target) => {
    renderer.bindFramebuffer(target);
    return gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
  });
  renderer.bindFramebuffer();
  return complete ? targets : null;
}

// Vertex shader: full-screen triangle (remains simple)
const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

// Fragment shader: For organic blob and sharp contour lines, pushed around by the cursor simulation
const fragmentShader = `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform float uSpacing;
uniform sampler2D uOffset; // cursor push from the simulation, in short-side units
uniform vec2 uBufferSize;  // canvas size in device pixels
uniform vec2 uSimTexel;    // one sim texel, in texture coordinates

${noiseFunctionsGLSL}

void main() {
  // --- UV & Centering & Aspect Correction ---
  // Map fragment coordinates to a -1 to 1 range for the shortest dimension,
  // and apply aspect ratio correction. This makes the base circle truly circular.
  vec2 aspect = vec2(iResolution.x / min(iResolution.x, iResolution.y), iResolution.y / min(iResolution.x, iResolution.y));

  // --- Cursor Push ---
  // Draw each pixel with the pattern from a little closer to the cursor,
  // which pushes the lines outward wherever the simulation says they've been pushed.
  vec2 screen = gl_FragCoord.xy / uBufferSize;
  float shortSide = min(uBufferSize.x, uBufferSize.y);
  vec2 offset = texture2D(uOffset, screen).xy;
  vec2 fragCoord = gl_FragCoord.xy - offset * shortSide;
  vec2 uv = (fragCoord / iResolution.xy - 0.5) * aspect;

  // How much the push squashes space here: 1 where untouched, dropping toward 0 near the cursor
  // (and below 0 if a trail folds over itself). Lines fade gradually as it drops, so they thin
  // out toward the cursor rather than bunching up underneath it.
  vec2 cell = uSimTexel * uBufferSize / shortSide; // one sim texel, in short-side units
  vec2 offsetChangeX = (texture2D(uOffset, screen + vec2(uSimTexel.x, 0.0)).xy - texture2D(uOffset, screen - vec2(uSimTexel.x, 0.0)).xy) / (2.0 * cell.x);
  vec2 offsetChangeY = (texture2D(uOffset, screen + vec2(0.0, uSimTexel.y)).xy - texture2D(uOffset, screen - vec2(0.0, uSimTexel.y)).xy) / (2.0 * cell.y);
  float squash = (1.0 - offsetChangeX.x) * (1.0 - offsetChangeY.y) - offsetChangeY.x * offsetChangeX.y;
  float clearedFade = smoothstep(0.0, 0.9, squash);

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

  // Calculate distance from the center
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

  float finalContourLineStrength = contourLine * centerFadeFactor * clearedFade;

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

  float colorMixFactor = 0.25 + 0.05 * sin(angle * 2.5 + iTime * 0.2);
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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio, 1.5) });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl); // Full-screen triangle

    // The cursor push only runs for a mouse, and not for visitors who prefer reduced motion
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const simTargets = enableMouseInteraction && !reduceMotion ? createSimTargets(gl) : null;
    const simProgram = new Program(gl, {
      vertex: simVertexShader,
      fragment: simFragmentShader,
      uniforms: {
        uState: { value: simTargets?.[0].texture },
        uTexel: { value: new Vec2(1 / SIM_SIZE, 1 / SIM_SIZE) },
        uAspect: { value: new Vec2(1, 1) },
        uMouse: { value: new Vec2(0, 0) },
        uStrength: { value: 0 },
        uDt: { value: SIM_STEP },
      },
      depthTest: false,
      depthWrite: false,
      cullFace: null,
    });
    const simMesh = new Mesh(gl, { geometry, program: simProgram });

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec2(container.clientWidth, container.clientHeight) },
        uSpacing: { value: spacing },
        // Without the sim, a blank texture reads as no push at all
        uOffset: { value: simTargets ? simTargets[0].texture : new Texture(gl) },
        uBufferSize: { value: new Vec2(1, 1) },
        uSimTexel: { value: new Vec2(1 / SIM_SIZE, 1 / SIM_SIZE) },
      },
      transparent: true, // Important for blending with page background
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      program.uniforms.iResolution.value.set(width, height);
      program.uniforms.uBufferSize.value.set(gl.canvas.width, gl.canvas.height);
      lastActivity = performance.now();
    };

    // Latest cursor position in the viewport, and whether it's on the page at all
    const pointer = { x: 0, y: 0, onPage: false };
    let lastActivity = -Infinity;
    let readIndex = 0;

    const stepSim = () => {
      if (!simTargets) return;
      const read = simTargets[readIndex];
      const write = simTargets[1 - readIndex];
      simProgram.uniforms.uState.value = read.texture;
      renderer.render({ scene: simMesh, target: write });
      readIndex = 1 - readIndex;
      program.uniforms.uOffset.value = write.texture;
    };

    let lastFrame = performance.now();
    let simTime = 0;
    const startTime = performance.now();
    const updateLoop = () => {
      const now = performance.now();
      const frameDt = Math.min((now - lastFrame) * 0.001, 0.1);
      lastFrame = now;
      program.uniforms.iTime.value = (now - startTime) * 0.001;

      // Step the push simulation at a fixed rate, and let it sleep once the cursor
      // has stopped changing anything, since the lines have settled by then
      if (simTargets && (now - lastActivity) * 0.001 < SIM_SETTLE_TIME) {
        const rect = container.getBoundingClientRect();
        const shortSide = Math.min(rect.width, rect.height);
        simProgram.uniforms.uAspect.value.set(rect.width / shortSide, rect.height / shortSide);
        simProgram.uniforms.uMouse.value.set((pointer.x - rect.left) / shortSide, (rect.bottom - pointer.y) / shortSide);
        simProgram.uniforms.uStrength.value = pointer.onPage ? 1 : 0;

        simTime += frameDt;
        let steps = 0;
        while (simTime >= SIM_STEP && steps < SIM_MAX_STEPS) {
          stepSim();
          simTime -= SIM_STEP;
          steps++;
        }
        if (steps === SIM_MAX_STEPS) simTime = 0;
      }

      renderer.render({ scene: mesh });
      animationFrameId.current = requestAnimationFrame(updateLoop);
    };

    // Only draw while the hero is on screen, so the shader doesn't keep the GPU busy after scrolling past it
    const startLoop = () => {
      if (animationFrameId.current === null) {
        lastFrame = performance.now();
        animationFrameId.current = requestAnimationFrame(updateLoop);
      }
    };
    const stopLoop = () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startLoop();
      else stopLoop();
    });
    visibilityObserver.observe(container);

    // Touch is skipped: a tap would leave the lines pushed around a spot nobody is pointing at
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.onPage = true;
      lastActivity = performance.now();
    };
    // relatedTarget is null only when the cursor leaves the window itself
    const handleMouseOut = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      pointer.onPage = false;
      lastActivity = performance.now();
    };
    // Scrolling moves the hero under a still cursor
    const handleScroll = () => {
      lastActivity = performance.now();
    };

    window.addEventListener("resize", resize);
    resize(); // Initial call
    if (simTargets) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("mouseout", handleMouseOut);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      visibilityObserver.disconnect();
      stopLoop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("scroll", handleScroll);
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