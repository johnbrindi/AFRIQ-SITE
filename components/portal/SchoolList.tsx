'use client';

import { useRouter } from 'next/navigation';
import { School } from '@/types';
import SchoolIcon from '@/components/ui/SchoolIcon';

export default function SchoolList({ universityId, schools }: { universityId: number, schools: School[] }) {
  const router = useRouter();

  const handleSelect = (index: number) => {
    // In the new route structure, we don't use indices in the URL, but the original used it.
    // For Next.js we can pass state, but the simplest is a direct URL.
    // However, the requested path was /university/[id]/department
    // We can store the selected school in Zustand before navigating.
    // Since Zustand is a Client boundary, we should import the store.
    // To save time and keep it simple, we will just navigate to the departments page with a query param.
    router.push(`/university/${universityId}/department?schoolIndex=${index}`);
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-[16px] font-extrabold text-brand-slate">Professional Schools</h2>
        <span className="text-[13px] font-medium text-brand-muted">({schools.length})</span>
      </div>
      
      <div className="flex flex-col gap-2.5">
        {schools.map((school, index) => (
          <div 
            key={index}
            onClick={() => handleSelect(index)}
            className="bg-white border-[1.5px] border-brand-border rounded-xl p-3.5 px-4 flex items-center gap-3.5 cursor-pointer transition-all duration-200 hover:border-brand-purple3 hover:bg-brand-pale hover:translate-x-1"
          >
            <div className="w-[38px] h-[38px] bg-brand-pale rounded-lg flex items-center justify-center text-brand-purple shrink-0 transition-all duration-200">
              <SchoolIcon type={school.i || 'edu'} className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold text-brand-slate mb-0.5 truncate">{school.n}</div>
              <div className="text-[11px] text-brand-muted truncate">{school.t}</div>
            </div>
            <div className="shrink-0 w-7 h-7 bg-brand-bg rounded-full flex items-center justify-center text-brand-muted transition-all duration-200 group-hover:bg-brand-purple group-hover:text-white">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
