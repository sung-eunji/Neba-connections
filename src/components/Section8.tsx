'use client';

import { useEffect, useRef, useState } from 'react';

type Item = {
  title: string;
  description: string;
  row: 'top' | 'bottom';
  idx: number; // 0..4 (타임라인 점 인덱스)
};

export default function Section8() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setIsVisible(true)),
      { threshold: 0.15 }
    );
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const items: Item[] = [
    {
      idx: 0,
      row: 'top',
      title: 'Dedicated CS teams',
      description:
        'Our customer service teams provide transparent communication and proactive support, ensuring smooth order and delivery processes.',
    },
    {
      idx: 2,
      row: 'top',
      title: '10+ new products every season',
      description:
        'Neba introduces a steady stream of new denim and fashion-forward items every season, keeping assortments fresh and aligned with global trends.',
    },
    {
      idx: 4,
      row: 'top',
      title: 'Efficient logistics solutions',
      description:
        'We leverage optimized shipping routes and warehouses to provide reliable, timely deliveries across markets.',
    },
    {
      idx: 1,
      row: 'bottom',
      title: 'Private brand support',
      description:
        'We collaborate with clients to develop exclusive PB collections, enabling them to strengthen brand identity and customer loyalty.',
    },
    {
      idx: 3,
      row: 'bottom',
      title: 'Flexible production scaling',
      description:
        'Our integrated production network adapts quickly to demand shifts, scaling output seamlessly to meet client growth.',
    },
  ];

  // 타임라인 점이 5개라 0,25,50,75,100%에 놓이게 계산
  const leftPct = (idx: number) => `${(idx / 4) * 100}%`;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100vh] py-16 px-4 bg-white pb-[20rem] snap-start"
    >
      <div className="text-start mb-[20rem] pl-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 font-montserrat">
          Customer Action Plan
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl font-open-sans">
          From concept to delivery, N.e.b.a. supports every step of the customer
          journey.
        </p>
      </div>

      {/* 데스크톱 레이아웃 */}
      <div className="hidden sm:block max-w-3xl mx-auto relative px-12">
        {/* 타임라인 베이스 */}
        <div className="relative h-1 top-8 right-10 bg-gray-300/80 rounded-full">
          {/* 진행 애니메이션 바 */}
          <div
            className={`absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-[width] duration-[1800ms] ease-out ${
              isVisible ? 'w-[48rem]' : 'w-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          />
        </div>

        {/* 점 5개 */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`dot-${i}`}
            className={`absolute w-5 h-5 rounded-full bg-blue-600 shadow-sm transition-all duration-700 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
            style={{
              left: leftPct(i),
              top: '36px', // 타임라인 선과 같은 높이
              transform: 'translate(-50%, -50%)',
              transitionDelay: `${500 + i * 120}ms`,
            }}
            aria-hidden
          />
        ))}

        {/* 카드들 (말풍선 꼬리 포함) */}
        {items.map((item, k) => {
          const isTop = item.row === 'top';
          return (
            <div
              key={`${item.idx}-${item.title}`}
              className={`absolute w-[160px] h-[30rem] sm:w-[180px] md:w-[200px] lg:w-[220px] max-w-[70vw] sm:max-w-[25vw] md:max-w-[20vw] lg:max-w-[18vw] transition-all duration-700 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : isTop
                  ? 'opacity-0 -translate-y-6'
                  : 'opacity-0 translate-y-6'
              }`}
              style={{
                left: leftPct(item.idx),
                top: isTop ? 'calc(50% - 140px)' : 'calc(50% + 60px)',
                transform: 'translateX(-50%)',
                transitionDelay: `${700 + k * 120}ms`,
              }}
            >
              {/* 카드 본체 */}
              <div className="relative bg-white border border-gray-200 rounded-xl shadow-lg p-1.5 sm:p-2 md:p-2.5 lg:p-3 h-[9rem]">
                <h3 className="text-xs font-bold text-gray-900 mb-1 font-montserrat">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 leading-tight font-open-sans">
                  {item.description}
                </p>

                {/* 말풍선 꼬리 (삼각형) */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 sm:border-l-8 border-r-6 sm:border-r-8 ${
                    isTop
                      ? 'border-t-6 sm:border-t-8 border-t-gray-200 -bottom-2 border-l-transparent border-r-transparent'
                      : 'border-b-6 sm:border-b-8 border-b-gray-200 -top-2 border-l-transparent border-r-transparent'
                  }`}
                />
                {/* 말풍선 꼬리 외곽선 (살짝 큰 회색으로 아래층) */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] sm:border-l-[9px] border-r-[7px] sm:border-r-[9px] ${
                    isTop
                      ? 'border-t-[7px] sm:border-t-[9px] border-t-gray-200 -bottom-[8px] sm:-bottom-[10px] border-l-transparent border-r-transparent'
                      : 'border-b-[7px] sm:border-b-[9px] border-b-gray-200 -top-[8px] sm:-top-[10px] border-l-transparent border-r-transparent'
                  }`}
                  aria-hidden
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 모바일 레이아웃 */}
      <div className="sm:hidden max-w-3xl mx-auto px-2">
        <div className="relative pl-6">
          {/* 수직 라인 */}
          <div className="absolute left-[1.35rem] top-3 bottom-0 w-1 bg-gray-200 rounded-full" />
          <div
            className={`absolute top-3 left-[1.35rem] w-1 bg-blue-600 rounded-full transition-[height] duration-[1800ms] ease-out ${
              isVisible ? 'h-full' : 'h-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          />
          {items
            .sort((a, b) => a.idx - b.idx)
            .map((item, i) => (
              <div
                key={`m-${item.idx}`}
                className={`relative mb-8 transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                {/* 점 */}
                <div className="absolute left-0  top-3 w-6 h-6 rounded-full bg-blue-600 -translate-x-1/2" />
                {/* 카드 */}
                <div className="ml-6 bg-white border border-gray-200 rounded-xl shadow-md p-5 sm:w-[22rem] ">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
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
