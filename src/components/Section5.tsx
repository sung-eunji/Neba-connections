'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Section5() {
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

  const kpiItems = [
    {
      title: '2024 Sales',
      value: 'EUR 42.8M',
      subtitle: '2025 H1 Sales',
      subvalue: 'EUR 21.1M',
      color: 'bg-blue-500',
      delay: '0.2s',
    },
    {
      title: 'Ranked #1',
      value: 'Denim Supplier',
      subtitle: 'on leading platforms',
      subvalue: '',
      color: 'bg-green-500',
      delay: '0.4s',
    },
    {
      title: '10+',
      value: 'Seasonal launches',
      subtitle: 'each quarter',
      subvalue: '',
      color: 'bg-purple-500',
      delay: '0.6s',
    },
    {
      title: '138 denim models',
      value: '101 slacks models',
      subtitle: 'Live in market',
      subvalue: '',
      color: 'bg-orange-500',
      delay: '0.8s',
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
          Our Market Performance
        </h2>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* 왼쪽 - 그래프 */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center font-montserrat">
                Factory Jean Line
              </h3>
              <div className="relative">
                <Image
                  src="/section5/section5.png"
                  alt="Factory Jean Line Graph"
                  width={500}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* 오른쪽 - KPI 점들 */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* 세로선 */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300"></div>

              {/* KPI 아이템들 */}
              <div className="space-y-8">
                {kpiItems.map((item, index) => (
                  <div
                    key={index}
                    className={`relative flex items-start transition-all duration-1000 ease-out ${
                      isVisible
                        ? 'opacity-100 transform translate-y-0'
                        : 'opacity-0 transform translate-y-[50px]'
                    }`}
                    style={{ transitionDelay: item.delay }}
                  >
                    {/* 점 */}
                    <div
                      className={`w-12 h-12 rounded-full ${item.color} flex items-center justify-center z-10 relative`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>

                    {/* 콘텐츠 */}
                    <div className="ml-6 flex-1">
                      <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-200">
                        <div className="text-2xl font-bold text-gray-800 mb-1 font-montserrat">
                          {item.title}
                        </div>
                        <div className="text-lg text-gray-600 mb-2 font-open-sans">
                          {item.value}
                        </div>
                        {item.subtitle && (
                          <div className="text-sm text-gray-500 font-open-sans">
                            {item.subtitle}
                          </div>
                        )}
                        {item.subvalue && (
                          <div className="text-sm font-medium text-gray-700 mt-1 font-open-sans">
                            {item.subvalue}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
