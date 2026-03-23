"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { useSelector } from "react-redux";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Environment,
  Center,
  Float,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";

// --- Configuration ---
const GLASS_RESOLUTION = 500;
const GLASS_SAMPLES = 6;

const ToggleSwitchCrystal = ({ isDarkMode }) => {
  const groupRef = useRef();
  const knobRef = useRef();
  
  // Animation Progress Ref: Starts at 0, animates to 1
  const entranceProgress = useRef(0);
  
  const mouse = useRef({ x: 0, y: 0 });

  const { viewport } = useThree();

  // --- Material Settings (Kept exact) ---
  const materialProps = isDarkMode
    ? {
        color: "#ffffff",
        transmission: 0.88,
        opacity: 1,
        roughness: 0.1,
        thickness: 3.5,
        ior: 1,
        chromaticAberration: 0.04,
        anisotropy: 0.1,
        distortion: 0.2,
        distortionScale: 0.2,
        temporalDistortion: 0.1,
        attenuationDistance: 1,
        attenuationColor: "#eef2ff",
      }
    : {
        color: "#eef2ff",
        transmission: 0.9,
        opacity: 1,
        roughness: 0.1,
        thickness: 2.5,
        ior: 1.2,
        chromaticAberration: 0.1,
        anisotropy: 1,
        distortion: 0.2,
        distortionScale: 0.2,
        temporalDistortion: 0.1,
        attenuationDistance: 0.5,
        attenuationColor: "#ffffff",
      };

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    // 1. ANIMATION: Smoothly damp entranceProgress from 0 to 1
    // The '3' is the speed. Higher = faster.
    entranceProgress.current = THREE.MathUtils.damp(entranceProgress.current, 1, 3, delta);

    // 2. RESPONSIVENESS: Calculate base scale
    const responsiveScale = Math.min(
      1,
      viewport.width / 12,
      viewport.height / 12
    );

    if (groupRef.current) {
      // 3. COMBINE: Multiply responsive scale by animation progress
      // This ensures it never gets "too big" because responsiveScale acts as a ceiling
      const currentScale = responsiveScale * entranceProgress.current;
      groupRef.current.scale.setScalar(currentScale);

      // 4. PARALLAX + ENTRANCE SPIN
      // (1 - entranceProgress.current) is 1 at start, 0 at end.
      // We use this to add a slight "spin in" effect that disappears as it loads.
      const entranceRotation = (1 - entranceProgress.current) * Math.PI * 0.5;

      // Apply Mouse Parallax X
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.2, 
        0.05
      );

      // Apply Mouse Parallax Y + Entrance Spin
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (mouse.current.x * 0.4) + entranceRotation, // Add the spin here
        0.05
      );
    }

    // Knob switching logic
    const targetX = isDarkMode ? 1.2 : -1.2;
    if (knobRef.current) {
      knobRef.current.position.x = THREE.MathUtils.lerp(
        knobRef.current.position.x,
        targetX,
        0.1 
      );
    }
  });

  // Final static tilt
  const STATIC_TILT = THREE.MathUtils.degToRad(13);

  return (
    // floatIntensity scales with entranceProgress so it doesn't float while invisible
    <Float 
      floatIntensity={2 * (entranceProgress.current > 0.8 ? 1 : 0)} 
      speed={2} 
      rotationIntensity={1.0}
    >
      <group ref={groupRef} rotation={[0, 0, STATIC_TILT]}>
        {/* --- Housing --- */}
        <RoundedBox args={[5, 2.8, 0.6]} radius={1.4} smoothness={4}>
          <MeshTransmissionMaterial
            backside={true}
            samples={GLASS_SAMPLES}
            resolution={GLASS_RESOLUTION}
            clearcoat={1}
            clearcoatRoughness={0.0}
            {...materialProps}
          />
        </RoundedBox>

        {/* --- Knob --- */}
        <mesh
          ref={knobRef}
          position={[isDarkMode ? 1.2 : -1.2, 0, 0.35]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.9, 0.9, 0.6, 32]} />
          <MeshTransmissionMaterial
            backside={true}
            samples={GLASS_SAMPLES}
            resolution={GLASS_RESOLUTION}
            clearcoat={1}
            clearcoatRoughness={0.0}
            {...materialProps}
            thickness={materialProps.thickness + 0.5}
            color="#ffffff"
          />
        </mesh>
      </group>
    </Float>
  );
};

export default function CrystalToggle() {
  const currentTheme = useSelector((state) => state.theme?.theme) || "system";
  const [systemIsDark, setSystemIsDark] = useState(false);
  
  // We don't need 'ready' state for opacity anymore, the 3D model handles its own entrance
  // But we keep it to prevent flash of content if needed
  const [ready, setReady] = useState(false);

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
    currentTheme === "dark" || (currentTheme === "system" && systemIsDark);

  return (
    <div className="h-[220px] md:h-[280px] lg:h-[350px] xl:h-[520px] w-full flex items-center justify-center z-0 -translate-x-[34%] sm:-translate-x-[29%] -translate-y-[7%]">
      
      {/* Removed the opacity transition class. The Canvas is always visible, but the model scales up from 0 */}
      <div className="w-full h-full">
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 10], fov: 45 }}
          style={{ pointerEvents: "none", width: "100%", height: "100%" }}
          onCreated={() => setReady(true)}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={isDarkMode ? 0.8 : 0.8} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.15}
              penumbra={1}
              intensity={isDarkMode ? 2 : 1.5}
              color="#ffffff"
            />
            <pointLight
              position={[-10, -10, -10]}
              intensity={isDarkMode ? 1.5 : 0.5}
              color="#ffffff"
            />
            <Environment preset="studio" />

            <Center>
              <ToggleSwitchCrystal isDarkMode={isDarkMode} />
            </Center>
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}