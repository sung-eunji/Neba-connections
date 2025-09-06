'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Section11() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setIsVisible(true)),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const contactInfo = [
    {
      title: 'Marseille',
      icon: '🏠',
      details: ['162 Bd Rabatau Daniel Matalon', '13010'],
      delay: '0.2s',
    },
    {
      title: 'Phone us',
      icon: '📞',
      details: ['+33 7 83 00 79 52'],
      delay: '0.4s',
    },
    {
      title: 'Mail us',
      icon: '✉️',
      details: ['support@neba-connections.net'],
      delay: '0.6s',
    },
    {
      title: 'Socials',
      icon: '🌐',
      details: ['@Neba-Connections'],
      delay: '0.8s',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] bg-white snap-start"
    >
      <div className="relative w-full h-[80vh]">
        {/* 배경 월드맵 이미지 */}
        <div
          className={`absolute inset-0 transition-opacity duration-2000 ease-out ${
            isVisible ? 'opacity-30' : 'opacity-0'
          }`}
          style={{ transitionDelay: '0.5s' }}
        >
          <Image
            src="/section11/section11.png"
            alt="World Map"
            fill
            className="object-cover"
            style={{ objectPosition: 'center' }}
          />
        </div>

        {/* 연락처 정보 카드들 */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className={`bg-white border border-blue-200 rounded-lg shadow-lg p-6 transition-all duration-1000 ease-out ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: info.delay }}
              >
                <div className="text-center">
                  <div className="text-3xl mb-4">{info.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 font-montserrat">
                    {info.title}
                  </h3>
                  <div className="space-y-1">
                    {info.details.map((detail, detailIndex) => (
                      <p
                        key={detailIndex}
                        className="text-sm text-gray-600 font-open-sans"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
