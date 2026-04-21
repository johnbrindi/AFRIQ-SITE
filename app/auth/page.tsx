'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

function AuthForm() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    if (tab === 'login') {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } else {
      setTab('login');
      setError('Account creation is done by your institution. Please sign in with your credentials.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0440] via-brand-purple to-[#2a0b56] py-20 px-5 pt-[100px] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-white/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full bg-white/5 blur-[100px] pointer-events-none" />

      <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-card-lg overflow-hidden animate-fade-in relative z-10">
        {/* Header tabs */}
        <div className="bg-gradient-to-br from-brand-purple to-brand-purple2 px-8 pt-8 pb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path></svg>
            </div>
            <span className="text-white font-black text-[16px] tracking-tight">AFRIQ Portal</span>
          </div>
          <div className="flex bg-white/10 rounded-xl p-1">
            <button
              onClick={() => { setTab('login'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${tab === 'login' ? 'bg-white text-brand-purple shadow-sm' : 'text-white/65 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('signup'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-all ${tab === 'signup' ? 'bg-white text-brand-purple shadow-sm' : 'text-white/65 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>
        </div>

        <div className="p-8 pb-8">
          <h2 className="font-serif text-[22px] font-black text-brand-slate mb-1">
            {tab === 'login' ? 'Welcome back' : 'Start your journey'}
          </h2>
          <p className="text-[13px] text-brand-muted mb-6">
            {tab === 'login'
              ? 'Enter your credentials to access your portal.'
              : 'Create a free account to apply to any university.'}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-[13px] p-3.5 rounded-xl mb-5 font-medium border border-red-100 flex items-start gap-2">
              <svg className="w-4 h-4 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {tab === 'signup' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-brand-mid tracking-[0.5px] uppercase mb-1.5">First Name</label>
                  <input {...register('firstName', { required: true })} className="w-full text-[14px] text-brand-slate bg-brand-bg border-[1.5px] border-brand-border rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-purple focus:bg-white transition-colors" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-brand-mid tracking-[0.5px] uppercase mb-1.5">Last Name</label>
                  <input {...register('lastName', { required: true })} className="w-full text-[14px] text-brand-slate bg-brand-bg border-[1.5px] border-brand-border rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-purple focus:bg-white transition-colors" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-brand-mid tracking-[0.5px] uppercase mb-1.5">Email Address</label>
              <input
                type="email"
                {...register('email', { required: true })}
                placeholder="you@example.com"
                className="w-full text-[14px] text-brand-slate bg-brand-bg border-[1.5px] border-brand-border rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-purple focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brand-mid tracking-[0.5px] uppercase mb-1.5">Password</label>
              <input
                type="password"
                {...register('password', { required: true })}
                placeholder="••••••••"
                className="w-full text-[14px] text-brand-slate bg-brand-bg border-[1.5px] border-brand-border rounded-xl px-3.5 py-2.5 outline-none focus:border-brand-purple focus:bg-white transition-colors"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full text-[14px] font-bold text-white bg-brand-purple border-none p-3.5 rounded-xl hover:bg-brand-purple2 hover:-translate-y-px hover:shadow-card transition-all mt-1 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                  Processing...
                </>
              ) : tab === 'login' ? 'Sign In to Portal' : 'Create Account'}
            </button>
          </form>

          <div className="relative text-center text-[12px] text-brand-muted my-5">
            <span className="relative z-10 bg-white px-3">or continue with</span>
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-brand-border" />
          </div>

          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full text-[13px] font-semibold text-brand-mid bg-white border-[1.5px] border-brand-border p-3 rounded-xl hover:border-brand-purple hover:bg-brand-pale transition-colors flex items-center justify-center gap-2.5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-purple" />}>
      <AuthForm />
    </Suspense>
  );
}
