import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import DepartmentGrid from '@/components/portal/DepartmentGrid';
import Link from 'next/link';

export default async function DepartmentPage({ 
  params, 
  searchParams 
}: { 
  params: { id: string },
  searchParams: { schoolIndex?: string }
}) {
  const universityId = parseInt(params.id);
  const schoolIndex = searchParams.schoolIndex ? parseInt(searchParams.schoolIndex) : NaN;
  
  if (isNaN(universityId) || isNaN(schoolIndex)) {
    redirect(`/university/${params.id}`);
  }

  const university = await prisma.university.findUnique({
    where: { id: universityId },
    include: { schools: true },
  });

  if (!university || !university.schools[schoolIndex]) {
    notFound();
  }

  const school = university.schools[schoolIndex];

  return (
    <main className="min-h-screen pt-[var(--nav-h)] bg-brand-bg">
      <div className="bg-brand-pale border-b-2 border-brand-purple3 py-2.5 mb-1">
        <div className="max-w-brand-portal mx-auto px-4 md:px-[var(--px)] flex items-center gap-2.5 text-[13px] flex-wrap">
          <span className="text-brand-muted font-semibold">University:</span>
          <span className="text-brand-purple font-bold">{university.name}</span>
          <span className="text-brand-muted font-semibold ml-2">School:</span>
          <span className="text-brand-purple font-bold">{school.n}</span>
          
          <Link 
            href={`/university/${universityId}`} 
            className="ml-auto text-[11.5px] font-bold text-brand-mid bg-transparent border-[1.5px] border-brand-border rounded-md px-2.5 py-1 flex items-center gap-1 transition-colors hover:border-brand-purple hover:text-brand-purple"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            Change
          </Link>
        </div>
      </div>

      <DepartmentGrid 
        universityId={universityId} 
        schoolIndex={schoolIndex} 
        school={school as any} 
      />
    </main>
  );
}
