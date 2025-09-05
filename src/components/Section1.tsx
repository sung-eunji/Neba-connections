'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Section1() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="pt-16 ">
      <section
        ref={sectionRef}
        className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-slate-700"
      >
        {/* 물결 배경 */}
        <div className="absolute inset-0 z-1">
          <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-sky-100/30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
            <div className="absolute inset-0 rounded-full border-8 shadow-lg border-sky-200/50 animate-pulse"></div>
            <div
              className="absolute inset-4 rounded-full border-8 shadow-lg border-sky-200/40 animate-pulse"
              style={{ animationDelay: '0.5s' }}
            ></div>
            <div
              className="absolute inset-8 rounded-full border-8 shadow-lg border-sky-200/30 animate-pulse"
              style={{ animationDelay: '1s' }}
            ></div>
            <div
              className="absolute inset-12 rounded-full border-8 shadow-lg border-sky-200/20 animate-pulse"
              style={{ animationDelay: '1.5s' }}
            ></div>
            <div
              className="absolute inset-16 rounded-full border-6 shadow-lg border-sky-200/10 animate-pulse"
              style={{ animationDelay: '2s' }}
            ></div>
            <div
              className="absolute inset-20 rounded-full border-6 shadow-lg border-sky-200/8 animate-pulse"
              style={{ animationDelay: '2.5s' }}
            ></div>
            <div
              className="absolute inset-24 rounded-full border-4 border-sky-200/6 animate-pulse"
              style={{ animationDelay: '3s' }}
            ></div>
            <div
              className="absolute inset-28 rounded-full border-4 border-sky-200/4 animate-pulse"
              style={{ animationDelay: '3.5s' }}
            ></div>
          </div>
        </div>
        {/* 중앙 텍스트 */}
        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4 font-montserrat">
            <span className="font-['Anton'] text-white">Neba</span>
            <span className="font-['Arial'] text-white">.</span>
          </h1>
          <p className="text-lg md:text-xl  max-w-2xl mx-auto font-open-sans text-white">
            Connecting Fashion Possibilities to Markets Worldwide
          </p>
        </div>
      </section>
    </div>
  );
}
