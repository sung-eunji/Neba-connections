'use client';

import { useEffect, useRef, useState } from 'react';

export default function Section8() {
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

  const customerActionItems = [
    {
      title: 'Dedicated CS teams',
      description:
        'Our customer service teams provide transparent communication and proactive support, ensuring smooth order and delivery processes.',
      position: 'above',
    },
    {
      title: '10+ new products every season',
      description:
        'Neba introduces a steady stream of new denim and fashion-forward items every season, keeping assortments fresh and aligned with global trends.',
      position: 'above',
    },
    {
      title: 'Efficient logistics solutions',
      description:
        'We leverage optimized shipping routes and warehouses to provide reliable, timely deliveries across markets.',
      position: 'above',
    },
    {
      title: 'Private brand support',
      description:
        'We collaborate with clients to develop exclusive PB collections, enabling them to strengthen brand identity and customer loyalty.',
      position: 'below',
    },
    {
      title: 'Flexible production scaling',
      description:
        'Our integrated production network adapts quickly to demand shifts, scaling output seamlessly to meet client growth.',
      position: 'below',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-16 px-4 bg-white"
    >
      <div className="text-start mb-16 pl-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 font-montserrat">
          Customer Action Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl font-open-sans">
          From concept to delivery, N.e.b.a. supports every step of the customer
          journey.
        </p>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* 타임라인 선 - 왼쪽에서 오른쪽으로 생성되는 애니메이션 */}
        <div className="relative h-1 bg-gray-300 mb-16">
          <div
            className={`absolute top-0 left-0 h-full bg-blue-600 transition-all duration-2000 ease-out ${
              isVisible ? 'w-full' : 'w-0'
            }`}
            style={{ transitionDelay: '0.5s' }}
          />
        </div>

        {/* 타임라인 노드들 */}
        <div className="relative">
          {/* 타임라인 노드들 - 왼쪽에서 오른쪽으로 순차적으로 나타남 */}
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`absolute top-0 w-4 h-4 bg-blue-600 rounded-full transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
              }`}
              style={{
                left: `${(index / 4) * 100}%`,
                transform: 'translateX(-50%)',
                transitionDelay: `${0.8 + index * 0.2}s`,
              }}
            />
          ))}

          {/* 카드들 - 오른쪽에서 왼쪽으로 이동하면서 생성 */}
          {customerActionItems.map((item, index) => (
            <div
              key={index}
              className={`absolute transition-all duration-1000 ease-out ${
                isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 translate-x-20'
              }`}
              style={{
                left: `${(index / 4) * 100}%`,
                transform: 'translateX(-50%)',
                transitionDelay: `${1.2 + index * 0.3}s`,
                top: item.position === 'above' ? '-120px' : '40px',
              }}
            >
              <div className="w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 font-montserrat">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-open-sans">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


