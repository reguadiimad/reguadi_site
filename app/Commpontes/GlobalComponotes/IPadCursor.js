// components/IPadCursor.js
import React, { useEffect, useRef, useState } from 'react';

const IPadCursor = () => {
  const cursorRef = useRef(null);
  // Default to false so it doesn't flash on server/initial render
  const [showCursor, setShowCursor] = useState(false);

  // 1. Check for hardware mouse/fine pointer
  useEffect(() => {
    // This query checks if the primary input mechanism is a "fine" pointer (mouse, trackpad)
    // It returns false for touch-only devices (phones, tablets without mouse)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    
    const handleDeviceChange = (e) => {
      setShowCursor(e.matches);
    };

    // Set initial value
    setShowCursor(mediaQuery.matches);

    // Listen for changes (e.g., user connects a mouse to an iPad)
    mediaQuery.addEventListener('change', handleDeviceChange);

    return () => {
      mediaQuery.removeEventListener('change', handleDeviceChange);
    };
  }, []);

  // 2. Main Cursor Logic
  useEffect(() => {
    // If we shouldn't show the cursor, don't attach listeners
    if (!showCursor) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    // --- Smooth Movement Logic ---
    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    // --- Snapping Logic ---
    const handleMouseOver = (e) => {
      // Check 1: Standard Snap (buttons, links, inputs)
      const targetSnap = e.target.closest('button, a, input, .clickable');
      if (targetSnap) {
        cursor.classList.remove('hi');
        cursor.classList.add('snap');
      } else {
        cursor.classList.remove('snap');
        cursor.classList.add('hi');
      }

      // Check 2: Menu Snap
      const targetMenu = e.target.closest('.clickableMenu');
      if (targetMenu) {
        cursor.classList.add('snap2');
      } else {
        cursor.classList.remove('snap2');
      }

      
    };
    const handleMouseDown = () => {
      cursor.classList.add('clicking'); // Scale down
    };

    const handleMouseUp = () => {
      cursor.classList.remove('clicking'); // Return to normal
    };

    // Attach listeners
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown); // New
    window.addEventListener('mouseup', handleMouseUp);

    // Cleanup listeners on unmount or when cursor hides
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [showCursor]); // Re-run this effect if showCursor changes

  // If not a fine pointer device, return null (renders nothing)
  if (!showCursor) return null;

  return (
    <div 
      ref={cursorRef} 
      className="ipad-cursor z-[9999999999] bg-darGray/40 dark:bg-lightGray/40 shadow-xs" 
    />
  );
};

export default IPadCursor;