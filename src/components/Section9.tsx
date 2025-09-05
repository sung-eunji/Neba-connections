'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Section9() {
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

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-16 px-4 bg-white"
    >
      <div className="text-start mb-16 pl-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 font-montserrat">
          Our Mission
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl font-open-sans">
          Connecting fashion possibilities to markets worldwide.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* 상단 이미지들 - 왼쪽에서 오른쪽으로 나타나는 애니메이션 */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-20'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <Image
              src="/section9/section9.png"
              alt="Fashion item 1"
              width={400}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-20'
            }`}
            style={{ transitionDelay: '0.4s' }}
          >
            <Image
              src="/section9/section9-1.png"
              alt="Fashion item 2"
              width={400}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-20'
            }`}
            style={{ transitionDelay: '0.6s' }}
          >
            <Image
              src="/section9/section9-2.png"
              alt="Fashion item 3"
              width={400}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* 하단 이미지들과 텍스트박스 - 아래서 위로 나타나는 애니메이션 */}
        <div className="grid grid-cols-3 gap-6">
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
            style={{ transitionDelay: '0.8s' }}
          >
            <Image
              src="/section9/section9-3.png"
              alt="Fashion item 4"
              width={400}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* 미션 텍스트박스 */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
            style={{ transitionDelay: '1.0s' }}
          >
            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white p-8 rounded-lg shadow-lg h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4 font-montserrat">
                Our mission:
              </h3>
              <p className="text-lg mb-6 font-open-sans">
                Connecting fashion possibilities to markets worldwide.
              </p>
              <ul className="space-y-2 text-sm font-open-sans">
                <li>• Fashion-forward</li>
                <li>• High-quality</li>
                <li>• Competitively priced</li>
              </ul>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 ease-out ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-20'
            }`}
            style={{ transitionDelay: '1.2s' }}
          >
            <Image
              src="/section9/section9-4.png"
              alt="Fashion item 5"
              width={400}
              height={400}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


