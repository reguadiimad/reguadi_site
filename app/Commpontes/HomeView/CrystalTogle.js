"use client";

import React, { useRef, useEffect, useState } from "react";
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
// Lower these values if it is still slow.
// Resolution: 256 is usually enough for small objects. 512 is crisp. 1024+ is overkill.
// Samples: 4-6 is good for frosted glass. 16 is for high-end offline renders.
const GLASS_RESOLUTION = 512; 
const GLASS_SAMPLES = 6; 

const ToggleSwitchCrystal = ({ isDarkMode }) => {
  const groupRef = useRef();
  const knobRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  
  const { viewport } = useThree();

  const responsiveScale = Math.min(
    1, 
    viewport.width / 12, 
    viewport.height / 12
  );

  const materialProps = isDarkMode
    ? {
        color: "#ffffff00",
        transmission: 1,
        opacity: 1,
        roughness: 0.1,
        thickness: 3.5,
        ior: 1.5,
        chromaticAberration: 0.1,
        anisotropy: 1, // Reduced from 5
        distortion: 0.5,
        distortionScale: 0.3,
        temporalDistortion: 0.5,
      }
    : {
        color: "#eef2ff",
        transmission: 0.95,
        opacity: 1,
        roughness: 0.1,
        thickness: 2.5,
        ior: 1.2,
        chromaticAberration: 0.15,
        anisotropy: 1, // Reduced from 2
        distortion: 0.2,
        distortionScale: 0.2,
        temporalDistortion: 0.1,
        attenuationDistance: 0.5,
        attenuationColor: "#ffffff"
      };

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Small optimization: Calculate this rarely or use a throttling library if mouse movement is very heavy
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.8,
        0.1
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.8,
        0.1
      );
    }

    const targetX = isDarkMode ? 1.2 : -1.2;
    if (knobRef.current) {
      knobRef.current.position.x = THREE.MathUtils.lerp(
        knobRef.current.position.x,
        targetX,
        0.1
      );
    }
  });

  return (
    <Float floatIntensity={2} speed={5} rotationIntensity={1.5}>
      <group ref={groupRef} scale={responsiveScale}>
        
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
        <mesh ref={knobRef} position={[-1.2, 0, 0.35]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.6, 32]} />
          <MeshTransmissionMaterial
            backside={true}
            samples={GLASS_SAMPLES}
            resolution={GLASS_RESOLUTION}
            clearcoat={1}
            clearcoatRoughness={0.0}
            {...materialProps}
            thickness={materialProps.thickness + 1} 
            color={isDarkMode ? "#aaaaff" : "#ffffff"} 
          />
        </mesh>

      </group>
    </Float>
  );
};

export default function CrystalToggle() {
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
    <div className=" h-[550px] w-full flex items-center  justify-center z-0   ">
      <Canvas 
        // OPTIMIZATION: Limit pixel ratio. 
        // [1, 1.5] prevents 4k rendering on Retina screens which kills transmission shaders.
        dpr={[1, 1.5]} 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }} 
        // Optional: Only render when changes happen if you don't need constant animation (Float breaks this though)
        // frameloop="demand" 
      >
        <ambientLight intensity={isDarkMode ? 0.5 : 0.8} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={isDarkMode ? 1 : 1.5} 
        />
        <pointLight 
          position={[-10, -10, -10]} 
          intensity={isDarkMode ? 1 : 0.5} 
        />
        <Environment preset={isDarkMode ? "city" : "studio"} />
        
        <Center key={isDarkMode ? 'dark' : 'light'}>
          <ToggleSwitchCrystal isDarkMode={isDarkMode} />
        </Center>
      </Canvas>
    </div>
  );
}