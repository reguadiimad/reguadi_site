'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Info } from 'lucide-react';
import { useSelector } from 'react-redux';

// ─── Performance Heuristic ────────────────────────────────────────────────────
const getPerformanceTier = () => {
  if (typeof window === 'undefined') return 'high';
  return (navigator.hardwareConcurrency || 4) < 4 ? 'low' : 'high';
};

// ─── Shaders ──────────────────────────────────────────────────────────────────
// ALL wave + color + scale math lives here — zero CPU per frame
const vertexShader = /* glsl */`
  uniform float uTime;
  uniform vec2  uMouse;       // x, z on the wave plane
  uniform float uInteraction;
  uniform float uCols;
  uniform float uRows;
  uniform float uSpacing;
  uniform vec3  uBaseColor;
  uniform vec3  uLedColor;

  varying vec3  vColor;
  varying vec3  vNormal;
  varying vec3  vViewPos;
  varying float vFogDepth;

  void main() {
    // Reconstruct grid position from gl_InstanceID (no instanceMatrix needed)
    float fid  = float(gl_InstanceID);
    float rows = uRows;
    float xi   = floor(fid / rows);
    float zi   = mod(fid, rows);

    float offsetX = uCols * uSpacing * 0.5;
    float offsetZ  = rows * uSpacing * 0.5;

    float px = xi * uSpacing - offsetX;
    float pz = zi * uSpacing - offsetZ;

    // Base wave (identical to original CPU math)
    float d = length(vec2(px, pz));
    float y = sin(d * 0.15 - uTime * 0.8) * 1.0
            + sin(px * 0.3  + uTime * 0.5) * 0.5;

    // Mouse ripple + glow
    float dist     = length(vec2(px - uMouse.x, pz - uMouse.y));
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

    // Per-particle scale (same formula as original)
    float s = 0.5 + (max(0.0, y + 3.0) / 6.0) * 0.8;

    // Final world position: scale sphere verts, then translate to grid slot
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

    // Ambient
    vec3 color = vColor * uAmbientIntensity;

    // Diffuse
    float diff = max(dot(N, L), 0.0);
    color += vColor * uDirLightColor * diff * uDirLightIntensity;

    // Specular (Phong)
    vec3  R    = reflect(-L, N);
    float spec = pow(max(dot(V, R), 0.0), 80.0);
    color += uSpecularColor * uDirLightColor * spec * uDirLightIntensity * 0.5;

    // Exponential² fog — matches THREE.FogExp2 formula exactly
    float fog   = exp(-uFogDensity * uFogDensity * vFogDepth * vFogDepth);
    color = mix(uFogColor, color, clamp(fog, 0.0, 1.0));

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ParticleWaves() {
  const mountRef = useRef(null);
  const [showUI, setShowUI] = useState(true);
  const theme = useSelector((state) => state.theme.theme);

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
    const scene    = new THREE.Scene();
    scene.background = new THREE.Color(bgColor);
    // Fog visual handled in shader; no THREE.Fog needed

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
      uniforms,
      vertexShader,
      fragmentShader,
    });

    // ── InstancedMesh — matrices set ONCE to identity, never touched again ──
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.frustumCulled = false;    // Our grid extends far; skip Three.js culling
    mesh.matrixAutoUpdate = false; // We never move the mesh object itself

    const identity = new THREE.Matrix4();
    for (let i = 0; i < count; i++) mesh.setMatrixAt(i, identity);

    // Mark STATIC — driver can cache this buffer on the GPU
    mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);
    mesh.instanceMatrix.needsUpdate = true;

    scene.add(mesh);

    // ── Interaction ──
    const raycaster   = new THREE.Raycaster();
    const pointer     = new THREE.Vector2();
    const plane       = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const targetVec   = new THREE.Vector3();
    const smoothTarget = new THREE.Vector3();
    let interactionStrength = 0;

    // ── Animation loop — FPS-capped at 60 ──
    const clock = new THREE.Clock();
    const targetInterval = 1000 / 60;
    let lastTimestamp = 0;
    let animationId;

    const animate = (timestamp) => {
      animationId = requestAnimationFrame(animate);

      // Skip frame if we're ahead of 60fps — saves GPU on 120/144hz screens
      if (timestamp - lastTimestamp < targetInterval) return;
      lastTimestamp = timestamp;

      const time = clock.getElapsedTime();

      raycaster.setFromCamera(pointer, camera);
      raycaster.ray.intersectPlane(plane, targetVec);

      const targetStrength = targetVec.length() < 45 ? 1 : 0;
      interactionStrength += (targetStrength - interactionStrength) * 0.05;
      smoothTarget.lerp(targetVec, 0.1);

      // ✅ Only 3 uniform updates — zero per-instance CPU work
      uniforms.uTime.value        = time;
      uniforms.uMouse.value.set(smoothTarget.x, smoothTarget.z);
      uniforms.uInteraction.value = interactionStrength;

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleMouseMove = (e) => {
      pointer.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div className="fixed top-0 left-0 -z-10 w-full h-screen bg-white dark:bg-black overflow-hidden font-sans text-slate-900 dark:text-slate-100">
      <div ref={mountRef} className="absolute inset-0 z-0" />
      <div className="absolute bottom-8 right-8 z-10 flex gap-4">
        <button
          onClick={() => setShowUI(!showUI)}
          className="p-3 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-black hover:scale-105 transition-all active:scale-95"
        >
          <Info className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </button>
      </div>
    </div>
  );
}