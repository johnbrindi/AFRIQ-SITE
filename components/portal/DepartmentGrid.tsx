'use client';

import { useRouter } from 'next/navigation';
import { School } from '@/types';

interface DepartmentGridProps {
  universityId: number;
  schoolIndex: number;
  school: School;
}

export default function DepartmentGrid({ universityId, schoolIndex, school }: DepartmentGridProps) {
  const router = useRouter();
  const parsedDept = typeof school.departments === 'string' ? JSON.parse(school.departments) : school.departments;
  const departments = Array.isArray(parsedDept) ? parsedDept : (parsedDept ? [parsedDept] : []);

  const handleSelect = (deptIndex: number) => {
    router.push(`/university/${universityId}/apply?schoolIndex=${schoolIndex}&deptIndex=${deptIndex}`);
  };

  return (
    <div className="max-w-brand-portal mx-auto px-4 md:px-[var(--px)] py-10 pb-20">
      <div className="mb-7">
        <h1 className="font-serif text-[clamp(22px,3vw,30px)] font-black text-brand-slate my-2">
          Select your Department
        </h1>
        <p className="text-[14px] text-brand-mid leading-[1.6]">
          Choose the program you wish to apply for under {school.n}.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5">
        {departments.map((dept: string, index: number) => (
          <div 
            key={index}
            onClick={() => handleSelect(index)}
            className="flex items-center gap-3.5 bg-white border-[1.5px] border-brand-border rounded-xl p-[18px] px-5 cursor-pointer text-left transition-all duration-200 relative overflow-hidden group hover:border-brand-purple hover:shadow-[0_8px_28px_rgba(75,29,121,0.12)] hover:-translate-y-0.5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            <div className="text-[11px] font-extrabold text-brand-purple3 tracking-[0.5px] min-w-[22px]">
              {(index + 1).toString().padStart(2, '0')}
            </div>
            <div className="flex-1 text-[13px] font-semibold text-brand-slate leading-[1.4] z-10">
              {dept}
            </div>
            <div className="text-brand-purple shrink-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100 z-10">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
