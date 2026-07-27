'use client';
import { ReactLenis } from 'lenis/react';

export default function SmoothScrolling({ children }) {
  return (
    <ReactLenis 
      root 
      options={{ 
        lerp: 0.01,        // درجة الإنسيابية (كلما صغار كلما زادت النعومة)
        duration: 1.3,     // وقت الحركة بـ الثواني
        smoothWheel: true, // تفعيل لـ Mouse Wheel
        wheelMultiplier: 1, 
        
      }}
    >
      {children}
    </ReactLenis>
  );
}
