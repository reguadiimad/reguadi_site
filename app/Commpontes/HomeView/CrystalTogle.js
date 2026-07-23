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
  
  const entranceProgress = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  const { viewport } = useThree();

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
    entranceProgress.current = THREE.MathUtils.damp(entranceProgress.current, 1, 3, delta);

    const responsiveScale = Math.min(
      1,
      viewport.width / 12,
      viewport.height / 12
    );

    if (groupRef.current) {
      const currentScale = responsiveScale * entranceProgress.current;
      groupRef.current.scale.setScalar(currentScale);

      const entranceRotation = (1 - entranceProgress.current) * Math.PI * 0.5;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.2, 
        0.05
      );

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        (mouse.current.x * 0.4) + entranceRotation,
        0.05
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

  const STATIC_TILT = THREE.MathUtils.degToRad(13);

  return (
    <Float 
      floatIntensity={2 * (entranceProgress.current > 0.8 ? 1 : 0)} 
      speed={2} 
      rotationIntensity={1.0}
    >
      <group ref={groupRef} rotation={[0, 0, STATIC_TILT]}>
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.mediaQuery ? window.mediaQuery : window.matchMedia("(prefers-color-scheme: dark)");
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
