import Link from 'next/link';
import { University } from '@/types';

export default function DetailHero({ uni }: { uni: University }) {
  return (
    <div className="relative h-[380px] overflow-hidden group">
      <img 
        src={uni.img || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1800&q=80'} 
        alt={uni.name} 
        className="w-full h-full object-cover brightness-[0.4] transition-transform duration-[6s] ease-in-out group-hover:scale-[1.04]" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0219]/90 via-[#0a0219]/35 to-transparent pointer-events-none" />
      
      <Link 
        href="/dashboard" 
        className="absolute top-6 left-4 md:left-[var(--px)] flex items-center gap-[7px] text-[12.5px] font-semibold text-white/85 bg-white/10 backdrop-blur-[10px] border border-white/20 px-3.5 py-1.5 rounded-lg transition-colors hover:bg-white/20"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Back to Dashboard
      </Link>

      <div className="absolute bottom-0 left-0 right-0 p-8 md:px-[var(--px)]">
        <div className="flex items-end gap-4">
          <div className="w-[60px] h-[60px] bg-white rounded-xl overflow-hidden shrink-0 border-2 border-white/70 shadow-[0_4px_20px_rgba(0,0,0,0.3)] flex items-center justify-center mb-1">
            {uni.logo ? (
              <img src={uni.logo} alt="Logo" className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full bg-brand-pale flex items-center justify-center font-bold text-brand-purple">{uni.short}</div>
            )}
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 bg-brand-gold/20 border border-brand-gold/40 text-brand-gold2 text-[10.5px] font-bold tracking-[1.5px] uppercase px-3 py-1 rounded-full mb-3">
              {uni.tag}
            </div>
            <h1 className="font-serif text-[clamp(28px,4vw,46px)] font-black text-white tracking-[-1px] mb-2 leading-[1.1]">
              {uni.name}
            </h1>
            <div className="text-[14px] text-white/65 flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              {uni.loc}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
