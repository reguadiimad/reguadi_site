'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import Monoco from '@monokai/monoco-react';
import { Glass } from '@samasante/liquid-glass';

const PLAYER_OPTICS = {
  clipToShape: true,
  softEdge: true,
  strength: 0.6,
  depth: 0.2,
  curvature: 0.5,
  bend: 0.1,
  bendWidth: 0.1,
  dispersion: 0.25,
  specular: 0,
  sheenAngle: 100,
  glow: 1.6,
  glowSpread: 1,
  glowFalloff: 1,
  sheen: 1,
  sheenWidth: 0,
  sheenFalloff: 1,
  frost: 1.3,
  brightness: 0,
  thickness: 0,
};

const PLAYER_OPTICS2 = {
  clipToShape: false,
  softEdge: true,
  strength: 0.7,
  depth: 0.15,
  curvature: 1,
  bend: 0.3,
  bendWidth: 0.1,
  dispersion: 1,
  specular: 0,
  sheenAngle: 100,
  glow: 1,
  glowSpread: 1,
  glowFalloff: 1,
  sheen: 1,
  sheenWidth: 0,
  sheenFalloff: 1,
  frost: 0.9,
  brightness: 0,
  thickness: 0,
};

export function TriggerCapsulle({ children, handleNext, handlePrev, innerRef, isCapsuleVisible, isCapsuleDocked }) {
  const [widths, setWidths] = useState({ left: '25%', right: '8%' });
  

  const leftTrackRef = useRef(null);
  const rightTrackRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {          
        setWidths({ left: '50%', right: '16%' });
      } else if (w < 768) {   
        setWidths({ left: '60%', right: '18%' });
      } else if (w < 1024) {  
        setWidths({ left: '48%', right: '14%' });
      } else if (w < 1280) {  
        setWidths({ left: '38%', right: '11%' });
      } else if (w < 1536) {  
        setWidths({ left: '32%', right: '9%' });
      } else {                
        setWidths({ left: '25%', right: '8%' });
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Real-time pointer physics interpolation layer with custom jelly intensity scaling
  const handleMouseMove = (e, element, intensity = 1.0) => {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    element.style.setProperty('--mouse-x', `${x}px`);
    element.style.setProperty('--mouse-y', `${y}px`);

    // Jelly magnet micro-interaction calculations scaled by structural intensity
    const innerJelly = element.querySelector('.js-jelly-inner');
    if (innerJelly) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = x - centerX;
      const deltaY = y - centerY;

      // Multipliers are throttled dynamically per component instance
      const pullX = deltaX * 0.05 * intensity; 
      const pullY = deltaY * 0.08 * intensity;
      const stretchX = 1 + (Math.abs(deltaX) * 0.00015 * intensity);
      const stretchY = 1 - (Math.abs(deltaY) * 0.00015 * intensity);
      const skewX = deltaX * 0.012 * intensity;

      gsap.to(innerJelly, {
        x: pullX,
        y: pullY,
        scaleX: stretchX,
        scaleY: stretchY,
        skewX: skewX,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto"
      });
    }
  };

  // Elastic snap-back reset when mouse leaves a capsule
  const handleMouseLeave = (element) => {
    if (!element) return;
    const innerJelly = element.querySelector('.js-jelly-inner');
    if (innerJelly) {
      gsap.to(innerJelly, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        duration: 0.65,
        ease: "elastic.out(1.2, 0.44)",
        overwrite: "auto"
      });
    }
  };

  const leftPhysics = {
    hidden: { 
      y: 240,
      x: 28,
      width: '64px',        
      scaleX: 0.52,
      scaleY: 1.22,
      opacity: 0 
    },
    visible: (custom) => ({ 
      y: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      width: custom.left, 
      x: 0,                 
      transition: {
        y: { type: 'spring', stiffness: 175, damping: 17, mass: 1.05 },
        scaleX: { type: 'spring', stiffness: 220, damping: 15, mass: 0.9 },
        scaleY: { type: 'spring', stiffness: 220, damping: 15, mass: 0.9 },
        opacity: { duration: 0.22, ease: 'easeOut' },
        width: { type: 'spring', stiffness: 150, damping: 15, mass: 1.1, delay: 0.2 },
        x: { type: 'spring', stiffness: 150, damping: 15, mass: 1.1, delay: 0.2 }
      }
    }),
    hiddenState: {
      width: '64px',
      x: 28,
      y: 240,
      scaleX: 0.58,
      scaleY: 1.15,
      opacity: 0,
      transition: { 
        width: { type: 'spring', stiffness: 155, damping: 17, mass: 0.9 },
        x: { type: 'spring', stiffness: 155, damping: 17, mass: 0.9 },
        y: { type: 'spring', stiffness: 170, damping: 18, mass: 1.05, delay: 0.06 },
        opacity: { delay: 0.18, duration: 0.18, ease: 'easeIn' }
      }
    }
  };

  const rightPhysics = {
    hidden: { 
      y: 240, 
      x: -120,
      width: '64px', 
      scaleX: 0.52,
      scaleY: 1.22,
      opacity: 0 
    },
    visible: (custom) => ({ 
      y: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      width: custom.right, 
      x: 0, 
      transition: {
        y: { type: 'spring', stiffness: 170, damping: 17, mass: 1.05, delay: 0.12 },
        scaleX: { type: 'spring', stiffness: 215, damping: 14, mass: 0.9, delay: 0.2 },
        scaleY: { type: 'spring', stiffness: 215, damping: 14, mass: 0.9, delay: 0.2 },
        opacity: { duration: 0.22, ease: 'easeOut', delay: 0, exit: { duration: 0 } },
        width: { type: 'spring', stiffness: 155, damping: 14, mass: 1.05, delay: 0.4 },
        x: { type: 'spring', stiffness: 155, damping: 14, mass: 1.05, delay: 0.4 }
      }
    }),
    hiddenState: {
      width: '64px',
      x: -28,
      y: 240,
      scaleX: 0.58,
      scaleY: 1.15,
      opacity: 0,
      transition: { 
        width: { type: 'spring', stiffness: 155, damping: 17, mass: 0.9 },
        x: { type: 'spring', stiffness: 155, damping: 17, mass: 0.9 },
        y: { type: 'spring', stiffness: 170, damping: 18, mass: 1.05, delay: 0.06 },
        opacity: { delay: 0.18, duration: 0.18, ease: 'easeIn' }
      }
    }
  };

  const contentReveal = {
    hidden: { opacity: 0, scale: 0.78, y: 16 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        opacity: { duration: 0.26, ease: 'easeOut', delay: 0.64 },
        scale: { type: 'spring', stiffness: 190, damping: 14, mass: 0.72, delay: 0.7 },
        y: { type: 'spring', stiffness: 160, damping: 17, mass: 0.8, delay: 0.7 }
      }
    }
  };


  return (
    <div ref={innerRef} className="w-full py-3 left-0 z-[9999999999999] gap-4 flex items-center justify-center pointer-events-none" style={{ position: isCapsuleDocked ? "absolute" : "fixed", bottom: isCapsuleDocked ? "auto" : 0, top: isCapsuleDocked ? 0 : "auto",left: 0,}}>
      <AnimatePresence>
        {isCapsuleVisible && (
          <>
            {/* LEFT CAPSULE: Progress Track (Highly subtle dynamic response) */}
            <motion.div 
              ref={leftTrackRef}
              custom={widths}
              variants={leftPhysics}
              initial="hidden"
              animate="visible"
              exit="hiddenState"
              onMouseMove={(e) => handleMouseMove(e, leftTrackRef.current, 0.25)}
              onMouseLeave={() => handleMouseLeave(leftTrackRef.current)}
              whileHover={{ boxShadow: "0 12px 40px -12px rgba(255, 255, 255, 0.12)" }}
              className="h-16 lg:h-20 overflow-hidden relative group pointer-events-auto will-change-transform select-none rounded-[33px] border border-white/[0.03] transition-shadow duration-500"
            >
              <div className="js-jelly-inner w-full h-full will-change-transform origin-center">
                <Glass radius={20} optics={{...PLAYER_OPTICS}} className="w-full h-full ">
                  <Monoco 
                    borderRadius={33} 
                    smoothing={1} 
                    clip={true} 
                    className="w-full  h-full flex items-center bg-darGray/10 justify-center pointer-events-auto relative overflow-hidden"
                  >
                    {/* Dynamic Cursor Spotlight Ray */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen z-10"
                      style={{
                        background: `radial-gradient(230px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 255, 255, 0.05), transparent 100%)`
                      }}
                    />
                    
                    <motion.div variants={contentReveal} className="w-full h-full flex items-center justify-center relative z-20">
                      {children}
                    </motion.div>
                  </Monoco>
                </Glass>
              </div>
            </motion.div>

            {/* RIGHT CAPSULE: Action Triggers (Original bouncy body-jelly physics) */}
            <motion.div 
              ref={rightTrackRef}
              custom={widths}
              variants={rightPhysics}
              initial="hidden"
              animate="visible"
              exit="hiddenState"
              onMouseMove={(e) => handleMouseMove(e, rightTrackRef.current, 1.0)}
              onMouseLeave={() => handleMouseLeave(rightTrackRef.current)}
              whileHover={{ boxShadow: "0 12px 40px -12px rgba(255, 255, 255, 0.12)" }}
              className="h-16 lg:h-20  overflow-hidden relative group pointer-events-auto will-change-transform select-none rounded-[33px] border border-white/[0.03] transition-shadow duration-500"
            >
              <div className="js-jelly-inner w-full h-full will-change-transform origin-center">
                <Glass radius={33} optics={{...PLAYER_OPTICS2}} className="w-full h-full ">
                  <Monoco 
                    borderRadius={23} 
                    smoothing={1} 
                    border={[2, "#101010"]} 
                    clip 
                    className="w-full dark:bg-darGray/10 h-full flex items-center justify-center pointer-events-auto relative overflow-hidden"
                  >
                    {/* Dynamic Cursor Spotlight Ray */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-screen z-10"
                      style={{
                        background: `radial-gradient(140px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(255, 255, 255, 0.08), transparent 100%)`
                      }}
                    />
                    
                    <motion.div variants={contentReveal} className="flex items-center justify-center gap-6 relative z-20 px-4">
                      <motion.button 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          transition: { type: "spring", delay: 0.7 } 
                        }} 
                        exit={{ 
                          opacity: 0, 
                          y: 15, 
                          transition: { duration: 0.15 } 
                        }}
                        onClick={handlePrev} 
                        className="text-base sm:text-lg lg:text-xl cursor-pointer text-neutral-400 hover:text-white transition-colors duration-300 select-none focus:outline-none relative z-30"
                      >
                        ←
                      </motion.button>

                      <motion.button 
                        initial={{ opacity: 0, y: 15 }} 
                        animate={{ 
                          opacity: 1, 
                          y: 0, 
                          transition: { type: "spring", delay: 0.75 } 
                        }} 
                        exit={{ 
                          opacity: 0, 
                          y: 15, 
                          transition: { duration: 0.15 } 
                        }}
                        onClick={handleNext} 
                        className="text-base sm:text-lg lg:text-xl cursor-pointer text-neutral-400 hover:text-white transition-colors duration-300 select-none focus:outline-none relative z-30"
                      >
                        →
                      </motion.button>
                    </motion.div>
                  </Monoco>
                </Glass>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}