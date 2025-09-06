'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Section6() {
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

  // 아이콘: 12, 2, 4, 6, 8, 10시  (SVG 기준 각도 보정 완료)
  const competitivenessItems = [
    {
      title: 'Inventory Management',
      description: 'Pre-order & fast replenishment',
      icon: '/section6/headphone.png',
      color: 'bg-blue-500',
      angle: 270,
      labelPos: 'top',
      delay: '0.2s',
    },
    {
      title: 'Quality',
      description: 'Strict in-house QC, Korea & China',
      icon: '/section6/coinpig.png',
      color: 'bg-sky-400',
      angle: 320,
      labelPos: 'right',
      delay: '0.4s',
    },
    {
      title: 'Product Development',
      description: 'Seasonal trend launches',
      icon: '/section6/pizza.png',
      color: 'bg-teal-500',
      angle: 30,
      labelPos: 'right',
      delay: '0.6s',
    },
    {
      title: 'Customer Management',
      description: 'Assigned reps, transparent support',
      icon: '/section6/docker.png',
      color: 'bg-green-700',
      angle: 90,
      labelPos: 'bottom',
      delay: '0.8s',
    },
    {
      title: 'Delivery & Logistics',
      description: 'Rapid fulfillment and adaptive shipping solutions',
      icon: '/section6/wallet.png',
      color: 'bg-green-500',
      angle: 150,
      labelPos: 'left',
      delay: '1.0s',
    },
    {
      title: 'Sustainability & CSR Readiness',
      description:
        'Eco-fabrics, ethical production, certifications in progress',
      icon: '/section6/bicycle.png',
      color: 'bg-green-400',
      angle: 210,
      labelPos: 'left',
      delay: '1.2s',
    },
  ] as const;

  const radius = 200;
  const C = 2 * Math.PI * radius; // 원 둘레

  const labelPosToClass = (pos: 'top' | 'right' | 'bottom' | 'left') => {
    switch (pos) {
      case 'top':
        return 'absolute bottom-20 left-1/2 -translate-x-1/2';
      case 'right':
        return 'absolute left-20 top-1/2 -translate-y-1/2';
      case 'bottom':
        return 'absolute top-20 left-1/2 -translate-x-1/2';
      case 'left':
        return 'absolute right-20 top-1/2 -translate-y-1/2';
    }
  };

  // 텍스트 정렬 클래스
  const labelTextAlign = (pos: 'top' | 'right' | 'bottom' | 'left') =>
    pos === 'right'
      ? 'text-left'
      : pos === 'left'
      ? 'text-right'
      : 'text-center';

  // 화살표 색상 (원하는 팔레트로 바꿔도 됨)
  const arrowColors = [
    '#60A5FA',
    '#38BDF8',
    '#2DD4BF',
    '#34D399',
    '#10B981',
    '#86EFAC',
  ];

  // 각도 → 라디안
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-16 pb-[30rem] px-4 bg-white snap-start"
    >
      <div className="text-start mb-[30rem] pl-10">
        <div className="text-4xl md:text-5xl lg:text-6xl font-700 text-gray-900 mb-4 font-montserrat">
          Competitiveness
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative flex justify-center items-center">
          {/* 배경 그라데이션 원 */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-green-100 to-blue-100 opacity-50" />
          <div className="absolute w-[150px] h-[150px] rounded-full bg-white shadow-md " />
          {/* 단일 원 + 그려지는 애니메이션 */}
          <svg className="absolute w-[500px] h-[500px]" aria-hidden>
            {/* 그려지는 원 */}
            <circle
              cx="250"
              cy="250"
              r={radius}
              fill="none"
              stroke="#D1D5DB"
              strokeWidth="2"
              strokeLinecap="round"
              style={{
                strokeDasharray: C,
                strokeDashoffset: isVisible ? 0 : C,
                transition: 'stroke-dashoffset 1.8s ease-out 0.2s',
              }}
            />

            {/* --- 원 위 삼각형 화살표 (시계방향, 다음 아이콘을 향함) --- */}
            {competitivenessItems.map((item, i) => {
              const next =
                competitivenessItems[(i + 1) % competitivenessItems.length];

              // 시계방향 중간각
              const delta = (next.angle - item.angle + 360) % 360;
              const midDeg = (item.angle + delta / 2) % 360;
              const θ = (midDeg * Math.PI) / 180;

              // 접선(시계방향, 각 증가 방향) 단위벡터 t = (-sinθ, cosθ)
              const tx = -Math.sin(θ);
              const ty = Math.cos(θ);

              // t의 법선(좌/우로 폭 주기): n = (cosθ, sinθ)  → 반지름 방향
              const nx = Math.cos(θ);
              const ny = Math.sin(θ);

              // 삼각형 크기
              const tipLen = 0; // 꼭짓점은 정확히 선 위 (0이면 정확히 r에서)
              const baseBack = 20; // 밑변이 뒤로 물러나는 길이(접선 방향 반대)
              const halfW = 10; // 밑변 반폭

              const cx = 250,
                cy = 250;

              // 꼭짓점: 원 위(선 위)
              const tipX = cx + (radius + tipLen) * Math.cos(θ);
              const tipY = cy + (radius + tipLen) * Math.sin(θ);

              // 밑변 중심: 접선 반대 방향으로 baseBack 만큼
              const baseCX = tipX - tx * baseBack;
              const baseCY = tipY - ty * baseBack;

              // 밑변 좌/우 점: 법선 방향으로 halfW
              const p1x = baseCX + nx * halfW;
              const p1y = baseCY + ny * halfW;
              const p2x = baseCX - nx * halfW;
              const p2y = baseCY - ny * halfW;

              const points = `${tipX},${tipY} ${p1x},${p1y} ${p2x},${p2y}`;

              // 색상 팔레트(원하는 색으로 교체 OK)
              const arrowColors = [
                '#60A5FA',
                '#38BDF8',
                '#2DD4BF',
                '#34D399',
                '#10B981',
                '#86EFAC',
              ];
              return (
                <polygon
                  key={`arrow-${i}`}
                  points={points}
                  fill={arrowColors[i % arrowColors.length]}
                  className={`transition-opacity duration-700 ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${0.35 + i * 0.12}s` }}
                  pointerEvents="none"
                />
              );
            })}
          </svg>

          {/* 아이콘 + 텍스트 카드 */}
          {competitivenessItems.map((item, index) => {
            const x = radius * Math.cos(toRad(item.angle));
            const y = radius * Math.sin(toRad(item.angle));

            return (
              <div
                key={index}
                className={`absolute z-10 transition-all duration-1000 ease-out ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                }`}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                  transitionDelay: item.delay,
                }}
              >
                <div className="relative">
                  <div
                    className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={32}
                      height={32}
                      className="w-8 h-8"
                    />
                  </div>

                  <div
                    className={`${labelPosToClass(item.labelPos)} w-70  p-8 `}
                  >
                    <h3
                      className={`text-sm font-bold text-gray-800 mb-1 font-montserrat ${labelTextAlign(
                        item.labelPos
                      )}`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-[0.9rem] text-gray-600 font-300 font-open-sans ${labelTextAlign(
                        item.labelPos
                      )}`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
