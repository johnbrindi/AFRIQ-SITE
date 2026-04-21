import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import DetailHero from '@/components/portal/DetailHero';
import SchoolList from '@/components/portal/SchoolList';

export default async function UniversityDetailPage({ params }: { params: { id: string } }) {
  const universityId = parseInt(params.id);
  
  if (isNaN(universityId)) {
    notFound();
  }

  const university = await prisma.university.findUnique({
    where: { id: universityId },
    include: { schools: true },
  });

  if (!university) {
    notFound();
  }

  // Parse JSON fields from DB
  const facts = typeof university.facts === 'string' ? JSON.parse(university.facts) : (university.facts || {});
  const missions = typeof university.missions === 'string' ? JSON.parse(university.missions) : (university.missions || []);

  return (
    <main className="min-h-screen pt-[var(--nav-h)] bg-brand-bg pb-20">
      <DetailHero uni={university as any} />

      <div className="max-w-brand-portal mx-auto px-4 md:px-[var(--px)] mt-7">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-11 items-start">
          
          <div className="order-2 md:order-1">
            <div className="bg-white border-[1.5px] border-brand-border rounded-2xl p-7 mb-5.5">
              <h2 className="text-[15px] font-extrabold text-brand-slate mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                About the University
              </h2>
              <p className="text-[13.5px] text-brand-mid leading-[1.8]">{university.about}</p>
            </div>

            {missions && missions.length > 0 && (
              <div className="bg-brand-pale border-[1.5px] border-brand-border rounded-2xl p-6 mb-5.5">
                <h3 className="text-[13px] font-bold text-brand-purple mb-3 flex items-center gap-[7px]">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Core Missions
                </h3>
                <div className="flex flex-col gap-2">
                  {missions.map((mission: string, idx: number) => (
                    <div key={idx} className="flex gap-2.5 text-[13px] text-brand-mid leading-[1.6]">
                      <div className="w-[7px] h-[7px] rounded-full bg-brand-purple shrink-0 mt-1.5" />
                      {mission}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <SchoolList universityId={university.id} schools={university.schools as any[]} />
          </div>

          <div className="order-1 md:order-2 sticky top-[84px]">
            <div className="bg-white border-[1.5px] border-brand-border rounded-xl overflow-hidden mb-3.5">
              <div className="bg-brand-purple px-4 py-3 text-white text-[12.5px] font-bold flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Quick Facts
              </div>
              <div className="p-4">
                <div className="text-[13px] font-bold text-brand-purple mb-1">{university.city}</div>
                <div className="text-[12px] text-brand-muted mb-4 pb-4 border-b border-brand-border">{university.reg} Region</div>
                
                <div className="flex justify-between py-1.5 border-b border-brand-border text-[12.5px] last:border-b-0">
                  <span className="text-brand-muted">Established</span>
                  <span className="font-bold text-brand-slate text-[12px]">{university.est}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-brand-border text-[12.5px] last:border-b-0">
                  <span className="text-brand-muted">Type</span>
                  <span className="font-bold text-brand-slate text-[12px]">State University</span>
                </div>
                {facts && Object.entries(facts).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1.5 border-b border-brand-border text-[12.5px] last:border-b-0">
                    <span className="text-brand-muted">{key}</span>
                    <span className="font-bold text-brand-slate text-[12px] max-w-[150px] text-right">{val as string}</span>
                  </div>
                ))}
              </div>
            </div>
            <button disabled className="w-full text-[14px] font-bold text-white bg-brand-purple border-none p-3.5 rounded-lg transition-all flex items-center justify-center gap-2 mt-1 opacity-50 cursor-not-allowed">
              Select a School First
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
