'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Ticker from '../ui/Ticker';

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <div className="fixed top-0 left-0 right-0 z-[900] h-[var(--nav-h)] bg-white/95 backdrop-blur-md border-b border-brand-border flex items-center px-4 md:px-[var(--px)] gap-5 shadow-topbar">
      <Link href="/" className="font-black text-[19px] text-brand-purple tracking-tight flex items-center gap-2 shrink-0 select-none">
        <img src="/afriq-images/afriq-logo.jpeg" alt="AFRIQ Logo" className="w-8 h-8 rounded-lg object-cover" />
        <span className="text-[18px] font-black tracking-tight">AFRIQ</span>
      </Link>

      <div className="hidden md:block flex-1 min-w-0">
        <Ticker />
      </div>

      <div className="flex gap-2.5 shrink-0 items-center ml-auto md:ml-0">
        {/* Language pill */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-brand-mid border border-brand-border rounded-md px-2.5 py-1.5 cursor-default select-none">
          EN
        </div>

        {session ? (
          <>
            <Link href="/dashboard" className="text-[13px] font-semibold text-brand-purple border-2 border-brand-purple bg-transparent px-4 py-2 rounded-lg hover:bg-brand-pale transition-colors hidden sm:inline-flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-pale border border-brand-border flex items-center justify-center text-brand-purple font-bold text-xs uppercase cursor-help" title={session.user?.name || session.user?.email || 'User'}>
                {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
              </div>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="text-[11px] font-bold text-brand-muted hover:text-red-500 uppercase tracking-wider hidden sm:block">
                Sign out
              </button>
            </div>
          </>
        ) : (
          <>
            <Link href="/auth" className="text-[13px] font-semibold text-brand-purple border-[1.5px] border-brand-purple bg-transparent px-4 py-2 rounded-lg hover:bg-brand-pale transition-colors hidden sm:inline-flex items-center gap-1.5">
              Sign In
            </Link>
            <Link href="/auth" className="text-[13px] font-bold text-white bg-brand-purple border-none px-5 py-2 rounded-lg hover:bg-brand-purple2 hover:-translate-y-px hover:shadow-card transition-all inline-flex items-center gap-1.5">
              Apply Now
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

