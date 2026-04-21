import { prisma } from '@/lib/db';
import UniversityGrid from '@/components/portal/UniversityGrid';

export default async function DashboardPage() {
  const universities = await prisma.university.findMany({
    include: {
      schools: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  return (
    <main className="min-h-screen pt-[var(--nav-h)] bg-brand-bg">
      <div className="bg-gradient-to-br from-brand-purple to-brand-purple2 py-11 px-4 md:px-[var(--px)] relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-[360px] h-[360px] rounded-full border border-white/10 pointer-events-none" />
        <div className="max-w-brand-portal mx-auto relative z-10">
          <div className="text-[13px] font-medium text-white/60 mb-1.5">Welcome to your Portal</div>
          <h1 className="font-serif text-[clamp(26px,3vw,34px)] font-black text-white mb-1.5 leading-tight">
            Select a University
          </h1>
          <p className="text-[14px] text-white/65">Browse available state universities and start your application process.</p>
        </div>
      </div>
      
      <UniversityGrid universities={universities as any} />
    </main>
  );
}
