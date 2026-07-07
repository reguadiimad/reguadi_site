'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

const SLIDES_DATA = [
  {
    id: "01",
    metric: "15+",
    metricSub: "Founder-led brands from disruptive creative agencies to consumer brands",
    quote1: "Great founders changing the world deserve a presence as powerful as what they're building. Most founders we work with have built something significant, but their website doesn't show it yet.",
    quote2: "That gap costs more than revenue. It costs the certainty that your brand is finally being understood.",
    author: "Huy (By Huy) Nguyen",
    role: "Founder, MONOLOG",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
  },
  {
    id: "02",
    metric: "88%",
    metricSub: "Average increase in premium brand positioning and digital authority",
    quote1: "Design is the silent ambassador of your product's true scale. When your digital surface doesn't align with your vision, you're constantly playing catch-up with market perception.",
    quote2: "Bridging this divide doesn't just drive modern conversions—it establishes undeniable clarity for your future.",
    author: "Sarah Jenkins",
    role: "Design Director, MONOLOG",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80"
  }
];

export default function FoundersSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);
  const textContainerRef = useRef(null);
  const metricRef = useRef(null);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % SLIDES_DATA.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + SLIDES_DATA.length) % SLIDES_DATA.length);
  };

  useEffect(() => {
    // Context helper for safe React 18 animation scoping and cleanup
    const ctx = gsap.context(() => {
      
      // Target elements for text container
      const animatedElements = textContainerRef.current.querySelectorAll('.animate-text');
      
      // Dynamic Springy Animation Timeline
      const tl = gsap.timeline();

      // Animate Metric Section left
      tl.fromTo(metricRef.current, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "back.out(1.4)" }
      );

      // Animate Content Blocks right (Staggered with springy ease)
      tl.fromTo(animatedElements,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.9, 
          stagger: 0.08, 
          ease: "back.out(1.2)", // Snappy premium boutique feel
        },
        "-=0.6" // Overlay transitions gracefully
      );

    }, containerRef);

    return () => ctx.revert(); // Cleanup on unmount/state update
  }, [activeIndex]);

  const currentSlide = SLIDES_DATA[activeIndex];

  return (
    <section 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-b from-black/0 to-[#101010] to-30% text-white flex items-center justify-center p-6 sm:p-12 md:p-20 font-sans -mt-64 selection:bg-white selection:text-black tracking-tight"
    >
      <div className="w-full max-w-7xl grid grid-cols-1 pt-64 lg:grid-cols-12 gap-12  lg:gap-16 items-start">
        
        {/* Left Side: Navigation & Metrics */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full pt-1">
          <div>
            {/* Top Navigation Bar Component */}
            <div className="w-full h-[1px] bg-neutral-800 relative mb-6">
              {/* Dynamic Animated Line Indicator */}
              <div 
                className="absolute top-0 left-0 h-[1.5px] bg-neutral-400 transition-all duration-500 ease-out"
                style={{ 
                  width: `${((activeIndex + 1) / SLIDES_DATA.length) * 100}%` 
                }}
              />
            </div>

            <div className="flex items-center justify-between text-sm text-neutral-400 mb-16">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handlePrev}
                  className="hover:text-white transition-colors duration-200 text-lg cursor-pointer focus:outline-none"
                  aria-label="Previous Slide"
                >
                  ←
                </button>
                <button 
                  onClick={handleNext}
                  className="hover:text-white transition-colors duration-200 text-lg cursor-pointer focus:outline-none"
                  aria-label="Next Slide"
                >
                  →
                </button>
              </div>
              <div className="font-mono text-xs tracking-widest text-neutral-500">
                {currentSlide.id}/{String(SLIDES_DATA.length).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Large Metric Data Display */}
          <div ref={metricRef} className="mt-auto ">
            <h2 className="text-6xl sm:text-7xl  font-semibold text-white tracking-tighter">
              {currentSlide.metric}
            </h2>
            <p className="mt-4 text-neutral-400 text-base leading-relaxed max-w-xs font-normal">
              {currentSlide.metricSub}
            </p>
          </div>
        </div>

        {/* Right Side: Main Copy Statements & Attribution */}
        <div ref={textContainerRef} className="lg:col-span-8 flex flex-col space-y-12 lg:space-y-14 font-satoshi">
          
          <h1 className="animate-text text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-medium leading-[1.3] text-neutral-200 tracking-tight max-w-4xl">
            {currentSlide.quote1}
          </h1>

          <p className="animate-text text-3xl sm:text-4xl md:text-[2.75rem] lg:text-5xl font-medium leading-[1.3] text-neutral-200 tracking-tight max-w-4xl">
            {currentSlide.quote2}
          </p>

          {/* Profile Card Footer */}
          <div className="animate-text flex items-center gap-3 pt-4">
            {/* Minimal Profile Photo */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 grayscale border border-neutral-800">
              <img 
                src={currentSlide.avatar} 
                alt={currentSlide.author}
                className="w-full h-full object-cover" 
              />
            </div>
            {/* Meta Labels */}
            <div className="flex flex-col text-[13px] leading-tight">
              <span className="text-neutral-300 font-medium">{currentSlide.author}</span>
              <span className="text-neutral-500 font-normal">{currentSlide.role}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}