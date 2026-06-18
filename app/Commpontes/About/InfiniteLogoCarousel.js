import React, { useEffect, useRef, useState, useMemo } from 'react';

const LOGO_DATABASE = [
  { name: "React", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/react.svg" },
  { name: "Django", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/django.svg" },
  { name: "Next.js", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nextdotjs.svg" },
  { name: "Framer", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/framer.svg" },
  { name: "GSAP", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/greensock.svg" },
  { name: "Flutter", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/flutter.svg" },
  { name: "Swift", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/swift.svg" },
  { name: "PHP", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/php.svg" },
  { name: "Procreate", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/procreate.svg" },
  { name: "MySQL", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/mysql.svg" },
  { name: "SQLite", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/sqlite.svg" },
  { name: "JavaScript", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/javascript.svg" },
  { name: "Windows", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/windows.svg" },
  { name: "Java", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/openjdk.svg" },
  { name: "Apple", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg" },
  { name: "Android", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/android.svg" },
  { name: "AI", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/openai.svg" },
  { name: "GitHub", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg" },
  { name: "GitLab", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gitlab.svg" },
  { name: "DevOps", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg" },
  { name: "Design", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg" },
  { name: "Canva", url: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/canva.svg" }
];

export default function InfiniteLogoCarousel({
  speed = 1.4,
  direction = -1,
  gap = 64,
  logoSize = 96,
  scaleReduction = 0.1,
  fadePower = 1,
  maxBlur = 2,
  globalOpacity = 0.7,

}) {
  const containerRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const logoRefs = useRef([]);

  // Generate a stable fallback duplicated list to match Server rendering perfectly
  const stableDuplicatedList = useMemo(() => {
    return [...LOGO_DATABASE, ...LOGO_DATABASE, ...LOGO_DATABASE, ...LOGO_DATABASE];
  }, []);

  // Initialize state with the stable layout list to prevent SSR mismatch
  const [carouselLogos, setCarouselLogos] = useState(stableDuplicatedList);

  useEffect(() => {
    // Client-Side Only: Execute array randomizer safely post-hydration
    const arr = [...LOGO_DATABASE];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setCarouselLogos([...arr, ...arr, ...arr, ...arr]);
  }, []);

  useEffect(() => {
    let requestRef;

    const updateAnimation = () => {
      if (!containerRef.current || carouselLogos.length === 0) {
        requestRef = requestAnimationFrame(updateAnimation);
        return;
      }

      const containerWidth = containerRef.current.clientWidth || 800;
      const spacing = logoSize + gap;
      const totalTrackWidth = carouselLogos.length * spacing;

      scrollOffsetRef.current += speed * direction;

      if (scrollOffsetRef.current < -totalTrackWidth) {
        scrollOffsetRef.current += totalTrackWidth;
      } else if (scrollOffsetRef.current > totalTrackWidth) {
        scrollOffsetRef.current -= totalTrackWidth;
      }

      const center = containerWidth / 2;

      for (let i = 0; i < carouselLogos.length; i++) {
        const logoEl = logoRefs.current[i];
        if (!logoEl) continue;

        let posX = (i * spacing + scrollOffsetRef.current) % totalTrackWidth;
        if (posX < 0) posX += totalTrackWidth;

        if (posX > containerWidth + logoSize) {
          posX -= totalTrackWidth;
        } else if (posX < -logoSize - spacing) {
          posX += totalTrackWidth;
        }

        const logoCenter = posX + logoSize / 2;
        const distanceFromCenter = Math.abs(logoCenter - center);
        const ratio = Math.min(distanceFromCenter / (containerWidth / 2), 1.0);

        const scale = 1.0 - Math.pow(ratio, 2.0) * scaleReduction;
        const opacity = Math.max(0.05, (1.0 - Math.pow(ratio, fadePower)) * globalOpacity);
        const blurAmount = Math.pow(ratio, 2.2) * maxBlur;

        logoEl.style.transform = `translate3d(${posX}px, -50%, 0) scale(${Math.max(0.1, scale)})`;
        logoEl.style.opacity = opacity;
        logoEl.style.filter = blurAmount > 0.3 ? `blur(${blurAmount}px)` : 'none';
      }

      requestRef = requestAnimationFrame(updateAnimation);
    };

    requestRef = requestAnimationFrame(updateAnimation);
    return () => cancelAnimationFrame(requestRef);
  }, [carouselLogos, speed, direction, gap, scaleReduction, fadePower, maxBlur, logoSize, globalOpacity]);

  return (
    <div className={`relative w-[120%] -mb-20 overflow-hidden `}>
      
      {/* Premium Blend Edge Gradient Mask overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-[20%] pointer-events-none z-10"
           />
      <div className="absolute right-0 top-0 bottom-0 w-[20%] pointer-events-none z-10"
            />

      <div 
        ref={containerRef} 
        className="relative w-full h-24 mx-auto overflow-hidden pointer-events-none"
      >
        {carouselLogos.map((logo, index) => (
          <div
            key={`${logo.name}-${index}`}
            ref={(el) => (logoRefs.current[index] = el)}
            className="absolute top-1/2 left-0 flex items-center justify-center"
            style={{
              width: `${logoSize}px`,
              height: `${logoSize}px`,
              willChange: 'transform, opacity, filter',
            }}
          >
            <img 
              src={logo.url} 
              alt={logo.name} 
              className="w-12 h-12 object-contain select-none"
              style={{ filter: 'brightness(0) invert(1)' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<span class="text-xs font-mono font-semibold text-white tracking-tighter opacity-70">${logo.name}</span>`;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}