'use client';

import { useEffect, useRef } from 'react';

export function FTRE_CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const prevTimestamp = useRef<number>(0);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const render = (timestamp: number) => {
      if (!prevTimestamp.current) {
        prevTimestamp.current = timestamp;
      }

      const deltaTime = timestamp - prevTimestamp.current;
      const lerpFactor = Math.min(1, deltaTime / 16.67); // 60fps-based smoothing

      // Optimized lerp calculation
      currentPosition.current.x = currentPosition.current.x + (mousePosition.current.x - currentPosition.current.x) * (0.25 * lerpFactor);
      currentPosition.current.y = currentPosition.current.y + (mousePosition.current.y - currentPosition.current.y) * (0.25 * lerpFactor);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentPosition.current.x}px, ${currentPosition.current.y}px, 0) translate(-50%, -50%)`;
      }

      prevTimestamp.current = timestamp;
      rafId.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    rafId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed z-[9999] h-4 w-4 rounded-full border border-white mix-blend-difference"
      style={{
        left: 0,
        top: 0,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        willChange: 'transform'
      }}
    />
  );
} 