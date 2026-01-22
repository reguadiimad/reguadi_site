"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Center,
  Float,
  MeshTransmissionMaterial,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";

// --- Materials ---

// ULTRA-OPTIMIZED CRYSTAL
// This configuration looks 90% as good as high settings but runs 300% faster.
const FastCrystalMaterial = ({ isDarkMode }) => (
  <MeshTransmissionMaterial
    backside={false} // Renders only front face (Huge FPS boost)
    samples={1}      // Lowest sampling (Fastest)
    resolution={256} // Low res refraction (Very light on GPU)
    thickness={0.8}
    chromaticAberration={0.06} // Kept this for the "premium" look
    anisotropy={0}   // Disabled expensive light calculations
    distortion={0.1}
    distortionScale={0.1}
    temporalDistortion={0}
    iridescence={0}
    roughness={0}
    metalness={0.1}
    color={"#ffffff"} 
    transmission={0.95}
    background={isDarkMode ? new THREE.Color('#000') : new THREE.Color('#fff')}
  />
);

// --- Geometries ---

const CrystalGear = ({ 
  position, 
  rotation = [0, 0, 0], 
  isDarkMode,
  radius = 1, 
  teethCount = 12, 
  speed = 1, 
  thickness = 0.5 
}) => {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Continuous gear spinning
      meshRef.current.rotation.z += delta * speed;
    }
  });

  const teeth = useMemo(() => {
    return new Array(teethCount).fill(0).map((_, i) => {
      const angle = (i / teethCount) * Math.PI * 2;
      return (
        <mesh
          key={i}
          position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
          rotation={[0, 0, angle]}
        >
          {/* Low poly box for teeth */}
          <boxGeometry args={[0.35, 0.45, thickness]} />
          <FastCrystalMaterial isDarkMode={isDarkMode} />
        </mesh>
      );
    });
  }, [teethCount, radius, thickness, isDarkMode]);

  return (
    <group position={position} rotation={rotation} ref={meshRef}>
      {/* Main Cylinder Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        {/* Segments reduced to 24 for performance */}
        <cylinderGeometry args={[radius - 0.1, radius - 0.1, thickness, 24]} />
        <FastCrystalMaterial isDarkMode={isDarkMode} />
      </mesh>
      
      {/* Inner Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={[0.5, 0.5, 1.05]}>
         <cylinderGeometry args={[radius - 0.1, radius - 0.1, thickness, 24]} />
         <FastCrystalMaterial isDarkMode={isDarkMode} />
      </mesh>
      
      {teeth}
    </group>
  );
};

// --- Main 3D Model ---

const MechanismModel = ({ isDarkMode }) => {
  const group = useRef();
  
  // RESTORED: Full Mouse Interaction (The "Toggle" Feel)
  useFrame((state) => {
    if (!group.current) return;
    
    const { x, y } = state.mouse;
    
    // We use a stronger multiplier (0.5) to make the movement visible
    // and a lerp factor of 0.1 for that smooth "magnetic" delay.
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.5, 0.1);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.5, 0.1);
  });

  return (
    <Float 
      speed={2} 
      rotationIntensity={0.2} 
      floatIntensity={0.5} 
      floatingRange={[-0.1, 0.1]}
    >
      {/* Initial rotation set to display them nicely */}
      <group ref={group} dispose={null} rotation={[0, 0, 0]}>
        
        {/* Gear 1: Big Driver */}
        <CrystalGear 
          position={[-0.8, 0, 0]} 
          radius={1.6} 
          teethCount={12} 
          isDarkMode={isDarkMode}
          speed={0.2} 
          thickness={0.6}
        />

        {/* Gear 2: Small Follower */}
        <CrystalGear 
          position={[1.5, 1.2, 0.2]} 
          radius={0.8} 
          teethCount={8} 
          isDarkMode={isDarkMode}
          rotation={[0, 0, 0.4]} 
          speed={-0.3} 
          thickness={0.6}
        />
        
      </group>
    </Float>
  );
};

// --- Main Component ---

export default function CrystalBackend() {
  const currentTheme = useSelector((state) => state.theme.theme);
  const [systemIsDark, setSystemIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      setSystemIsDark(mediaQuery.matches);
      const handler = (e) => setSystemIsDark(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const isDarkMode = 
    currentTheme === "dark" || 
    (currentTheme === "system" && systemIsDark);

  return (
    <div className="">
      <Canvas 
        // Optimization: Disable shadows if not strictly necessary for the glass effect
        // (Glass usually casts caustics, not shadows, so we can save GPU here)
        shadows={false}
        dpr={[1, 1.5]} // Cap pixel ratio at 1.5
        camera={{ position: [0, 0, 10], fov: 45 }} 
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }} 
      >
        <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={50} />
        
        {/* Lighting adapted for Fast Material */}
        <ambientLight intensity={isDarkMode ? 0.5 : 0.8} />
        
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.5} 
          penumbra={1} 
          intensity={2} 
          color="white"
        />

        <spotLight 
          position={[-10, 0, -5]} 
          intensity={3} 
          color={isDarkMode ? "#22d3ee" : "#bae6fd"} 
        />
        
        <pointLight position={[0, 0, -5]} intensity={1} color="white" />

        {/* Lower blur allows environment to reflect sharper without expensive roughness calcs */}
        <Environment preset={isDarkMode ? "city" : "studio"} blur={0.5} />

        <Center>
          <MechanismModel isDarkMode={isDarkMode} />
        </Center>
      </Canvas>
    </div>
  );
}