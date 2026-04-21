'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg px-4 py-20">
      <div className="max-w-[480px] w-full bg-white rounded-2xl shadow-card p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h2 className="text-[20px] font-black text-brand-slate tracking-tight mb-3">Database Connection Error</h2>
        <p className="text-[14px] text-brand-muted leading-relaxed mb-8">
          We couldn't connect to the database server. If you are using Neon, the database might be paused due to inactivity, or your connection string is incorrect.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="text-[13px] font-bold text-white bg-brand-purple border-none px-6 py-3 rounded-lg hover:bg-brand-purple2 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
            Try Again
          </button>
          <Link href="/" className="text-[13px] font-bold text-brand-purple border-[1.5px] border-brand-border bg-transparent px-6 py-3 rounded-lg hover:border-brand-purple hover:bg-brand-pale transition-colors flex items-center justify-center">
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
