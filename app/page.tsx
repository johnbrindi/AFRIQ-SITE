import LandingHero from '@/components/portal/LandingHero';
import StepsSection from '@/components/portal/StepsSection';
import AboutSection from '@/components/portal/AboutSection';
import LandingFooter from '@/components/portal/LandingFooter';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import UniversityCard from '@/components/portal/UniversityCard';

export const revalidate = 3600;

export default async function Home() {
  const universities = await prisma.university.findMany({
    include: { schools: true },
    take: 8,
  });

  return (
    <main className="min-h-screen bg-brand-bg">
      <LandingHero />
      
      {/* State Universities Section */}
      <section id="explore" className="py-24 px-4 md:px-[var(--px)] bg-white">
        <div className="max-w-brand-portal mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[2px] uppercase text-brand-purple mb-3">
              <div className="w-6 h-0.5 bg-brand-purple rounded-sm" />
              Our Universities
              <div className="w-6 h-0.5 bg-brand-purple rounded-sm" />
            </div>
            <h2 className="font-serif text-[clamp(32px,4vw,48px)] font-black text-brand-slate tracking-tight mb-4 leading-tight">
              11 State Universities Across Cameroon
            </h2>
            <p className="text-[15px] text-brand-muted leading-relaxed max-w-[580px] mx-auto">
              Listed by proximity to the Anglophone regions — from Bamenda outward across the country.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {universities.map((uni) => (
              <UniversityCard key={uni.id} uni={uni as any} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/dashboard" className="text-[13px] font-bold text-brand-purple border-[1.5px] border-brand-border bg-white px-10 py-3.5 rounded-xl hover:border-brand-purple hover:bg-brand-pale transition-all inline-flex items-center gap-2 shadow-sm">
              Sign Up to Explore All Universities
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </Link>
          </div>
        </div>
      </section>

      <StepsSection />
      <AboutSection />
      <LandingFooter />
    </main>
  );
}

