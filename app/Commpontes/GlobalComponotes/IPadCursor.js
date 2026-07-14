// components/IPadCursor.js
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Glass } from '@samasante/liquid-glass';

const IPadCursor = () => {
  // Use a string state instead of fragmented layout classes
  const [cursorState, setCursorState] = useState('idle'); // 'idle' | 'snap' | 'menu' | 'clicking'
  const [showCursor, setShowCursor] = useState(false);
  const [useWebKitFallback, setUseWebKitFallback] = useState(false);

  // High-performance hardware position values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Premium, organic physical spring configurations for movement translation
  const springConfig = { stiffness: 450, damping: 28, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // 1. Hardware Input Detection
  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)');
    const handleDeviceChange = (e) => setShowCursor(e.matches);
    
    setShowCursor(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleDeviceChange);
    return () => mediaQuery.removeEventListener('change', handleDeviceChange);
  }, []);

  // Safari cannot refract arbitrary page content behind an independently
  // positioned lens. Its native backdrop material is the reliable equivalent
  // for a cursor, including Safari on iPad with a trackpad or mouse.
  useEffect(() => {
    const { userAgent } = window.navigator;
    const isAppleWebKit = /AppleWebKit/i.test(userAgent);
    const isDesktopChromium = /Chrome|Chromium|Edg|OPR/i.test(userAgent);

    setUseWebKitFallback(isAppleWebKit && !isDesktopChromium);
  }, []);

  // 2. High-Frequency Tracking & Global State Capturing
  useEffect(() => {
    if (!showCursor) return;

    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e) => {
      const targetElement = e.target;
      if (!targetElement) return;

      // Check for structural menus first (absorbs/hides cursor safely)
      if (targetElement.closest('.clickableMenu')) {
        setCursorState('menu');
        return;
      }

      // Check for interactive click targets
      if (targetElement.closest('button, a, input, select, textarea, .clickable')) {
        setCursorState('snap');
        return;
      }

      // Reset to default movement states safely
      setCursorState('idle');
    };

    const handleMouseDown = () => setCursorState('clicking');
    const handleMouseUp = () => setCursorState('idle');

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [showCursor, mouseX, mouseY]);

  if (!showCursor) return null;

  // 3. Dynamic Optics Config Generator (Tailored for structural transparency changes)
  const getOpticsForState = (state) => {
    const baseOptics = {
      clipToShape: false,
      softEdge: true,
      strength: 1.5,
      depth: 0.45,
      curvature: 2,
      bend: 0.5,
      bendWidth: 0.1,
      dispersion: 2,
      specular: 1,
      sheenAngle: 100,
      glow: 1,
      glowSpread: 1,
      glowFalloff: 1,
      sheen: 1,
      sheenWidth: 1,
      sheenFalloff: 1,
      frost: 0.3,
      brightness: 0,
      thickness: 0,
    };

    switch (state) {
      case 'snap':
        return {
          ...baseOptics,
          frost: 0.15,       // Drop frost down dramatically for ultra-clear readability on buttons
          dispersion: 0.4,   // Soften lens diffraction so text behind remains perfectly readable
          strength: 0.8,
          depth: 0.2
        };
      case 'clicking':
        return {
          ...baseOptics,
          frost: 0.6,
          specular: 1.8,     // Tighten sheen profile to produce tactical deep-pressure effects
          strength: 1.8,
          depth: 0.6
        };
      case 'menu':
        return {
          ...baseOptics,
          frost: 0,
          opacity: 0
        };
      case 'idle':
      default:
        return baseOptics;
    }
  };

  // 4. Spring Physique Structural Map Configurations
  const layoutVariants = {
    idle: {
      width: 35,
      height: 35,
      opacity: 1,
    },
    snap: {
      width: 48,
      height: 48,
      opacity: 1,
    },
    clicking: {
      width: 22,
      height: 22,
      opacity: 1,
    },
    menu: {
      width: 35,
      height: 35,
      opacity: 0,
    }
  };

  return (
    <motion.div
      variants={layoutVariants}
      animate={cursorState}
      transition={{
        type: 'spring',
        duration:0.1
      }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className="pointer-events-none z-[9999999999999] blured fixed will-change-transform mix-blend-normal"
    >
      {useWebKitFallback ? (
        <div
          aria-hidden="true"
          className="w-full h-full"
          style={{
            borderRadius: cursorState === 'snap' ? 12 : '50%',
            background: 'rgba(255, 255, 255, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.34)',
            boxShadow: '0 5px 20px rgba(0, 0, 0, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.36)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            backdropFilter: 'blur(12px) saturate(180%)',
          }}
        />
      ) : (
        <Glass
          radius={55}
          optics={getOpticsForState(cursorState)}
          className="w-full blured h-full transition-all overflow-hidden bg-lightGray/15 dark:bg-darGray/20 duration-300 ease-out"
        >
          <div className="w-full h-full rounded-full bg-darGray/15 dark:bg-lightGray/15" />
        </Glass>
      )}
    </motion.div>
  );
};

export default IPadCursor;
