"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function AppleXButton({onToggle, isOpend}) {
  const [open, setOpen] = useState(false);

  const wrapRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const auraRef = useRef(null);
  const glowRef = useRef(null);

  useLayoutEffect(() => {
    gsap.set(wrapRef.current, {
      scale: 1,
      transformOrigin: "50% 50%",
      force3D: true,
    });

    gsap.set(topRef.current, {
      x: 0,
      y: -6,
      rotate: 0,
      scaleX: 1,
      transformOrigin: "50% 50%",
      force3D: true,
    });

    gsap.set(bottomRef.current, {
      x: 0,
      y: 6,
      rotate: 0,
      scaleX: 1,
      transformOrigin: "50% 50%",
      force3D: true,
    });

    gsap.set([auraRef.current, glowRef.current], {
      opacity: 0,
      transformOrigin: "50% 50%",
      force3D: true,
    });
  }, []);

  const animate = (next) => {
    gsap.killTweensOf([
      wrapRef.current,
      topRef.current,
      bottomRef.current,
      auraRef.current,
      glowRef.current,
    ]);

    const tl = gsap.timeline({
      defaults: {
        overwrite: true,
      },
    });

    tl.to(wrapRef.current, {
      scale: 0.88,
      duration: 0.12,
      ease: "power3.out",
    });

    tl.fromTo(
      auraRef.current,
      {
        scale: 0.4,
        opacity: 0.65,
        rotate: 0,
      },
      {
        scale: 1.65,
        opacity: 0,
        rotate: 180,
        duration: 0.7,
        ease: "power4.out",
      },
      0
    );

    tl.fromTo(
      glowRef.current,
      {
        scale: 0.7,
        opacity: 0.45,
        filter: "blur(10px)",
      },
      {
        scale: 1.45,
        opacity: 0,
        filter: "blur(22px)",
        duration: 0.65,
        ease: "expo.out",
      },
      0
    );

    tl.to(
      [topRef.current, bottomRef.current],
      {
        y: 0,
        scaleX: 0.72,
        duration: 0.16,
        ease: "power4.inOut",
      },
      0.03
    );

    tl.to(
      topRef.current,
      {
        rotate: next ? 45 : 0,
        y: next ? 0 : -6,
        scaleX: 1,
        duration: 0.75,
        ease: "elastic.out(1, 0.55)",
      },
      0.15
    );

    tl.to(
      bottomRef.current,
      {
        rotate: next ? -45 : 0,
        y: next ? 0 : 6,
        scaleX: 1,
        duration: 0.75,
        ease: "elastic.out(1, 0.55)",
      },
      0.15
    );

    tl.to(
      wrapRef.current,
      {
        scale: 1,
        duration: 0.65,
        ease: "elastic.out(1, 0.45)",
      },
      0.15
    );
  };

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setOpen((prev) => {
      const next = !prev;
      animate(next);
      return next;
    });
  };

  return (
    <button
      onClick={onToggle}
      ref={wrapRef}
      type="button"
      onPointerUp={toggle}
      aria-label={open ? "Close menu" : "Open menu"}
      className="
        relative z-[1000000001]
        flex h-12 w-12 shrink-0 items-center justify-center
        overflow-hidden rounded-full
    
        pointer-events-auto touch-manipulation select-none
        [-webkit-tap-highlight-color:transparent]
      "
    >
      {/* Aura */}
      <div
        ref={auraRef}
        className="
          pointer-events-none absolute inset-1 rounded-full
          border border-white/40 opacity-0
        "
      />

      {/* Glow */}
      <div
        ref={glowRef}
        className="
          pointer-events-none absolute h-8 w-8 rounded-full
          bg-white/20 opacity-0
        "
      />

      {/* Bars */}
      <div className="pointer-events-none relative h-6 w-8">
        <div
          ref={topRef}
          className={`
            absolute left-0 top-1/2 h-[3px] w-8
            rounded-full transition-colors duration-300 ease-in-out
            ${isOpend ? "dark:bg-lightGray bg-darGray" : "bg-darGray"}
            shadow-[0_0_12px_rgba(255,255,255,0.25)]
            will-change-transform
            `}
          style={{
            transform: "translate3d(0, -6px, 0)",
            transformOrigin: "center",
          }}
        />

        <div
          ref={bottomRef}
            className={`
              absolute left-0 top-1/2 h-[3px] w-8
            rounded-full transition-colors duration-300 ease-in-out ${isOpend ? "dark:bg-lightGray bg-darGray" : "bg-darGray"}
            shadow-[0_0_12px_rgba(255,255,255,0.25)]
            will-change-transform`}
          style={{
            transform: "translate3d(0, 6px, 0)",
            transformOrigin: "center",
          }}
        />
      </div>
    </button>
  );
}