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
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/section1/background.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-white/20"></div>
      </div>

      {/* 물결 배경 */}
      <div className="absolute inset-0 z-1">
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-sky-100/30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 rounded-full border border-sky-200/50 animate-pulse"></div>
          <div
            className="absolute inset-4 rounded-full border border-sky-200/40 animate-pulse"
            style={{ animationDelay: '0.5s' }}
          ></div>
          <div
            className="absolute inset-8 rounded-full border border-sky-200/30 animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className="absolute inset-12 rounded-full border border-sky-200/20 animate-pulse"
            style={{ animationDelay: '1.5s' }}
          ></div>
          <div
            className="absolute inset-16 rounded-full border border-sky-200/10 animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>
      </div>

      {/* 중앙 텍스트 */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-4 font-montserrat">
          <span className="font-['Anton']">Neba</span>
          <span className="font-['Arial']">.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-open-sans">
          Connecting Fashion Possibilities to Markets Worldwide
        </p>
      </div>

      {/* 플로팅 이미지들 - 8개, 다양한 크기로 네바 로고에 가까이 모이는 애니메이션 */}
      <div className="absolute inset-0 pointer-events-none z-5">
        {/* 1. 상단에서 모이는 이미지 (가장 작은 것) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 transform translate-y-[-50px]'
                : 'opacity-0 transform translate-y-[-200px]'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <Image
              src="/section1/example1.png"
              alt="Fashion item 1"
              width={60}
              height={80}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* 2. 하단에서 모이는 이미지 (세번째 작은 것) */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 transform translate-y-[50px]'
                : 'opacity-0 transform translate-y-[200px]'
            }`}
            style={{ transitionDelay: '0.4s' }}
          >
            <Image
              src="/section1/example1.png"
              alt="Fashion item 2"
              width={80}
              height={100}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* 3. 좌측에서 모이는 이미지 (두번째 큰 것) */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 transform translate-x-[-50px]'
                : 'opacity-0 transform translate-x-[-200px]'
            }`}
            style={{ transitionDelay: '0.6s' }}
          >
            <Image
              src="/section1/example1.png"
              alt="Fashion item 3"
              width={120}
              height={150}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* 4. 우측에서 모이는 이미지 (가장 작은 것) */}
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 transform translate-x-[50px]'
                : 'opacity-0 transform translate-x-[200px]'
            }`}
            style={{ transitionDelay: '0.8s' }}
          >
            <Image
              src="/section1/example1.png"
              alt="Fashion item 4"
              width={60}
              height={80}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* 5. 좌상단 대각선에서 모이는 이미지 (가장 작은 것) */}
        <div className="absolute top-0 left-0">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 transform translate-x-[-30px] translate-y-[-30px]'
                : 'opacity-0 transform translate-x-[-150px] translate-y-[-150px]'
            }`}
            style={{ transitionDelay: '1.0s' }}
          >
            <Image
              src="/section1/example1.png"
              alt="Fashion item 5"
              width={60}
              height={80}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* 6. 우상단 대각선에서 모이는 이미지 (두번째 큰 것) */}
        <div className="absolute top-0 right-0">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 transform translate-x-[30px] translate-y-[-30px]'
                : 'opacity-0 transform translate-x-[150px] translate-y-[-150px]'
            }`}
            style={{ transitionDelay: '1.2s' }}
          >
            <Image
              src="/section1/example1.png"
              alt="Fashion item 6"
              width={120}
              height={150}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* 7. 좌하단 대각선에서 모이는 이미지 (세번째 작은 것) */}
        <div className="absolute bottom-0 left-0">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 transform translate-x-[-30px] translate-y-[30px]'
                : 'opacity-0 transform translate-x-[-150px] translate-y-[150px]'
            }`}
            style={{ transitionDelay: '1.4s' }}
          >
            <Image
              src="/section1/example1.png"
              alt="Fashion item 7"
              width={80}
              height={100}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* 8. 우하단 대각선에서 모이는 이미지 (가장 큰 것) */}
        <div className="absolute bottom-0 right-0">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 transform translate-x-[30px] translate-y-[30px]'
                : 'opacity-0 transform translate-x-[150px] translate-y-[150px]'
            }`}
            style={{ transitionDelay: '1.6s' }}
          >
            <Image
              src="/section1/example1.png"
              alt="Fashion item 8"
              width={140}
              height={180}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
