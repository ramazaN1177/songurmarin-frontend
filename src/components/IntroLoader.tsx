import React, { useState, useEffect } from 'react';

interface IntroLoaderProps {
  onComplete?: () => void;
}

// Pre-instantiate logo image in JS memory for immediate synchronous rendering
if (typeof window !== 'undefined') {
  const img = new Image();
  img.src = '/songurmarinlogo.png';
}

export const IntroLoader: React.FC<IntroLoaderProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show pure white intro screen with logo and text for 1.6s, then fade out smoothly
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 700);

      return () => clearTimeout(removeTimer);
    }, 1600);

    return () => clearTimeout(fadeTimer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 transition-opacity duration-700 ease-in-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Pure white background with only Logo and Text */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left max-w-xl mx-auto px-4">
        
        {/* Emblem Logo - Eager & Synchronous Decode */}
        <img
          src="/songurmarinlogo.png"
          alt="Songur Marin Logo"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="h-20 sm:h-28 w-auto object-contain shrink-0"
        />

        {/* Brand Typography */}
        <div className="flex flex-col justify-center items-center sm:items-start">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-none uppercase font-heading">
            SONGUR MARİN
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-bold text-blue-600 tracking-[0.2em] sm:tracking-[0.25em] uppercase mt-2 sm:mt-2.5 leading-tight">
            MAKİNE & EKİPMAN SAN.
          </p>
        </div>
      </div>
    </div>
  );
};
