'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import Link from 'next/link';

export default function IntroPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation
      gsap.from('.brand-letter', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power4.out',
      });

      gsap.from('.fade-in', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 1,
        stagger: 0.2,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen w-full bg-black text-white overflow-hidden"
    >
      {/* Background video/image with mask effect */}
      <div className="absolute inset-0 z-0 mask">
        <video
          src="/videos/bg-texture.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-30"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Brand name animation */}
        <h1 
          ref={textRef}
          className="text-8xl md:text-[12rem] font-heading tracking-wider text-center"
        >
          {'FOUTOURE'.split('').map((letter, index) => (
            <span
              key={index}
              className="brand-letter inline-block hover:text-red-500 transition-colors duration-300"
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Tagline */}
        <p className="fade-in mt-6 text-xl md:text-2xl text-gray-400 max-w-md text-center">
          Elevate Your Street Style
        </p>

        {/* CTA Button */}
        <motion.div
          className="fade-in mt-12"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            href="/shop"
            className="px-8 py-4 bg-white text-black font-heading text-xl tracking-wider hover:bg-red-500 hover:text-white transition-colors duration-300"
          >
            ENTER STORE
          </Link>
        </motion.div>

        {/* Social proof */}
        <div className="fade-in absolute bottom-8 flex gap-8 text-sm text-gray-500">
          <span>EST. 2024</span>
          <span>PREMIUM STREETWEAR</span>
          <span>MADE IN JAPAN</span>
        </div>
      </div>
    </main>
  );
} 