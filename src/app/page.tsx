'use client';

import { useEffect, useRef } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import gsap from 'gsap';
import Link from 'next/link';
import { FTRE_VideoBackground } from '@/components/ui/video-background';

export default function IntroPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Split animations into chunks for better performance
    const letters = gsap.utils.toArray('.brand-letter');
    const fadeElements = gsap.utils.toArray('.fade-in');
    
    // Create separate timelines for better performance
    const lettersTl = gsap.timeline({
      defaults: {
        force3D: true,
        lazy: true,
      }
    });

    const fadeInTl = gsap.timeline({
      defaults: {
        force3D: true,
        lazy: true,
      }
    });

    // Optimize initial state
    gsap.set([letters, fadeElements], { 
      opacity: 0,
      willChange: 'transform, opacity',
      translateZ: 0,
    });

    // Split letter animations into chunks
    const chunkSize = 3;
    for (let i = 0; i < letters.length; i += chunkSize) {
      const chunk = letters.slice(i, i + chunkSize);
      lettersTl.to(chunk, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.05,
        clearProps: 'willChange',
      }, i * 0.1);
    }

    // Stagger fade-in elements with less overlap
    fadeInTl.to(fadeElements, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power1.out',
      clearProps: 'willChange',
    }, 0.8);

    return () => {
      lettersTl.kill();
      fadeInTl.kill();
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen w-full bg-black text-white overflow-hidden"
    >
      <FTRE_VideoBackground />

      <div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      >
        <h1 
          className="text-8xl md:text-[12rem] font-heading tracking-wider text-center"
          style={{ transform: 'translate3d(0, 0, 0)' }}
        >
          {'FOUTOURE'.split('').map((letter, index) => (
            <span
              key={index}
              className="brand-letter inline-block hover:text-red-500 transition-colors duration-300"
              style={{ 
                transform: `translate3d(0, ${100}px, 0)`,
                opacity: 0,
                display: 'inline-block',
                willChange: 'transform, opacity',
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        <p 
          className="fade-in mt-6 text-xl md:text-2xl text-gray-400 max-w-md text-center"
          style={{ 
            transform: 'translate3d(0, 20px, 0)',
            opacity: 0 
          }}
        >
          Elevate Your Street Style
        </p>

        <LazyMotion features={domAnimation} strict>
          <m.div
            className="fade-in mt-12"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-white text-black font-heading text-xl tracking-wider hover:bg-red-500 hover:text-white transition-colors duration-300"
            >
              ENTER STORE
            </Link>
          </m.div>
        </LazyMotion>

        <div 
          className="fade-in absolute bottom-8 flex gap-8 text-sm text-gray-500"
          style={{ 
            transform: 'translate3d(0, 20px, 0)',
            opacity: 0
          }}
        >
          <span>EST. 2024</span>
          <span>PREMIUM STREETWEAR</span>
          <span>MADE IN JAPAN</span>
        </div>
      </div>
    </main>
  );
} 