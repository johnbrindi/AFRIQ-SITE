import Link from 'next/link';
import { University } from '@/types';

export default function UniversityCard({ uni }: { uni: University }) {
  return (
    <Link href={`/university/${uni.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-brand-border overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-brand-purple hover:shadow-[0_4px_16px_rgba(75,29,121,0.12)]">
        
        {/* Image */}
        <div className="relative">
          <img
            src={uni.img || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80'}
            alt={uni.name}
            className="w-full h-[160px] object-cover bg-brand-pale block"
          />

          {/* Region badge — solid, no blur */}
          {uni.reg && (
            <div className="absolute top-3 left-3 bg-brand-purple text-white text-[9px] font-bold px-2 py-1 rounded uppercase tracking-[0.5px]">
              {uni.reg}
            </div>
          )}

          {/* Schools count — solid dark */}
          <div className="absolute top-3 right-3 bg-[#111118] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {uni.schools.length} Schools
          </div>
        </div>

        {/* Body — 24px padding, 8px grid */}
        <div className="p-6">
          {/* Logo + name row */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-brand-border bg-brand-pale flex items-center justify-center shrink-0">
              {uni.logo ? (
                <img src={uni.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="font-bold text-brand-purple text-[9px] text-center leading-tight p-1">{uni.short}</span>
              )}
            </div>
            <h3 className="text-[14px] font-extrabold text-brand-slate leading-tight line-clamp-2">{uni.name}</h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-[11px] text-brand-muted mb-4">
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {uni.loc} · Est. {uni.est}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-brand-border">
            <span className="text-[11.5px] font-semibold text-brand-purple">
              {uni.schools.length} Faculties & Schools
            </span>
            <span className="text-brand-purple text-[13px] font-bold">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
