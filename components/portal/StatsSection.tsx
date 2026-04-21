export default function StatsSection() {
  const stats = [
    { label: 'Registered Students', value: '14K+' },
    { label: 'Applications Processed', value: '32K+' },
    { label: 'Success Rate', value: '98%' },
    { label: 'Active Universities', value: '11' },
  ];

  return (
    <section className="bg-brand-purple py-12 px-4 md:px-[var(--px)]">
      <div className="max-w-brand-portal mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-0">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`text-center px-5 ${
              i % 2 === 0 ? 'border-r border-white/10 md:border-r' : 'md:border-r border-white/10'
            } ${i === stats.length - 1 ? 'md:border-r-0 border-r-0' : ''}`}
          >
            <div className="font-serif text-[42px] font-bold text-brand-gold2 leading-none mb-1.5">{stat.value}</div>
            <div className="text-[10.5px] font-semibold text-white/60 tracking-[0.5px] uppercase">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
