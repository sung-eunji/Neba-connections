import Header from '@/components/Header';
import Section1 from '@/components/Section1';
import Section2 from '@/components/Section2';
import Section3 from '@/components/Section3';
import Section4 from '@/components/Section4';
import Section5 from '@/components/Section5';
import Section6 from '@/components/Section6';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Section6 />
      {/* 여기에 섹션 7-11이 추가될 예정입니다 */}
      <Footer />
    </main>
  );
}
