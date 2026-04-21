export default function Ticker() {
  const items = [
    'University of Bamenda — North West Region',
    'University of Buea — South West Region',
    'University of Dschang — West Region',
    'University of Douala — Littoral Region',
    'AFRIQ — 11 State Universities, 1 Portal',
    'University of Ngaoundéré — Adamawa Region',
    'University of Maroua — Far North Region',
    'University of Garoua — North Region',
    'University of Yaoundé I — Sciences & Engineering',
    'University of Yaoundé II — Social Sciences',
  ];

  return (
    <div className="flex-1 overflow-hidden relative min-w-0" style={{ maskImage: 'linear-gradient(to right, transparent, black 50px, black calc(100% - 50px), transparent)' }}>
      <div className="flex whitespace-nowrap animate-tick hover:[animation-play-state:paused]">
        {/* Double the items for seamless loop */}
        {[...items, ...items].map((item, index) => (
          <div key={index} className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-brand-mid px-5 tracking-wide">
            <div className="w-1 h-1 rounded-full bg-brand-purple shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

