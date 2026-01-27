'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Info } from 'lucide-react';
import { useSelector } from 'react-redux';

// --- Performance Heuristic ---
const getPerformanceTier = () => {
  if (typeof window === 'undefined') return 'high';
  const cores = navigator.hardwareConcurrency || 4;
  const isLowSpec = cores < 4; 
  return isLowSpec ? 'low' : 'high';
};

export default function ParticleWaves() {
  const mountRef = useRef(null);
  const [showUI, setShowUI] = useState(true);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    if (!mountRef.current) return;

    const tier = getPerformanceTier();
    
    // --- 1. Dynamic Grid Calculation ---
    const widthFactor = Math.max(1, window.innerWidth / 1200);

    const config = {
        high: {
            cols: Math.floor(180 * widthFactor), 
            rows: 120,
            pixelRatio: Math.min(window.devicePixelRatio, 2),
            geoDetail: 16,
            spacing: 0.75 
        },
        low: {
            cols: Math.floor(100 * widthFactor), 
            rows: 70, 
            pixelRatio: 1, 
            geoDetail: 8,
            spacing: 0.9 
        }
    }[tier];

    // --- Dynamic Color Definitions ---
    const isDark = theme === 'dark';
    const bgColor = isDark ? 0x0a0a0a : 0xfbfcfc; 
    const particleColor = isDark ? 0xdddddd : 0x7c7c80; 
    const dirLightColor = isDark ? 0x6e788c : 0x4a90e2; 

    // --- UPDATED: LED Glow Colors ---
    const baseColorThree = new THREE.Color(particleColor);
    // Changed to pure white (0xffffff) for both themes
    const ledColorThree = new THREE.Color(0xffffff); 
    const tempColor = new THREE.Color(); 

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    scene.fog = new THREE.FogExp2(bgColor, 0.035);
    
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      200 
    );
    camera.position.set(0, 18, 35);
    camera.lookAt(0, -2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(config.pixelRatio);
    
    mountRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.6 : 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(dirLightColor, isDark ? 0.5 : 0.8);
    dirLight.position.set(20, 30, 20);
    scene.add(dirLight);

    // --- Particles (InstancedMesh) ---
    const cols = config.cols;
    const rows = config.rows;
    const count = cols * rows;
    
    const geometry = new THREE.SphereGeometry(0.1, config.geoDetail, config.geoDetail);
    
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff, // Must stay white so instance colors show true-to-color
      shininess: 80,
      specular: particleColor,
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);

    const dummy = new THREE.Object3D();
    
    const spacing = config.spacing; 
    
    const offsetX = (cols * spacing) / 2;
    const offsetZ = (rows * spacing) / 2;

    // --- Interaction State ---
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const targetVector = new THREE.Vector3();
    
    const smoothTarget = new THREE.Vector3();
    let interactionStrength = 0;

    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      const time = clock.getElapsedTime();
      
      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, targetVector);
      
      const distToCenter = targetVector.length();
      const maxDist = 45;
      const targetStrength = (distToCenter < maxDist) ? 1 : 0;
      
      interactionStrength += (targetStrength - interactionStrength) * 0.05;
      smoothTarget.lerp(targetVector, 0.1);

      let i = 0;
      
      for (let x = 0; x < cols; x++) {
        for (let z = 0; z < rows; z++) {
          
          const posX = x * spacing - offsetX;
          const posZ = z * spacing - offsetZ;

          const distGlobal = Math.sqrt(posX * posX + posZ * posZ);
          let y = Math.sin(distGlobal * 0.15 - time * 0.8) * 1.0 +
                  Math.sin(posX * 0.3 + time * 0.5) * 0.5;

          const dx = posX - smoothTarget.x;
          const dz = posZ - smoothTarget.z;
          const distToMouse = Math.sqrt(dx*dx + dz*dz);

          // --- LED Glow Logic ---
          let glowFactor = 0;
          if (interactionStrength > 0.01) {
              const falloff = Math.exp(-distToMouse * 0.15);  
              const ripple = Math.sin(distToMouse * 0.8 - time * 3.0) * 1.5;
              y += ripple * falloff * interactionStrength;

              // The maxGlowRadius determines how wide the white light spreads
              const maxGlowRadius = 10; 
              if (distToMouse < maxGlowRadius) {
                glowFactor = Math.pow(1 - (distToMouse / maxGlowRadius), 2) * interactionStrength;
              }
          }

          tempColor.lerpColors(baseColorThree, ledColorThree, glowFactor);
          mesh.setColorAt(i, tempColor);
          // ---------------------------

          dummy.position.set(posX, y, posZ);
          
          const s = 0.5 + (Math.max(0, y + 3) / 6) * 0.8;
          dummy.scale.set(s, s, s);

          dummy.updateMatrix();
          mesh.setMatrixAt(i++, dummy.matrix);
        }
      }
      
      mesh.instanceMatrix.needsUpdate = true;
      mesh.instanceColor.needsUpdate = true; 
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
    };
  }, [theme]); 

  return (
    <div className="fixed top-0 left-0 -z-10 w-full h-screen bg-white dark:bg-black overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      <div ref={mountRef} className="absolute inset-0 z-0" />

      <div className="absolute bottom-8 right-8 z-10 flex gap-4">
        <button 
          onClick={() => setShowUI(!showUI)}
          className="p-3 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-black hover:scale-105 transition-all active:scale-95 group"
        >
          <Info className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>
      </div>
    </div>
  );
}