import { prisma } from '@/lib/db';
import UniversityGrid from '@/components/portal/UniversityGrid';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const universities = await prisma.university.findMany({
    include: {
      schools: true,
    },
    orderBy: {
      id: 'asc',
    },
  });

  const leadCount = await (prisma as any).studentLead.count().catch(() => 0) as number;

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

      {/* Admin: Student Leads section */}
      <div className="max-w-brand-portal mx-auto px-4 md:px-[var(--px)] py-8">
        <div className="bg-white rounded-2xl border-[1.5px] border-brand-border overflow-hidden">
          <div className="bg-brand-pale border-b border-brand-border px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-[14px] font-extrabold text-brand-slate">Student Leads</h2>
                <p className="text-[11.5px] text-brand-muted">{leadCount} {leadCount === 1 ? 'enquiry' : 'enquiries'} received via /apply</p>
              </div>
            </div>
            <Link
              href="/dashboard/leads"
              className="text-[12.5px] font-bold text-white bg-brand-purple px-4 py-2.5 rounded-xl hover:bg-brand-purple2 transition-colors flex items-center gap-1.5"
            >
              View All Leads
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="px-6 py-4 text-[12.5px] text-brand-muted">
            Students who submitted enquiries through the public <strong>/apply</strong> page. Visit the full leads page to search, paginate, and export as CSV.
          </div>
        </div>
      </div>
    </main>
  );
}

