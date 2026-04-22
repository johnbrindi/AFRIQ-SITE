'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-20">
      <div className="max-w-[520px] w-full bg-white rounded-2xl shadow-card p-10 text-center animate-fade-in">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-[24px] font-serif font-black text-brand-slate tracking-tight mb-4">Something went wrong</h2>
        <p className="text-[15px] text-brand-muted leading-relaxed mb-10">
          The application encountered an unexpected error. This is often due to a database connection timeout or a network issue. Please try refreshing the page.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="text-[14px] font-bold text-white bg-brand-purple border-none px-8 py-3.5 rounded-xl hover:bg-brand-purple2 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reload Page
          </button>
          <Link href="/" className="text-[14px] font-bold text-brand-purple border-[1.5px] border-brand-border bg-white px-8 py-3.5 rounded-xl hover:border-brand-purple hover:bg-brand-pale hover:-translate-y-0.5 transition-all flex items-center justify-center shadow-sm">
            Home
          </Link>
        </div>
        
        <p className="mt-10 text-[12px] text-brand-muted opacity-60">
          If you are the administrator, please check your database status in the Neon console.
        </p>
      </div>
    </div>
  );
}
