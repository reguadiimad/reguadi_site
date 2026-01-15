'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Info } from 'lucide-react';
import { useSelector } from 'react-redux';

// --- Performance Heuristic ---
// Returns 'low' or 'high' configuration based on CPU cores
const getPerformanceTier = () => {
  // 1. Safety check for SSR
  if (typeof window === 'undefined') return 'high';

  // 2. Check Logical Cores
  // Most modern phones/M1 Macs have 6+ cores. 
  // Older Intel MacBooks (2017) often have 2 or 4 threads.
  const cores = navigator.hardwareConcurrency || 4;
  
  // If cores < 4, it's likely an older dual-core machine. 
  // We treat 4 as the borderline.
  const isLowSpec = cores < 4; 

  return isLowSpec ? 'low' : 'high';
};

export default function ParticleWaves() {
  const mountRef = useRef(null);
  const [showUI, setShowUI] = useState(true);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- 1. Determine Performance Settings ---
    const tier = getPerformanceTier();
    
    const config = {
        high: {
            cols: 180,
            rows: 120,
            pixelRatio: Math.min(window.devicePixelRatio, 2), // Cap at 2x
            geoDetail: 16 // Smooth spheres
        },
        low: {
            cols: 100, // Reduced density (approx 7k particles vs 21k)
            rows: 70, 
            pixelRatio: 1, // ⚠️ CRITICAL: Force 1x resolution on old Macs
            geoDetail: 8   // Low poly spheres (looks same at small scale)
        }
    }[tier];

    // --- Dynamic Color Definitions ---
const isDark = theme === 'dark';

// Changed from 0xffffff to 0xf3f4f6 (Super Light Gray)
const bgColor = isDark ? 0x0a0a0a : 0xfbfcfc; 

// Slightly tweaked the particle color for better contrast against the gray
const particleColor = isDark ? 0xdddddd : 0x7c7c80; 
const dirLightColor = isDark ? 0x6e788c : 0x4a90e2; 

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(bgColor);

// ⚠️ Important: Fog must match the new bgColor or the horizon will look "cut off"
scene.fog = new THREE.FogExp2(bgColor, 0.035);
    
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 18, 35);
    camera.lookAt(0, -2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // ⚠️ Apply the Performance Config
    renderer.setPixelRatio(config.pixelRatio);
    
    mountRef.current.appendChild(renderer.domElement);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.6 : 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(dirLightColor, isDark ? 0.5 : 0.8);
    dirLight.position.set(20, 30, 20);
    scene.add(dirLight);

    // --- Particles (InstancedMesh) ---
    // ⚠️ Use Config variables
    const cols = config.cols;
    const rows = config.rows;
    const count = cols * rows;
    
    // ⚠️ Reduce geometry detail on low power
    const geometry = new THREE.SphereGeometry(0.1, config.geoDetail, config.geoDetail);
    
    const material = new THREE.MeshPhongMaterial({
      color: particleColor,
      shininess: 80,
      specular: particleColor,
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(mesh);

    const dummy = new THREE.Object3D();
    
    // Adjust spacing slightly if density is lower to cover same area?
    // Actually keeping spacing same looks cleaner, just a smaller patch, 
    // BUT let's increase spacing slightly for low-spec to cover more ground
    const spacing = tier === 'low' ? 0.8 : 0.6; 
    
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

          if (interactionStrength > 0.01) {
              const falloff = Math.exp(-distToMouse * 0.15);  
              const ripple = Math.sin(distToMouse * 0.8 - time * 3.0) * 1.5;
              y += ripple * falloff * interactionStrength;
          }

          dummy.position.set(posX, y, posZ);
          
          // Optimization: Don't calculate scale if it's far away? 
          // For now, keep visual polish as it's cheap on CPU
          const s = 0.5 + (Math.max(0, y + 3) / 6) * 0.8;
          dummy.scale.set(s, s, s);

          dummy.updateMatrix();
          mesh.setMatrixAt(i++, dummy.matrix);
        }
      }
      
      mesh.instanceMatrix.needsUpdate = true;
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