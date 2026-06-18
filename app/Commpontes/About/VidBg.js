"use client";

import { useEffect, useRef, useState } from "react";

export default function LightBgVideo() {
  const videoRef = useRef(null);
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    const load = () => setCanLoad(true);

    if ("requestIdleCallback" in window) {
      requestIdleCallback(load);
    } else {
      setTimeout(load, 1000);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !canLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [canLoad]);

  return (
    <video
      ref={videoRef}
      className="
        absolute inset-0 h-full w-full object-cover
        opacity-25 blur-2xl scale-110
        pointer-events-none select-none
      "
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      poster="/Videos/flow-poster.webp"
    >
      {canLoad && (
        <>
          <source src="/Videos/flow.webm" type="video/webm" />
          <source src="/Videos/flow.mp4" type="video/mp4" />
        </>
      )}
    </video>
  );
}