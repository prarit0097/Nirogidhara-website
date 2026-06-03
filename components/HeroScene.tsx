"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function HerbLeaf({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const ref = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = rotation[2] + Math.sin(clock.elapsedTime + position[0]) * 0.08;
    }
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <sphereGeometry args={[0.38, 24, 24]} />
      <meshStandardMaterial color="#83a85f" roughness={0.58} metalness={0.03} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[4, 5, 6]} intensity={3.2} color="#ffd78d" />
      <pointLight position={[-3, -2, 2]} intensity={1.6} color="#4aa083" />
      <Float speed={1.35} rotationIntensity={0.35} floatIntensity={0.6}>
        <mesh position={[1.4, 0.2, -1]}>
          <torusGeometry args={[1.8, 0.018, 12, 96]} />
          <meshStandardMaterial color="#d69b4d" metalness={0.8} roughness={0.28} />
        </mesh>
        <mesh position={[1.4, 0.2, -1]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[1.15, 0.012, 12, 80]} />
          <meshStandardMaterial color="#f0d487" metalness={0.55} roughness={0.24} />
        </mesh>
      </Float>
      <mesh position={[1.6, 0.4, -1.35]}>
        <sphereGeometry args={[0.78, 48, 48]} />
        <meshStandardMaterial emissive="#d98d30" emissiveIntensity={1.8} color="#ffc26f" roughness={0.42} />
      </mesh>
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.8, 0.15, 24, 128, Math.PI * 1.25]} />
        <meshStandardMaterial color="#3d8b75" roughness={0.2} metalness={0.16} />
      </mesh>
      <HerbLeaf position={[-1.8, -0.7, 0]} rotation={[0.45, 0.2, -0.7]} />
      <HerbLeaf position={[-1.25, -0.3, 0.1]} rotation={[0.2, 0.1, 0.25]} />
      <HerbLeaf position={[-0.75, -0.8, 0]} rotation={[0.45, -0.1, 0.72]} />
      <Sparkles count={65} scale={[5, 3, 2]} size={3.4} color="#f1d184" speed={0.35} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="hero-scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.6]}>
        <Scene />
      </Canvas>
    </div>
  );
}
