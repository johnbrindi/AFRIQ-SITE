export default function StepsSection() {
  const steps = [
    {
      id: '01',
      title: 'Explore Universities',
      description: 'Browse all 11 state universities, filtered by region, faculty type, or programme.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      )
    },
    {
      id: '02',
      title: 'Choose Your School',
      description: 'Select the faculty or grande école that matches your career ambitions.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
      )
    },
    {
      id: '03',
      title: 'Fill Your Application',
      description: 'Complete the 3-step form with personal info, qualifications, and fees checklist.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
      )
    },
    {
      id: '04',
      title: 'Download & Submit',
      description: 'Download your application PDF and visit the nearest AFRIQ certification center within 30 days.',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      )
    }
  ];

  return (
    <section className="py-20 px-4 md:px-[var(--px)] bg-white">
      <div className="max-w-brand-portal mx-auto">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[2px] uppercase text-brand-purple mb-3">
            <div className="w-6 h-0.5 bg-brand-purple rounded-sm" />
            Simple Process
          </div>
          <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] font-black text-brand-slate tracking-tight mb-3 leading-tight">
            Apply in 4 Easy Steps
          </h2>
          <p className="text-[14.5px] text-brand-muted leading-relaxed max-w-[420px]">
            From exploring universities to downloading your application — straightforward and fast.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.id} className="bg-white border-[1.5px] border-brand-border rounded-2xl p-7 relative group hover:border-brand-purple transition-all duration-300">
              <div className="text-[40px] font-black text-brand-purple/10 absolute top-4 right-6 group-hover:text-brand-purple/20 transition-colors">
                {step.id}
              </div>
              <div className="w-12 h-12 rounded-xl bg-brand-pale flex items-center justify-center text-brand-purple mb-6 group-hover:bg-brand-purple group-hover:text-white transition-all duration-300">
                {step.icon}
              </div>
              <h3 className="text-[16px] font-bold text-brand-slate mb-3">{step.title}</h3>
              <p className="text-[13px] text-brand-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
