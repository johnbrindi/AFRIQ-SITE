'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Ticker from '../ui/Ticker';

export default function TopBar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[900] h-[var(--nav-h)] bg-white border-b border-brand-border flex items-center px-4 md:px-[var(--px)] gap-3">

        {/* Logo — always visible */}
        <Link href="/" className="flex items-center gap-2 shrink-0 select-none">
          <div className="w-9 h-9 rounded-xl bg-brand-purple flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <span className="text-[18px] font-black text-brand-purple tracking-tight">AFRIQ</span>
        </Link>

        {/* Ticker — visible on all sizes, fills remaining space */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <Ticker />
        </div>

        {/* Desktop nav (sm and above) */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="text-[11px] font-bold text-brand-mid border border-brand-border rounded-md px-2.5 py-1.5 select-none">EN</div>
          {session ? (
            <>
              <Link href="/dashboard" className="text-[13px] font-semibold text-brand-purple border border-brand-purple px-4 py-2 rounded-lg hover:bg-brand-pale transition-colors inline-flex items-center gap-1.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Dashboard
              </Link>
              <div className="w-8 h-8 rounded-full bg-brand-pale border border-brand-border flex items-center justify-center text-brand-purple font-bold text-xs uppercase" title={session.user?.name || ''}>
                {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
              </div>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="text-[11px] font-bold text-brand-muted hover:text-red-500 uppercase tracking-wider">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-[13px] font-semibold text-brand-purple border border-brand-purple px-4 py-2 rounded-lg hover:bg-brand-pale transition-colors">
                Sign In
              </Link>
              <Link href="/auth" className="text-[13px] font-bold text-white bg-brand-purple px-5 py-2 rounded-lg hover:bg-brand-purple2 transition-colors inline-flex items-center gap-1.5">
                Apply Now
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger — only on xs screens */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex sm:hidden flex-col items-center justify-center gap-[5px] w-9 h-9 shrink-0"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className="block w-5 h-[2px] bg-brand-slate rounded" />
          <span className="block w-5 h-[2px] bg-brand-slate rounded" />
          <span className="block w-5 h-[2px] bg-brand-slate rounded" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="fixed top-[var(--nav-h)] left-0 right-0 z-[899] bg-white border-b border-brand-border px-4 py-4 flex flex-col gap-3 sm:hidden">
          {session ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="text-[14px] font-bold text-brand-purple border border-brand-purple px-4 py-3 rounded-xl text-center"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { signOut({ callbackUrl: '/' }); setMenuOpen(false); }}
                className="text-[13px] font-bold text-red-500 border border-red-200 px-4 py-3 rounded-xl"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="text-[14px] font-bold text-white bg-brand-purple px-4 py-3 rounded-xl text-center"
              >
                Apply Now — Free
              </Link>
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="text-[13px] font-semibold text-brand-purple border border-brand-purple px-4 py-3 rounded-xl text-center"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
