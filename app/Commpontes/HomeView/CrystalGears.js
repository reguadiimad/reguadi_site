"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Environment,
  Center,
  Float,
  PerformanceMonitor,
} from "@react-three/drei";
import * as THREE from "three";
// 1. Import physics hooks
import { useSpring } from "framer-motion";

// --- Configuration ---
const BASE_RESOLUTION = 512;
const BASE_SAMPLES = 6;
const LOW_RESOLUTION = 512;
const LOW_SAMPLES = 6;

const createGearShape = (radius, teeth, toothDepth) => {
  const shape = new THREE.Shape();
  const step = (Math.PI * 2) / (teeth * 2);

  shape.moveTo(radius, 0);

  for (let i = 0; i < teeth; i++) {
    const angle = i * 2 * step;
    shape.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    shape.lineTo(Math.cos(angle + step) * (radius + toothDepth), Math.sin(angle + step) * (radius + toothDepth));
    shape.lineTo(Math.cos(angle + step * 2) * (radius + toothDepth), Math.sin(angle + step * 2) * (radius + toothDepth));
    shape.lineTo(Math.cos(angle + step * 3) * radius, Math.sin(angle + step * 3) * radius);
  }

  const holePath = new THREE.Path();
  holePath.absarc(0, 0, radius * 0.45, 0, Math.PI * 2, false);
  shape.holes.push(holePath);

  return shape;
};

const GearObj = ({
  isDarkMode,
  position,
  rotationOffset = 0,
  radius = 1,
  teeth = 12,
  speed = 1,
  invertRotation = false,
  quality 
}) => {
  const meshRef = useRef();

  const gearGeometry = useMemo(() => {
    const shape = createGearShape(radius, teeth, 0.3);
    const extrudeSettings = {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 4, 
      curveSegments: 6, 
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [radius, teeth]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.rotation.z = rotationOffset;
    }
  }, [rotationOffset]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      if (invertRotation) {
        meshRef.current.rotation.z += delta * speed;
      } else {
        meshRef.current.rotation.z -= delta * speed;
      }
    }
  });

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
        attenuationColor: "#ffffff",
      };

  return (
    <mesh ref={meshRef} position={position} geometry={gearGeometry}>
      <MeshTransmissionMaterial
        backside={true}
        samples={quality === "low" ? LOW_SAMPLES : BASE_SAMPLES}
        resolution={quality === "low" ? LOW_RESOLUTION : BASE_RESOLUTION}
        clearcoat={1}
        clearcoatRoughness={0.0}
        {...materialProps}
      />
    </mesh>
  );
};

const BackendGears = ({ isDarkMode, quality }) => {
  const groupRef = useRef();
  const mouse = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const responsiveScale = Math.min(
    1,
    viewport.width / 12,
    viewport.height / 12
  );

  // 2. Setup Physics Springs (Pop Engine)
  const springConfig = { stiffness: 180, damping: 12, mass: 1 };
  const scaleSpring = useSpring(0, springConfig);
  const rotateZSpring = useSpring(Math.PI, springConfig); // Start upside down
  const rotateYSpring = useSpring(Math.PI, springConfig); // Start flipped

  // 3. Trigger Animation with 0.25s Delay
  useEffect(() => {
    const timer = setTimeout(() => {
      scaleSpring.set(1);
      rotateZSpring.set(THREE.MathUtils.degToRad(-25)); // Target tilt
      rotateYSpring.set(0);
    }, 250); // <--- 0.25s Delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      mouse.current.x = (event.clientX / w) * 2 - 1;
      mouse.current.y = -(event.clientY / h) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      // 4. THE BRIDGE: Read spring values
      const currentScale = scaleSpring.get();
      const currentRotZ = rotateZSpring.get();
      const currentRotY = rotateYSpring.get();

      // Apply Scale (Responsive * Animation)
      groupRef.current.scale.setScalar(responsiveScale * currentScale);

      // Apply Mouse Parallax X (Standard)
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.4,
        0.1
      );

      // Apply Y Rotation (Mouse Parallax + Entrance Flip)
      // We add the spring value (currentRotY) to the mouse target
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        currentRotY + (mouse.current.x * -0.6),
        0.1
      );

      // Apply Z Rotation (Entrance Spin + Static Tilt)
      // The spring handles the transition from Math.PI to -25deg
      groupRef.current.rotation.z = currentRotZ;
    }
  });

  const TOOTH_DEPTH = 0.3;
  const R1 = 1.3;
  const TEETH1 = 12;
  const SPEED1 = 0.6;
  const R2 = 0.8;
  const TEETH2 = 8;
  const SPEED2 = SPEED1 * (TEETH1 / TEETH2);
  
  const GAP_CORRECTION = 0.15;
  const DISTANCE = R1 + R2 + TOOTH_DEPTH + GAP_CORRECTION + 0.31;
  const X_OFFSET = DISTANCE / 2;

  return (
    <Float floatIntensity={1.5} speed={2} rotationIntensity={0.5}>
      {/* Removed the wrapper group, Z-rotation is now handled by the spring */}
      <group ref={groupRef}>
        <GearObj
          isDarkMode={isDarkMode}
          position={[-X_OFFSET, 0, 0]}
          radius={R1}
          teeth={TEETH1}
          speed={SPEED1}
          invertRotation={false}
          quality={quality}
        />

        <GearObj
          isDarkMode={isDarkMode}
          position={[X_OFFSET, 0, 0]}
          rotationOffset={Math.PI / TEETH2}
          radius={R2}
          teeth={TEETH2}
          speed={SPEED2}
          invertRotation={true}
          quality={quality}
        />
      </group>
    </Float>
  );
};

export default function BackendGearDisplay() {
  const currentTheme = useSelector((state) => state.theme.theme);
  const [systemIsDark, setSystemIsDark] = useState(false);
  const [dpr, setDpr] = useState(1.5);
  const [quality, setQuality] = useState("high");

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
    <div className="h-[320px] sm:h-[350px] md:h-[390px] lg:h-[440px] xl:h-[580px] w-full flex items-center justify-center z-0 translate-x-[29%] translate-y-[10%] lg:translate-y-[14%] ">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{ pointerEvents: "none", width: "100%", height: "100%" }}
        frameloop="always" 
      >
        <PerformanceMonitor 
          onDecline={() => { setDpr(1); setQuality("low"); }} 
          onIncline={() => { setDpr(1.5); setQuality("high"); }} 
        />

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
          <BackendGears isDarkMode={isDarkMode} quality={quality} />
        </Center>
      </Canvas>
    </div>
  );
}