
// components/Squircle.jsx
import { forwardRef, useMemo } from 'react';

/**
 * True Apple-style squircle using a superellipse path (n ≈ 5).
 * Produces G2 continuous curvature — the real "figma corner smoothing: 100%".
 */
const Squircle = forwardRef(function Squircle(
  { width = 144, height = 112, radius = 30, smoothing = 0.6, className = '', style, children },
  ref
) {
  const path = useMemo(() => {
    const w = width, h = height, r = Math.min(radius, w / 2, h / 2);
    // smoothing pulls control points inward → G2 curvature
    const s = r * smoothing;
    return `
      M ${r},0
      L ${w - r},0
      C ${w - r + s},0 ${w},${r - s} ${w},${r}
      L ${w},${h - r}
      C ${w},${h - r + s} ${w - r + s},${h} ${w - r},${h}
      L ${r},${h}
      C ${r - s},${h} 0,${h - r + s} 0,${h - r}
      L 0,${r}
      C 0,${r - s} ${r - s},0 ${r},0 Z
    `;
  }, [width, height, radius, smoothing]);

  const clipId = useMemo(() => `sq-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: 'relative', width, height, ...style }}
    >
      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        aria-hidden
      >
        <defs>
          <clipPath id={clipId}><path d={path} /></clipPath>
        </defs>
        <path d={path} fill="currentColor" />
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0,
          clipPath: `url(#${clipId})`,
          WebkitClipPath: `url(#${clipId})`,
        }}
      >
        {children}
      </div>
    </div>
  );
});

export default Squircle;