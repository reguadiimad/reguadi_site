"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";

export default function AppleXButton() {
  const [open, setOpen] = useState(false);

  const wrapRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const auraRef = useRef(null);
  const glowRef = useRef(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);

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

    // Small Apple-like press feedback
    tl.to(wrapRef.current, {
      scale: 0.88,
      duration: 0.12,
      ease: "power3.out",
    });

    // Siri / FaceID aura pulse
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

    // Bars compress first
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

    // Then morph into X / back to bars
    tl.to(
      topRef.current,
      {
        rotate: next ? 45 : 0,
        y: next ? 0 : -6,
        scaleX: next ? 1 : 1,
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
        scaleX: next ? 1 : 1,
        duration: 0.75,
        ease: "elastic.out(1, 0.55)",
      },
      0.15
    );

    // Final soft rebound
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

  return (
    <button
      ref={wrapRef}
      onClick={toggle}
      aria-label={open ? "Close menu" : "Open menu"}
      className="
        relative flex h-12 w-12 items-center justify-center
        rounded-full overflow-hidden
        bg-black/5 
        active:scale-95
      "
    >
      {/* Face ID / Siri aura */}
      <div
        ref={auraRef}
        className="
          pointer-events-none absolute inset-1 rounded-full
          border border-white/40
          opacity-0
        "
      />

      <div
        ref={glowRef}
        className="
          pointer-events-none absolute h-8 w-8 rounded-full
          bg-white/30 opacity-0
        "
      />

      {/* Bars */}
      <div className="relative h-6 w-8">
        <div
          ref={topRef}
          className="
            absolute left-0 top-1/2 h-[3px] w-8
            -translate-y-1/2
            rounded-full bg-darGray
            shadow-[0_0_12px_rgba(255,255,255,0.25)]
            will-change-transform
          "
          style={{
            transform: "translateY(-6px)",
            transformOrigin: "center",
          }}
        />

        <div
          ref={bottomRef}
          className="
            absolute left-0 top-1/2 h-[3px] w-8
            -translate-y-1/2
            rounded-full bg-darGray
            shadow-[0_0_12px_rgba(255,255,255,0.25)]
            will-change-transform
          "
          style={{
            transform: "translateY(6px)",
            transformOrigin: "center",
          }}
        />
      </div>
    </button>
  );
}