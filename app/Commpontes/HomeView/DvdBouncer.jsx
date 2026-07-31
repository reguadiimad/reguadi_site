"use client";

import React, { useRef, useEffect } from "react";

export default function DvdBouncer({ children, speed = 1.5, className = "" }) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el || !el.parentElement) return;

    const parent = el.parentElement;

    let pWidth = parent.clientWidth;
    let pHeight = parent.clientHeight;
    let eWidth = el.offsetWidth || 250;
    let eHeight = el.offsetHeight || 250;

    // Start at a random location within bounds
    let posX = Math.random() * Math.max(1, pWidth - eWidth);
    let posY = Math.random() * Math.max(1, pHeight - eHeight);

    // Initial direction vectors
    let velX = (Math.random() > 0.5 ? 1 : -1) * speed;
    let velY = (Math.random() > 0.5 ? 1 : -1) * speed;

    let animId;

    const handleResize = () => {
      pWidth = parent.clientWidth;
      pHeight = parent.clientHeight;
      eWidth = el.offsetWidth;
      eHeight = el.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      posX += velX;
      posY += velY;

      // Horizontal Bounce
      if (posX + eWidth >= pWidth) {
        posX = pWidth - eWidth;
        velX = -Math.abs(velX);
      } else if (posX <= 0) {
        posX = 0;
        velX = Math.abs(velX);
      }

      // Vertical Bounce
      if (posY + eHeight >= pHeight) {
        posY = pHeight - eHeight;
        velY = -Math.abs(velY);
      } else if (posY <= 0) {
        posY = 0;
        velY = Math.abs(velY);
      }

      el.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [speed]);

  return (
    <div
      ref={elRef}
      className={`absolute top-0 left-0 pointer-events-none will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
