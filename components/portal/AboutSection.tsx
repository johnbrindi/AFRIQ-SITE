import Link from 'next/link';

export default function AboutSection() {
  const features = [
    {
      title: 'Real-Time Admissions Data',
      description: 'Updated directly from official university sources each academic year.',
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
    },
    {
      title: 'All Faculties & Schools',
      description: 'Browse every Grande École, Faculty, and Institute across all universities.',
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
    },
    {
      title: 'Instant PDF Application',
      description: 'Generate a complete, print-ready application form in minutes — no queues.',
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    },
    {
      title: 'Mobile-First Design',
      description: 'Works seamlessly on any smartphone, tablet, or desktop — no app required.',
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
    }
  ];

  const stats = [
    { label: 'State Universities', value: '11' },
    { label: 'Regions Covered', value: '10' },
    { label: 'Programmes Listed', value: '900+' },
    { label: 'Platform Access', value: 'Free' }
  ];

  const badges = [
    {
      title: 'Official University Data',
      description: 'Sourced from the Ministry of Higher Education, Cameroon',
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    },
    {
      title: 'Anglophone Universities First',
      description: 'Bamenda & Buea prioritized for NW/SW region students',
      icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path></svg>
    }
  ];

  return (
    <section className="py-24 px-4 md:px-[var(--px)] bg-brand-purple text-white relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-brand-portal mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[2px] uppercase text-brand-gold2 mb-5">
            <div className="w-6 h-0.5 bg-brand-gold2 rounded-sm" />
            About the Platform
          </div>
          <h2 className="font-serif text-[clamp(32px,4vw,48px)] font-black text-white tracking-tight mb-6 leading-[1.1]">
            What is AFRIQ?
          </h2>
          <p className="text-[15.5px] text-white/70 leading-relaxed mb-10 max-w-[500px]">
            AFRIQ is Cameroon's centralized university application portal — designed to simplify the journey from secondary school to higher education. Built for students across all 10 regions, AFRIQ aggregates accurate admissions data from all 11 state universities into one modern, mobile-friendly platform.
          </p>

          <div className="space-y-7">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-brand-gold2/10 border border-brand-gold2/20 flex items-center justify-center text-brand-gold2 shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white mb-1">{f.title}</h4>
                  <p className="text-[13px] text-white/50 leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link href="/auth" className="text-[13px] font-bold text-brand-purple bg-white border-none px-8 py-3.5 rounded-lg hover:shadow-card-lg hover:-translate-y-0.5 transition-all inline-flex items-center gap-2">
              Start Your Application
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {stats.map((s, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors">
              <div className="text-[36px] font-serif font-black text-brand-gold2 mb-1">{s.value}</div>
              <div className="text-[11px] font-bold text-white/50 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
          
          {badges.map((b, i) => (
            <div key={i} className="col-span-1 sm:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex gap-4 items-center hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-gold2/10 flex items-center justify-center text-brand-gold2 shrink-0">
                {b.icon}
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-white mb-0.5">{b.title}</h4>
                <p className="text-[12px] text-white/40">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
