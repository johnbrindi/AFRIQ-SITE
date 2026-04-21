import Link from 'next/link';
import { University } from '@/types';

export default function UniversityCard({ uni }: { uni: University }) {
  return (
    <Link href={`/university/${uni.id}`} className="block group">
      <div className="bg-white rounded-2xl border-[1.5px] border-brand-border overflow-hidden transition-all duration-300 relative hover:-translate-y-1.5 hover:border-brand-purple/40 hover:shadow-card">
        <div className="relative">
          <img
            src={uni.img || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80'}
            alt={uni.name}
            className="w-full h-[175px] object-cover bg-brand-pale block"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0219]/60 to-transparent pointer-events-none" />

          {/* Logo badge */}
          <div className="absolute bottom-2.5 left-3 w-[38px] h-[38px] bg-white rounded-lg overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.2)] border-[1.5px] border-white/90 flex items-center justify-center">
            {uni.logo ? (
              <img src={uni.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-brand-pale flex items-center justify-center font-bold text-brand-purple text-[9px] text-center leading-tight p-1">{uni.short}</div>
            )}
          </div>

          {/* Region badge — top left */}
          {uni.reg && (
            <div className="absolute top-2.5 left-2.5 bg-brand-purple/85 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-[0.5px]">
              {uni.reg} Region
            </div>
          )}

          {/* School count — top right */}
          <div className="absolute top-2.5 right-2.5 bg-black/55 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
            {uni.schools.length} Schools
          </div>
        </div>

        <div className="p-4 px-5">
          <h3 className="text-[15px] font-extrabold text-brand-slate mb-0.5 leading-tight line-clamp-1">{uni.name}</h3>
          <div className="text-[11px] text-brand-muted mb-2 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {uni.loc} · Est. {uni.est}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-brand-border">
            <div className="text-[11.5px] font-semibold text-brand-purple">
              {uni.schools.length} Schools &amp; Faculties
              <span className="ml-1 text-brand-purple">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

