'use client';

import { useEffect, useRef } from 'react';

export function FTRE_VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
      willReadFrequently: false,
    });
    if (!ctx) return;

    // Set initial canvas size
    const updateCanvasSize = () => {
      const { clientWidth, clientHeight } = document.documentElement;
      // Reduce resolution for better performance
      canvas.width = clientWidth / 2;
      canvas.height = clientHeight / 2;
      ctx.scale(0.5, 0.5);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Optimize video settings
    video.playbackRate = 0.5;
    video.style.display = 'none';

    let animationFrame: number;
    let lastDrawn = 0;
    const fps = 15; // Limit FPS for better performance
    const interval = 1000 / fps;

    const drawFrame = (timestamp: number) => {
      if (timestamp - lastDrawn >= interval) {
        ctx.globalAlpha = 0.3; // Match the opacity-30 from the original
        ctx.drawImage(video, 0, 0, canvas.width * 2, canvas.height * 2);
        lastDrawn = timestamp;
      }
      animationFrame = requestAnimationFrame(drawFrame);
    };

    const startPlayback = () => {
      video.play().then(() => {
        animationFrame = requestAnimationFrame(drawFrame);
      }).catch(() => {});
    };

    // Start playback when video is ready
    video.addEventListener('loadeddata', startPlayback);

    // Intersection Observer for performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startPlayback();
        } else {
          video.pause();
          cancelAnimationFrame(animationFrame);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 mask">
      <video
        ref={videoRef}
        src="/videos/bg-texture.mp4"
        muted
        loop
        playsInline
        preload="none"
      />
      <canvas
        ref={canvasRef}
        className="h-full w-full object-cover"
        style={{
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          imageRendering: 'pixelated',
        }}
      />
    </div>
  );
} 