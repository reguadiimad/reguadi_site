'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSelector } from 'react-redux';

// ─── Performance Heuristic ────────────────────────────────────────────────────
const getPerformanceTier = () => {
  if (typeof window === 'undefined') return 'high';
  return (navigator.hardwareConcurrency || 4) < 4 ? 'low' : 'high';
};

// ─── Shaders ──────────────────────────────────────────────────────────────────
const vertexShader = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;
  uniform float uInteraction;
  uniform float uCols;
  uniform float uRows;
  uniform float uSpacing;
  uniform vec3  uBaseColor;
  uniform vec3  uLedColor;
  uniform float uVisibility;

  varying vec3  vColor;
  varying vec3  vNormal;
  varying vec3  vViewPos;
  varying float vFogDepth;

  void main() {
    float fid  = float(gl_InstanceID);
    float rows = uRows;
    float xi   = floor(fid / rows);
    float zi   = mod(fid, rows);

    float offsetX = uCols * uSpacing * 0.5;
    float offsetZ  = rows * uSpacing * 0.5;

    float px = xi * uSpacing - offsetX;
    float pz = zi * uSpacing - offsetZ;

    float d = length(vec2(px, pz));
    float y = sin(d * 0.15 - uTime * 0.8) * 1.0
            + sin(px * 0.3  + uTime * 0.5) * 0.5;

    float dist = length(vec2(px - uMouse.x, pz - uMouse.y));
    float glowFactor = 0.0;

    if (uInteraction > 0.01) {
      float falloff = exp(-dist * 0.15);
      float ripple  = sin(dist * 0.8 - uTime * 3.0) * 1.5;
      y += ripple * falloff * uInteraction;

      float maxR = 10.0;
      if (dist < maxR) {
        glowFactor = pow(1.0 - dist / maxR, 2.0) * uInteraction;
      }
    }

    vColor = mix(uBaseColor, uLedColor, glowFactor);

    float baseScale = 0.5 + (max(0.0, y + 3.0) / 6.0) * 0.8;
    float s = baseScale * uVisibility;

    vec3 worldPos = position * s + vec3(px, y, pz);

    vec4 mvPos  = modelViewMatrix * vec4(worldPos, 1.0);
    vViewPos    = -mvPos.xyz;
    vNormal     = normalMatrix * normal;
    vFogDepth   = -mvPos.z;

    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = /* glsl */`
  uniform vec3  uDirLightDir;
  uniform vec3  uDirLightColor;
  uniform float uDirLightIntensity;
  uniform float uAmbientIntensity;
  uniform vec3  uSpecularColor;
  uniform vec3  uFogColor;
  uniform float uFogDensity;

  varying vec3  vColor;
  varying vec3  vNormal;
  varying vec3  vViewPos;
  varying float vFogDepth;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uDirLightDir);
    vec3 V = normalize(vViewPos);

    vec3 color = vColor * uAmbientIntensity;

    float diff = max(dot(N, L), 0.0);
    color += vColor * uDirLightColor * diff * uDirLightIntensity;

    vec3  R    = reflect(-L, N);
    float spec = pow(max(dot(V, R), 0.0), 80.0);
    color += uSpecularColor * uDirLightColor * spec * uDirLightIntensity * 0.5;

    float fog = exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
    color = mix(uFogColor, color, clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ParticleWaves({ showWaves = true }) {
  const mountRef = useRef(null);
  const theme = useSelector((state) => state.theme.theme);

  const showWavesRef = useRef(showWaves);
  const currentVisibilityRef = useRef(showWaves ? 1 : 0);
  const isLoopRunningRef = useRef(false);
  const startLoopRef = useRef(null);

  // Sync state & start loop when toggled back to true
  useEffect(() => {
    showWavesRef.current = showWaves;
    if (showWaves && startLoopRef.current) {
      startLoopRef.current();
    }
  }, [showWaves]);

  useEffect(() => {
    if (!mountRef.current) return;

    const tier = getPerformanceTier();
    const widthFactor = Math.max(1, window.innerWidth / 1200);

    const config = {
      high: { cols: Math.floor(180 * widthFactor), rows: 120, pixelRatio: Math.min(window.devicePixelRatio, 2), geoDetail: 16, spacing: 0.75 },
      low:  { cols: Math.floor(100 * widthFactor), rows: 70,  pixelRatio: 1,                                   geoDetail: 8,  spacing: 0.9  },
    }[tier];

    const isDark = theme === 'dark';
    const bgColor         = isDark ? 0x0a0a0a : 0xfbfcfc;
    const particleColor   = isDark ? 0xdddddd : 0x7c7c80;
    const dirLightHex     = isDark ? 0x6e788c : 0x4a90e2;
    const ambientIntens   = isDark ? 0.6 : 0.7;
    const dirLightIntens  = isDark ? 0.5 : 0.8;

    // ── Scene ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 18, 35);
    camera.lookAt(0, -2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(config.pixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // ── Geometry & Material ──
    const { cols, rows, spacing } = config;
    const count    = cols * rows;
    const geometry = new THREE.SphereGeometry(0.1, config.geoDetail, config.geoDetail);

    const uniforms = {
      uTime:             { value: 0 },
      uMouse:            { value: new THREE.Vector2(0, 0) },
      uInteraction:      { value: 0 },
      uVisibility:       { value: currentVisibilityRef.current },
      uCols:             { value: cols },
      uRows:             { value: rows },
      uSpacing:          { value: spacing },
      uBaseColor:        { value: new THREE.Color(particleColor) },
      uLedColor:         { value: new THREE.Color(0xffffff) },
      uDirLightDir:      { value: new THREE.Vector3(20, 30, 20).normalize() },
      uDirLightColor:    { value: new THREE.Color(dirLightHex) },
      uDirLightIntensity:{ value: dirLightIntens },
      uAmbientIntensity: { value: ambientIntens },
      uSpecularColor:    { value: new THREE.Color(particleColor) },
      uFogColor:         { value: new THREE.Color(bgColor) },
      uFogDensity:       { value: 0.035 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;

    const identity = new THREE.Matrix4();
    for (let i = 0; i < count; i++) mesh.setMatrixAt(i, identity);

    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    mesh.instanceMatrix.needsUpdate = true;

    scene.add(mesh);

    // ── Interaction ──
    const raycaster     = new THREE.Raycaster();
    const pointer       = new THREE.Vector2();
    const plane         = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const targetVec     = new THREE.Vector3();
    const smoothTarget  = new THREE.Vector3();
    let interactionStrength = 0;

    // ── Animation Loop ──
    const clock = new THREE.Clock();
    const targetInterval = 1000 / 60;
    let lastTimestamp = 0;
    let animationId = null;

    const animate = (timestamp) => {
      if (!isLoopRunningRef.current) return;

      animationId = requestAnimationFrame(animate);

      if (timestamp - lastTimestamp < targetInterval) return;
      lastTimestamp = timestamp;

      // 1. Smoothly interpolate visibility down/up
      const targetVis = showWavesRef.current ? 1.0 : 0.0;
      currentVisibilityRef.current += (targetVis - currentVisibilityRef.current) * 0.08;
      uniforms.uVisibility.value = currentVisibilityRef.current;

      // 2. MAXIMUM OPTIMIZATION: When fully faded out, STOP animation frame completely
      if (!showWavesRef.current && currentVisibilityRef.current < 0.001) {
        currentVisibilityRef.current = 0;
        uniforms.uVisibility.value = 0;
        mesh.visible = false;
        
        // Stop Loop Completely
        cancelAnimationFrame(animationId);
        isLoopRunningRef.current = false;
        return;
      }

      mesh.visible = true;

      const time = clock.getElapsedTime();

      if (showWavesRef.current) {
        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.intersectPlane(plane, targetVec);
      }

      const targetStrength = (showWavesRef.current && targetVec.length() < 45) ? 1 : 0;
      interactionStrength += (targetStrength - interactionStrength) * 0.05;
      smoothTarget.lerp(targetVec, 0.1);

      uniforms.uTime.value        = time;
      uniforms.uMouse.value.set(smoothTarget.x, smoothTarget.z);
      uniforms.uInteraction.value = interactionStrength;

      renderer.render(scene, camera);
    };

    const startLoop = () => {
      if (!isLoopRunningRef.current) {
        isLoopRunningRef.current = true;
        clock.start();
        lastTimestamp = performance.now();
        animationId = requestAnimationFrame(animate);
      }
    };

    startLoopRef.current = startLoop;

    // Initial check
    if (showWavesRef.current) {
      startLoop();
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e) => {
      if (!showWavesRef.current) return;
      pointer.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      isLoopRunningRef.current = false;
      startLoopRef.current = null;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationId) cancelAnimationFrame(animationId);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div 
      className={`fixed top-0 left-0 w-full h-screen bg-white dark:bg-black overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-opacity duration-700 ${
        showWaves ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div ref={mountRef} className="absolute inset-0 z-0" />
    </div>
  );
}
