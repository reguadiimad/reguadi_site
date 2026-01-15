// components/IPadCursor.js
import React, { useEffect, useRef } from 'react';

const IPadCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // 1. Smooth Movement Logic
    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    // 2. Snapping Logic (Merged for performance)
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

      // Check 2: Menu Snap (handleMouseOver2 logic)
      const targetMenu = e.target.closest('.clickableMenu');
      if (targetMenu) {
        cursor.classList.add('snap2');

      } else {
        cursor.classList.remove('snap2');
      }
    };

    // Attach listeners
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver); 

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return <div ref={cursorRef} className="ipad-cursor z-[9999999999] hidden lg:block  bg-darGray/40 dark:bg-lightGray/40 shadow-xs" />;
};

export default IPadCursor;