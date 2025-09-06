'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Section3() {
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

  const panels = [
    {
      image: '/section3/section3-1.png',
      statistic: '35K',
      description: 'units/day-expandable(40K)',
      delay: '0.2s',
    },
    {
      image: '/section3/section3-2.png',
      statistic: '$42.8M',
      description: 'Annual Sales (2024)',
      delay: '0.4s',
    },
    {
      image: '/section3/section3-3.png',
      statistic: '120+',
      description: 'Employees',
      delay: '0.6s',
    },
    {
      image: '/section3/section3-4.png',
      statistic: '2013',
      description: 'Founded year(Production roots)',
      delay: '0.8s',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] flex flex-col justify-center items-start py-16 px-4 bg-white snap-start"
    >
      {/* 제목과 부제목 */}
      <div className="text-start mb-16 pl-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-700 text-gray-900 mb-4 font-montserrat">
          Company Overview
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-open-sans">
          700+ Active Clients with EU distribution hub (HQ) in Marseille.
        </p>
      </div>

      {/* 4개 패널 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
        {panels.map((panel, index) => (
          <div
            key={index}
            className={`relative h-[30rem] rounded-lg overflow-hidden transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 transform translate-y-0'
                : 'opacity-0 transform translate-y-[100px]'
            }`}
            style={{ transitionDelay: panel.delay }}
          >
            {/* 배경 이미지 */}
            <Image
              src={panel.image}
              alt={`Panel ${index + 1}`}
              fill
              className="object-cover"
            />

            {/* 콘텐츠 */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {panel.statistic}
                </div>
                <div className="text-sm md:text-base text-center leading-tight">
                  {panel.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
