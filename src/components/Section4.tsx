'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Section4() {
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

  const sections = [
    {
      image: '/section4/section4.png',
      title: 'Neba Distribution',
      points: [
        'EU, Africa, South America Reach',
        'Logistics Excellence',
        'Client-focused partnerships',
      ],
      delay: '0.2s',
      layout: 'text-left', // 첫 번째: 텍스트 왼쪽, 이미지 오른쪽
    },
    {
      image: '/section4/section4-1.png',
      title: 'Production Backbone',
      points: [
        '8 factories across Korea & China',
        'Jeans, Slacks, Shirts, Skirts, Jackets',
        'In house QC teams',
        '15,000㎡ logistics warehouse',
      ],
      delay: '0.4s',
      layout: 'text-left', // 두 번째도: 텍스트 왼쪽, 이미지 오른쪽
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-16 px-4 bg-white"
    >
      {/* 제목 */}
      <div className="text-start mb-16 pl-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-700 text-gray-900 mb-4 font-montserrat">
          Our Structure
        </h2>
      </div>

      {/* 두 쌍을 가로로 배치 */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ease-out h-full ${
                isVisible
                  ? 'opacity-100 transform translate-y-0'
                  : 'opacity-0 transform translate-y-[100px]'
              }`}
              style={{ transitionDelay: section.delay }}
            >
              <div className="flex flex-col lg:flex-row items-stretch gap-0 h-full">
                {/* 텍스트 섹션 */}
                <div className="lg:w-1/2">
                  <div className="bg-blue-600 text-white p-8 lg:p-12 h-full flex flex-col justify-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-6 font-montserrat">
                      {section.title}
                    </h3>
                    <ul className="space-y-4 font-open-sans">
                      {section.points.map((point, pointIndex) => (
                        <li
                          key={pointIndex}
                          className="flex items-start space-x-3"
                        >
                          <span className="text-white text-lg mt-1">•</span>
                          <span className="text-lg leading-relaxed">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 이미지 섹션 */}
                <div className="lg:w-1/2">
                  <div className="relative h-80 lg:h-full overflow-hidden">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
