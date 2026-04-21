import Link from 'next/link';

const footerLinks = {
  universities: [
    { label: 'State Universities', href: '#explore' },
    { label: 'Private Universities', href: '#' },
    { label: 'Grandes Écoles', href: '#' },
    { label: 'All Programmes', href: '#' },
  ],
  apply: [
    { label: 'How to Apply', href: '/auth' },
    { label: 'Requirements', href: '#' },
    { label: 'Fees & Funding', href: '#' },
    { label: 'Deadlines', href: '#' },
  ],
  support: [
    { label: 'Find a Center', href: '#' },
    { label: 'FAQ', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'About AFRIQ', href: '#' },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="bg-[#0d0d14] pt-20 pb-8 px-4 md:px-[var(--px)]">
      <div className="max-w-brand-portal mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[2.2fr_1fr_1fr_1fr] gap-12 mb-14">
          {/* Brand Column */}
          <div>
            <div className="font-black text-[22px] text-white tracking-tight mb-3">AFRIQ</div>
            <p className="text-[12.5px] text-white/45 leading-[1.75] max-w-[260px]">
              Connecting Cameroonian students to quality higher education across all 10 regions.
            </p>
          </div>

          {/* Universities */}
          <div>
            <div className="text-[10px] font-bold tracking-[1.8px] uppercase text-white/60 mb-4">
              Universities
            </div>
            {footerLinks.universities.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-[13px] text-white/45 hover:text-brand-gold2 mb-3 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Apply */}
          <div>
            <div className="text-[10px] font-bold tracking-[1.8px] uppercase text-white/60 mb-4">
              Apply
            </div>
            {footerLinks.apply.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-[13px] text-white/45 hover:text-brand-gold2 mb-3 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <div className="text-[10px] font-bold tracking-[1.8px] uppercase text-white/60 mb-4">
              Support
            </div>
            {footerLinks.support.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-[13px] text-white/45 hover:text-brand-gold2 mb-3 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.07] pt-6 flex justify-between items-center flex-wrap gap-3">
          <div className="text-[11.5px] text-white/25">
            &copy; {new Date().getFullYear()} AFRIQ University Portal. All rights reserved.
          </div>
          <div className="text-[11.5px] text-white/25 italic">
            Built for Cameroon&apos;s students.
          </div>
        </div>
      </div>
    </footer>
  );
}

