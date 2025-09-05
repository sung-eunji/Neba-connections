'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function Section10() {
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

  const teamMembers = [
    {
      name: 'Juanita Morgan',
      role: 'Operations',
      image: '/profiles/juanita.png',
      delay: '0.2s',
    },
    {
      name: 'EUN JI SUNG',
      role: 'Supplier Relations & Asian Market',
      image: '/profiles/eunji.png',
      delay: '0.4s',
    },
    {
      name: 'Christopher Ikembasi',
      role: 'Customer Relations & Partnerships',
      image: '/profiles/chris.png',
      delay: '0.6s',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-16 px-4 bg-gray-50"
    >
      <div className="text-start mb-36 pl-10">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 font-montserrat">
          OUR TEAM
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl font-open-sans">
          EU DISTRIBUTION TEAM
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`text-center transition-all duration-1000 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ transitionDelay: member.delay }}
            >
              {/* 프로필 이미지 */}
              <div className="relative mb-6">
                <div className="w-64 h-80 mx-auto rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={256}
                    height={320}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 이름과 역할 */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-montserrat">
                  {member.name}
                </h3>
                <p className="text-gray-600 font-open-sans">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
