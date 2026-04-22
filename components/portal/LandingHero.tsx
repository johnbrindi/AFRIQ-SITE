import Link from 'next/link';

export default function LandingHero() {
  return (
    <section className="min-h-screen relative flex items-center px-4 md:px-[var(--px)] overflow-hidden pt-[var(--nav-h)]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ backgroundImage: 'url("/afriq-images/afriq-cover-image.jpeg")' }}
      >
        <div className="absolute inset-0 bg-[#1a0b2e]/90 md:bg-gradient-to-r md:from-[#1a0b2e] md:via-[#1a0b2e]/95 md:to-transparent" />
      </div>
      
      {/* Decorative Circles from the design */}
      <div className="absolute rounded-full pointer-events-none z-10 border border-white/5 right-[-5%] top-[-10%] w-[600px] h-[600px]" />
      <div className="absolute rounded-full pointer-events-none z-10 border border-white/5 right-[5%] top-[0%] w-[450px] h-[450px]" />

      <div className="relative z-20 max-w-brand-portal mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold2 text-[10.5px] font-bold tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            2025 Applications Open
          </div>
          
          <h1 className="font-serif text-[clamp(34px,6vw,84px)] font-black text-white leading-[1.05] tracking-tight mb-6 sm:mb-8">
            Your University <br />
            <span className="text-brand-gold2 italic">Journey Starts</span> <br />
            Here.
          </h1>
          
          <p className="text-[15px] sm:text-[16px] text-white/70 leading-relaxed max-w-[500px] mb-8 sm:mb-10">
            AFRIQ connects Cameroonian students to all 11 state universities — browse every faculty, compare programmes, and apply in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12 sm:mb-16">
            <Link href="/auth" className="text-[14px] font-bold text-brand-purple bg-white border-none px-8 py-3.5 rounded-lg hover:shadow-card-lg hover:-translate-y-0.5 transition-all inline-flex items-center justify-center gap-2">
              Get Started Free
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
            <Link href="#explore" className="text-[14px] font-bold text-white bg-white/10 border-[1.5px] border-white/30 px-8 py-3.5 rounded-lg hover:bg-white/15 transition-all inline-flex items-center justify-center gap-2">
              Explore Universities
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 13 12 18 17 13" /><polyline points="7 6 12 11 17 6" /></svg>
            </Link>
          </div>

          <div className="flex gap-6 sm:gap-12 pt-8 border-t border-white/10">
            <div>
              <div className="font-serif text-[32px] font-black text-white mb-0.5">11</div>
              <div className="text-[10px] font-bold text-white/40 tracking-[1.5px] uppercase">Universities</div>
            </div>
            <div>
              <div className="font-serif text-[32px] font-black text-white mb-0.5">900+</div>
              <div className="text-[10px] font-bold text-white/40 tracking-[1.5px] uppercase">Programmes</div>
            </div>
            <div>
              <div className="font-serif text-[32px] font-black text-white mb-0.5">10</div>
              <div className="text-[10px] font-bold text-white/40 tracking-[1.5px] uppercase">Regions</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-4">
          {/* Card 1: Featured */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/10 transition-all duration-300 translate-x-4">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold2 shrink-0 border border-brand-gold/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-[1.5px] mb-1">Featured</div>
              <h4 className="text-[15px] font-bold text-white">University of Bamenda</h4>
              <p className="text-[12px] text-white/50">North West Region - Est. 2010</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">
              Open
            </div>
          </div>

          {/* Card 2: Top Programme */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/10 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold2 shrink-0 border border-brand-gold/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-[1.5px] mb-1">Top Programme</div>
              <h4 className="text-[15px] font-bold text-white">Medicine & Biomedical Sciences</h4>
              <p className="text-[12px] text-white/50">6 universities offering this</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-brand-gold/10 text-brand-gold2 text-[10px] font-bold border border-brand-gold/20">
              Popular
            </div>
          </div>

          {/* Card 3: Deadline */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/10 transition-all duration-300 translate-x-4">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold2 shrink-0 border border-brand-gold/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-[1.5px] mb-1">Key Deadline</div>
              <h4 className="text-[15px] font-bold text-white">August 31, 2025</h4>
              <p className="text-[12px] text-white/50">Most state universities</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
              Urgent
            </div>
          </div>

          {/* Card 4: Region */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/10 transition-all duration-300 translate-x-8">
            <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold2 shrink-0 border border-brand-gold/20">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div className="flex-1">
              <div className="text-[10px] font-bold text-white/30 uppercase tracking-[1.5px] mb-1">Both Regions</div>
              <h4 className="text-[15px] font-bold text-white">NW & SW Anglophone</h4>
              <p className="text-[12px] text-white/50">Bamenda · Buea · English</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">
              Priority
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

