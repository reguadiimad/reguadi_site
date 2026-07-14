"use client";

import React from 'react';
import { Glass } from "@samasante/liquid-glass";

/**
 * LiquidGlassComponent
 * @param {Object} props
 * @param {React.ReactNode} props.refractContent - The page content node to refract underneath the glass (essential for Safari cross-browser support).
 * @param {React.ReactNode} props.children - UI elements inside the container that will render crisp on top.
 */
export default function LiquidGlassComponent({ refractContent, children }) {
  
  // Custom glass optics configuration maximizing all available engine effects
  const fullGlassOptics = {
    strength: 0.45,       // Max refraction shifting intensity
    scaleX: 1.0,         // X-axis alignment override
    scaleY: 1.0,         // Y-axis alignment override
    depth: 0.85,         // Depth radius where edge bending initializes
    curvature: 0.6,      // Convex "liquid" magnification dome in the center
    dispersion: 0.65,    // Chromatic aberration (RGB light splitting at the contours)
    bend: 0.85,          // Liquid rim lip refraction wrap
    bendWidth: 0.16,     // Thickness of the border bend wrapper
    sheen: 1.0,          // Specular edge highlight velocity
    sheenWidth: 0.18,    // Edge glare distribution thickness
    sheenFalloff: 0.45,  // Smooth falloff of light pools
    sheenAngle: 45,      // Lighting angle vector (Apple-style 45-degree pooling)
    specular: 0.95,      // Overlap surface gloss multiplier
    glow: 0.75,          // Intrinsic inner ambient light glow
    glowSpread: 0.3,     // Ambient scattering rate inside the squircle
    glowFalloff: 0.5,    // Softness curve of the internal glow
    frost: 14,           // Frosted blur backdrop depth
    brightness: 1.04,    // Light exposure pass to keep readability crisp
    splay: 1.0,          // Edge-corner rounding correction multiplier
    sheenDark: 0.12      // Accent shadow tint underneath light vectors
  };

  return (
    <div 
      className="fixed bottom-0 left-1/2 -translate-x-1/2 my-5 z-[99999]"
      style={{
        width: "30%",
        height: "100px",
      }}
    >
      <Glass
        // Geometry constraints. Omit height/width properties inside 
        // the wrapper so it auto-conforms flawlessly to the CSS layout parent box.
        radius={24}                 // Geometric signed-distance field curve clipping radius
        refract={refractContent}    // Target DOM component layer to bend (Safari live support)
        live={true}                 // Force real-time re-rasterization loop for active DOM content mutations
        behind="transparent"        // Keep edges clean and seamless over backgrounds
        optics={fullGlassOptics}    // Injects the comprehensive physical parameters
        style={{
         
          borderRadius: "24px",
          width: "100%",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255, 255, 255, 0.08)"
        }}
      >
        {/* Everything inside children remains sharp and un-refracted on top of the lens */}
        <div className="w-full h-full flex items-center justify-center text-white font-sans">
          {children}
        </div>
      </Glass>
    </div>
  );
}