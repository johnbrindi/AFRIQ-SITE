import UniversityGrid from '@/components/portal/UniversityGrid';
import { getCachedUniversities } from '@/lib/queries';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Always server-render — never statically cache (dashboard is user-specific)
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();

  // If no valid session, send to sign-in page
  if (!session?.user?.id) {
    redirect('/auth?callbackUrl=/dashboard');
  }

  const universities = await getCachedUniversities();

  return (
    <main className="min-h-screen pt-[var(--nav-h)] bg-brand-bg">
      <div className="bg-brand-purple py-10 px-4 md:px-[var(--px)]">
        <div className="max-w-brand-portal mx-auto">
          <div className="text-[13px] font-medium text-white/70 mb-2">Welcome to your Portal</div>
          <h1 className="font-serif text-[clamp(24px,3vw,34px)] font-black text-white mb-2 leading-tight">
            Select a University
          </h1>
          <p className="text-[14px] text-white/70">Browse available universities and start your application process.</p>
        </div>
      </div>

      <UniversityGrid universities={universities as any} />
    </main>
  );
}
