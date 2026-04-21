import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import ApplyForm from '@/components/portal/ApplyForm';
import Link from 'next/link';

export default async function ApplyPage({ 
  params, 
  searchParams 
}: { 
  params: { id: string },
  searchParams: { schoolIndex?: string, deptIndex?: string }
}) {
  const universityId = parseInt(params.id);
  const schoolIndex = searchParams.schoolIndex ? parseInt(searchParams.schoolIndex) : NaN;
  const deptIndex = searchParams.deptIndex ? parseInt(searchParams.deptIndex) : NaN;
  
  if (isNaN(universityId) || isNaN(schoolIndex) || isNaN(deptIndex)) {
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
  const parsedDept = typeof school.departments === 'string' ? JSON.parse(school.departments) : school.departments;
  const departments = Array.isArray(parsedDept) ? parsedDept : (parsedDept ? [parsedDept] : []);
  
  if (!departments[deptIndex]) {
    notFound();
  }

  const department = departments[deptIndex];

  return (
    <main className="min-h-screen pt-[var(--nav-h)] bg-white">
      <div className="bg-brand-purple py-8 px-4 md:px-[var(--px)]">
        <div className="max-w-brand-portal mx-auto">
          <div className="text-[12px] text-white/55 mb-2 flex items-center gap-1.5 flex-wrap">
            <Link href={`/university/${universityId}`} className="hover:text-white/85 transition-colors">{university.short}</Link>
            <span>/</span>
            <Link href={`/university/${universityId}/department?schoolIndex=${schoolIndex}`} className="hover:text-white/85 transition-colors">{school.acr || 'School'}</Link>
            <span>/</span>
            <span className="text-white/85">{department}</span>
          </div>
          <h1 className="font-serif text-[clamp(20px,3vw,28px)] font-black text-white flex items-center flex-wrap gap-2">
            Application Form
            <em className="text-[16px] font-semibold opacity-70 font-sans not-italic ml-1.5">({school.acr})</em>
          </h1>
          <p className="text-[13px] text-white/60 mt-1">Please fill in all details accurately as they will appear on your final PDF.</p>
        </div>
      </div>

      <ApplyForm university={university as any} school={school as any} department={department} />
    </main>
  );
}
