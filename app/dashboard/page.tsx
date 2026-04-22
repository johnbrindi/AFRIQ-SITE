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
      <div className="bg-brand-purple py-10 px-4 md:px-[var(--px)]">
        <div className="max-w-brand-portal mx-auto">
          <div className="text-[13px] font-medium text-white/70 mb-2">Welcome to your Portal</div>
          <h1 className="font-serif text-[clamp(24px,3vw,34px)] font-black text-white mb-2 leading-tight">
            Select a University
          </h1>
          <p className="text-[14px] text-white/70">Browse available state universities and start your application process.</p>
        </div>
      </div>
      
      <UniversityGrid universities={universities as any} />
    </main>
  );
}
