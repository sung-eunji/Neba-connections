'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Section7() {
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

  const partnershipItems = [
    {
      image: '/section7/section7-0.png',
      title: 'Major retailers & online platforms',
      description:
        'We supply leading e-commerce platforms and regional retail chains, securing top rankings such as #1 denim supplier on ABLY. Our model scales seamlessly, serving both boutiques and high-volume retail clients across markets.',
      icon: '/section6/headphone.png',
      bgColor: 'bg-blue-600',
    },
    {
      image: '/section7/section7-1.png',
      title: 'Proven Bestsellers',
      description:
        "Our women's denim models have exceeded 20,000 units sold each, demonstrating strong trend alignment and reliable replenishment capacity. These successes reflect our ability to combine consumer appeal with dependable production.",
      icon: '/section6/docker.png',
      bgColor: 'bg-teal-600',
    },
    {
      image: '/section7/section7-2.png',
      title: 'Category Strength',
      description:
        "While women's denim leads our portfolio, we are rapidly expanding in men's and unisex basics. With 10+ seasonal launches each quarter, we keep assortments fresh and ensure retailers maintain repeat consumer engagement.",
      icon: '/section7/eye.png',
      bgColor: 'bg-teal-700',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-16 px-4 bg-white snap-start"
    >
      <div className="text-start mb-[8rem] pl-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 font-montserrat">
          Partnerships
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl font-open-sans text-start">
          Proven growth partner for fashion platforms and wholesalers
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {partnershipItems.map((item, index) => (
            <div key={index} className="flex flex-col items-start">
              {/* 이미지 컨테이너 - 위에서 내려오는 애니메이션 */}
              <div
                className={`relative mb-6 transition-all duration-1000 ease-out ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 -translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 0.3}s` }}
              >
                <div className="relative">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                  {/* 아이콘 오버레이 */}
                  <div
                    className={`absolute bottom-2 left-2 w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <Image
                      src={item.icon}
                      alt="icon"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </div>
                </div>
              </div>

              {/* 텍스트 컨테이너 - 아래서 올라오는 애니메이션 */}
              <div
                className={`w-full transition-all duration-1000 ease-out ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
                style={{ transitionDelay: `${index * 0.3 + 0.15}s` }}
              >
                <div
                  className={`${item.bgColor} text-white p-6 h-48 flex flex-col justify-between shadow-lg`}
                >
                  <h3 className="text-lg font-bold mb-3 font-montserrat">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-open-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
