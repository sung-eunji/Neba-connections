'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Section2() {
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
      className="relative min-h-[80vh] flex items-center overflow-hidden"
    >
      {/* 배경 이미지 */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/section2/background.png"
          alt="Background"
          fill
          className="object-cover"
        />
      </div>

      {/* 왼쪽 파란색 오버레이 박스 - 위에서 아래로 올라오는 애니메이션 */}
      <div
        className={`relative z-10 w-[50rem] h-full bg-blue-400/90 backdrop-blur-sm flex flex-col justify-center ml-20 px-12 lg:px-16 transition-all duration-1000 ease-out py-[5rem] ${
          isVisible
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-[-100px]'
        }`}
        style={{ transitionDelay: '0.3s' }}
      >
        <div className="max-w-lg">
          {/* 제목 */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-montserrat">
            Who We Are
          </h2>

          {/* 구분선 */}
          <div className="w-20 h-1 bg-white mb-8"></div>

          {/* 불릿 포인트 내용 */}
          <div className="space-y-6 text-white font-open-sans">
            <div className="flex items-start space-x-3">
              <span className="text-white text-lg mt-1">•</span>
              <p className="text-lg leading-relaxed">
                Global distributor of premium denim & fashion-forward products
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-white text-lg mt-1">•</span>
              <p className="text-lg leading-relaxed">
                Distribution-first model backed by integrated Asian production
              </p>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-white text-lg mt-1">•</span>
              <p className="text-lg leading-relaxed">
                Active in EU markets with expansion into Africa & South America
              </p>
            </div>
          </div>

          {/* circle.png 이미지 */}
          <div className="mt-12 flex justify-center">
            <div className="w-16 h-16 border-2 border-white rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/section2/circle.png"
                alt="Circle"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 오른쪽 배경 이미지 영역 */}
      <div className="relative z-5 w-1/2 h-full">
        {/* 빈 공간 - circle.png 제거됨 */}
      </div>
    </section>
  );
}
