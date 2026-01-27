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
// 1. Import hooks from core framer-motion only
import { useSpring } from "framer-motion";

// --- Configuration ---
const GLASS_RESOLUTION = 500; 
const GLASS_SAMPLES = 5; 

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

  // 2. Setup Physics Springs (The "Liquid Pop" Engine)
  // We start at 0 scale and upside down (Math.PI)
  const springConfig = { stiffness: 180, damping: 12, mass: 1 };
  const scaleSpring = useSpring(0, springConfig);
  const rotateZSpring = useSpring(Math.PI, springConfig);
  const rotateYSpring = useSpring(Math.PI, springConfig);

  // 3. Trigger Animation on Mount
  useEffect(() => {
    // Slight delay to ensure canvas is ready
    const timer = setTimeout(() => {
      scaleSpring.set(1);
      rotateZSpring.set(THREE.MathUtils.degToRad(13)); // Target tilt
      rotateYSpring.set(0);
    }, 100);
    return () => clearTimeout(timer);
  }, []); // Empty dependency = runs once on mount

  const materialProps = isDarkMode
    ? {
        color: "#f1f1f1",
        transmission: 0.92,
        opacity: 1,
        roughness: 0.1,
        thickness: 5.5,
        ior: 2,
        chromaticAberration: 0.25,
        anisotropy: 1,
        distortion: 0.5,
        distortionScale: 0.3,
        temporalDistortion: 0.5,
        attenuationColor: "#ffffff"

      }
    : {
        color: "#eef2ff",
        transmission: 0.8,
        opacity: 1,
        roughness: 0.1,
        thickness: 2.5,
        ior: 1.2,
        chromaticAberration: 0.3,
        anisotropy: 1,
        distortion: 0.2,
        distortionScale: 0.2,
        temporalDistortion: 0.1,
        attenuationDistance: 0.5,
        attenuationColor: "#ffffff"
      };

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // 4. THE BRIDGE: Read spring values and apply to 3D object
      const currentScale = scaleSpring.get();
      const currentRotZ = rotateZSpring.get();
      const currentRotY = rotateYSpring.get();

      // Apply the Entrance Animation (Scale & Base Rotation)
      // Note: We multiply responsiveScale by our animation scale
      groupRef.current.scale.setScalar(responsiveScale * currentScale);
      
      // Combine Entrance Rotation (Z) with Mouse Parallax (X/Y)
      // We manually add the spring value to the mouse lerp
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.4, 
        0.1
      );
      
      // Combine the "Flip" entrance (Y) with mouse look (Y)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        currentRotY + (mouse.current.x * 0.6), 
        0.1
      );

      // Apply the Z-tilt (Static tilt + entrance spin)
      groupRef.current.rotation.z = currentRotZ;
    }

    // Knob switching logic
    const targetX = isDarkMode ? 1.2 : -1.2;
    if (knobRef.current) {
      knobRef.current.position.x = THREE.MathUtils.lerp(
        knobRef.current.position.x,
        targetX,
        0.7
      );
    }
  });

  return (
    <Float floatIntensity={2} speed={2} rotationIntensity={1.2}>
       {/* Removed motion.group, using standard group with ref */}
       <group ref={groupRef}>
          
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
              thickness={materialProps.thickness + 2} 
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
    <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] xl:h-[520px] w-full flex items-center justify-center z-0 -translate-x-[34%] sm:-translate-x-[29%] -translate-y-[7%]">
      <Canvas 
        dpr={[1, 1.5]} 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        style={{ pointerEvents: 'none', width: '100%', height: '100%' }} 
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
        
        <Center>
          <ToggleSwitchCrystal isDarkMode={isDarkMode} />
        </Center>
      </Canvas>
    </div>
  );
}