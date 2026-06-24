'use client';

import { useRef, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// ─────────────────────────────────────────
// GLSL: Vertex Shader
// Displaces vertices based on noise for the
// "jagged" high-stress effect
// ─────────────────────────────────────────
const vertexShader = `
  uniform float uTime;
  uniform float uDisplacement;
  uniform float uNoiseScale;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  // Classic Perlin noise helpers
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    // Fractal Brownian Motion — layer noise octaves for richer displacement
    vec3 noiseCoord = position * uNoiseScale + vec3(uTime * 0.3);
    float noise = snoise(noiseCoord);
    noise += 0.5 * snoise(noiseCoord * 2.1 + vec3(uTime * 0.5));
    noise += 0.25 * snoise(noiseCoord * 4.3 - vec3(uTime * 0.7));
    noise = noise / 1.75; // normalise

    vec3 displaced = position + normal * noise * uDisplacement;
    vPosition = displaced;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

// ─────────────────────────────────────────
// GLSL: Fragment Shader
// Glassmorphic fresnel rim + inner glow
// ─────────────────────────────────────────
const fragmentShader = `
  uniform float uTime;
  uniform vec3  uColorA;  // primary color (calm teal or stress purple)
  uniform vec3  uColorB;  // secondary color
  uniform float uOpacity;
  uniform float uFresnelPower;
  uniform float uGlowIntensity;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  // Simple hash for grain
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), uFresnelPower);

    // Animated internal swirl color
    float swirl = sin(vUv.x * 6.28 + uTime * 0.4) * cos(vUv.y * 6.28 - uTime * 0.3);
    vec3 innerColor = mix(uColorA, uColorB, swirl * 0.5 + 0.5);

    // Rim glow (fresnel)
    vec3 rimColor = uColorA * uGlowIntensity;
    vec3 color = mix(innerColor * 0.6, rimColor, fresnel);

    // Grain noise
    vec2 grainCoord = vUv * 400.0 + uTime * 3.0;
    float grain = hash(grainCoord) * 0.04 - 0.02;
    color += grain;

    // Alpha: glass-like, opaque rim, more transparent center
    float alpha = mix(uOpacity * 0.4, uOpacity, fresnel);
    alpha = clamp(alpha + 0.1, 0.0, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ─────────────────────────────────────────
// Extend: register as a JSX element
// ─────────────────────────────────────────
const OrbMaterial = shaderMaterial(
  {
    uTime: 0,
    uDisplacement: 0.0,
    uNoiseScale: 1.2,
    uColorA: new THREE.Color('#2dd4bf'), // calm teal
    uColorB: new THREE.Color('#6366f1'), // indigo
    uOpacity: 0.85,
    uFresnelPower: 3.5,
    uGlowIntensity: 2.2,
  },
  vertexShader,
  fragmentShader
);

extend({ OrbMaterial });

// Augment JSX types
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      orbMaterial: React.ComponentPropsWithRef<'mesh'> & {
        ref?: React.Ref<typeof OrbMaterial & THREE.ShaderMaterial>;
        uTime?: number;
        uDisplacement?: number;
        uNoiseScale?: number;
        uColorA?: THREE.Color;
        uColorB?: THREE.Color;
        uOpacity?: number;
        uFresnelPower?: number;
        uGlowIntensity?: number;
        transparent?: boolean;
        side?: THREE.Side;
        depthWrite?: boolean;
      };
    }
  }
}

// ─────────────────────────────────────────
// State presets
// ─────────────────────────────────────────
function getStatePreset(stressLevel: number) {
  if (stressLevel >= 8) {
    // HIGH STRESS — jagged, erratic, urgent
    return {
      displacement: 0.42,
      noiseScale: 2.8,
      rotationSpeedX: 1.8,
      rotationSpeedY: 2.4,
      colorA: new THREE.Color('#7c3aed'), // deep violet
      colorB: new THREE.Color('#c2410c'), // dark orange
      glowIntensity: 3.2,
      fresnelPower: 2.2,
      scale: 1.08,
    };
  } else if (stressLevel >= 5) {
    // MID — transitioning
    const t = (stressLevel - 5) / 3;
    return {
      displacement: 0.12 + t * 0.3,
      noiseScale: 1.6 + t * 1.2,
      rotationSpeedX: 0.5 + t * 1.3,
      rotationSpeedY: 0.6 + t * 1.8,
      colorA: new THREE.Color().lerpColors(new THREE.Color('#2dd4bf'), new THREE.Color('#7c3aed'), t),
      colorB: new THREE.Color().lerpColors(new THREE.Color('#6366f1'), new THREE.Color('#c2410c'), t),
      glowIntensity: 2.2 + t * 1.0,
      fresnelPower: 3.5 - t * 1.3,
      scale: 1.0 + t * 0.08,
    };
  } else {
    // LOW STRESS — smooth, calming, slow
    return {
      displacement: 0.04,
      noiseScale: 1.0,
      rotationSpeedX: 0.12,
      rotationSpeedY: 0.18,
      colorA: new THREE.Color('#2dd4bf'), // teal
      colorB: new THREE.Color('#38bdf8'), // sky blue
      glowIntensity: 2.0,
      fresnelPower: 3.8,
      scale: 1.0,
    };
  }
}

// ─────────────────────────────────────────
// MindscapeOrb mesh (inner component)
// ─────────────────────────────────────────
interface OrbProps {
  stressLevel: number;
}

export function MindscapeOrbMesh({ stressLevel }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial & {
    uTime: number; uDisplacement: number; uNoiseScale: number;
    uColorA: THREE.Color; uColorB: THREE.Color;
    uGlowIntensity: number; uFresnelPower: number;
  }>(null);

  // Mutable live values (lerped each frame by GSAP or manually)
  const liveRef = useRef({
    rotSpeedX: 0.12,
    rotSpeedY: 0.18,
    displacement: 0.04,
    noiseScale: 1.0,
    glowIntensity: 2.0,
    fresnelPower: 3.8,
    scale: 1.0,
    colorA: new THREE.Color('#2dd4bf'),
    colorB: new THREE.Color('#38bdf8'),
  });

  // Animate to new preset whenever stressLevel changes
  useEffect(() => {
    const preset = getStatePreset(stressLevel);
    const live = liveRef.current;

    gsap.to(live, {
      duration: 2.4,
      ease: 'power2.inOut',
      rotSpeedX: preset.rotationSpeedX,
      rotSpeedY: preset.rotationSpeedY,
      displacement: preset.displacement,
      noiseScale: preset.noiseScale,
      glowIntensity: preset.glowIntensity,
      fresnelPower: preset.fresnelPower,
      scale: preset.scale,
    });

    // Animate colors separately (GSAP doesn't know THREE.Color natively)
    gsap.to(live.colorA, {
      duration: 2.4,
      ease: 'power2.inOut',
      r: preset.colorA.r,
      g: preset.colorA.g,
      b: preset.colorA.b,
    });
    gsap.to(live.colorB, {
      duration: 2.4,
      ease: 'power2.inOut',
      r: preset.colorB.r,
      g: preset.colorB.g,
      b: preset.colorB.b,
    });
  }, [stressLevel]);

  useFrame((state, delta) => {
    if (!meshRef.current || !matRef.current) return;
    const live = liveRef.current;

    // Tick time
    matRef.current.uTime += delta;

    // Apply live lerped uniforms
    matRef.current.uDisplacement = live.displacement;
    matRef.current.uNoiseScale = live.noiseScale;
    matRef.current.uGlowIntensity = live.glowIntensity;
    matRef.current.uFresnelPower = live.fresnelPower;
    matRef.current.uColorA.copy(live.colorA);
    matRef.current.uColorB.copy(live.colorB);

    // Erratic vs smooth rotation
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x += delta * live.rotSpeedX * (stressLevel >= 8 ? (1 + 0.3 * Math.sin(t * 7.3)) : 1);
    meshRef.current.rotation.y += delta * live.rotSpeedY * (stressLevel >= 8 ? (1 + 0.4 * Math.cos(t * 5.9)) : 1);

    // Scale breathe (slow calm pulse or frantic pulse)
    const pulseFreq = stressLevel >= 8 ? 3.2 : 0.8;
    const pulseAmp = stressLevel >= 8 ? 0.03 : 0.015;
    const pulse = 1 + Math.sin(t * pulseFreq) * pulseAmp;
    meshRef.current.scale.setScalar(live.scale * pulse);
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1, 64]} />
      {/* @ts-expect-error — custom extend material */}
      <orbMaterial
        ref={matRef}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
