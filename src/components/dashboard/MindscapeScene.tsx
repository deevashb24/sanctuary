'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { MindscapeOrbMesh } from './MindscapeOrb';

const PARTICLE_COUNT = 180;
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 2.2 + Math.random() * 2.8;
  particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  particlePositions[i * 3 + 2] = r * Math.cos(phi);
}

// Tiny orbiting particles for atmosphere
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.04;
      pointsRef.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#63d2ff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// Outer halo ring (aura)
function AuraRing({ stressLevel }: { stressLevel: number }) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.elapsedTime;
    ringRef.current.rotation.x = Math.sin(t * 0.3) * 0.4;
    ringRef.current.rotation.z = Math.cos(t * 0.2) * 0.3;
    const pulse = 1 + Math.sin(t * (stressLevel >= 8 ? 2.4 : 0.7)) * 0.04;
    ringRef.current.scale.setScalar(pulse);
  });

  const color = stressLevel >= 8 ? '#7c3aed' : stressLevel >= 5 ? '#6366f1' : '#2dd4bf';

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[1.55, 0.008, 8, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

// Post-processing stack
function PostEffects({ stressLevel }: { stressLevel: number }) {
  const bloomIntensity = stressLevel >= 8 ? 1.8 : 1.1;
  const noiseOpacity = 0.028;

  return (
    <EffectComposer>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.15}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Noise
        opacity={noiseOpacity}
        blendFunction={BlendFunction.OVERLAY}
      />
      <ChromaticAberration
        offset={new THREE.Vector2(stressLevel >= 8 ? 0.0008 : 0.0002, stressLevel >= 8 ? 0.0008 : 0.0002)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={1}
      />
      <Vignette
        offset={0.35}
        darkness={0.8}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

interface MindscapeSceneProps {
  stressLevel: number;
}

export default function MindscapeScene({ stressLevel }: MindscapeSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45, near: 0.1, far: 100 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      {/* Ambient fill — very subtle */}
      <ambientLight intensity={0.05} />

      {/* Rim light from above-left — drives the fresnel glow */}
      <pointLight position={[-3, 3, 2]} intensity={2.5} color="#63d2ff" />
      <pointLight position={[3, -2, -2]} intensity={1.8} color={stressLevel >= 8 ? '#c2410c' : '#6366f1'} />

      <Suspense fallback={null}>
        <MindscapeOrbMesh stressLevel={stressLevel} />
        <AuraRing stressLevel={stressLevel} />
        <ParticleField />
        <PostEffects stressLevel={stressLevel} />
      </Suspense>
    </Canvas>
  );
}
