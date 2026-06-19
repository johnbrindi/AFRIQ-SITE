'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/portal/TopBar';

type Uni = { id: number; name: string; short: string | null; country: string };

const STEPS = ['Destination', 'Your Details', 'Done'];

export default function ApplyPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Form state
    const [destination, setDestination] = useState<'CAMEROON' | 'ABROAD' | ''>('');
    const [fullName, setFullName] = useState('');
    const [background, setBackground] = useState<'Science' | 'Arts' | ''>('');
    const [previousSchool, setPreviousSchool] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [aspiringUniversity, setAspiringUniversity] = useState('');
    const [uniSearch, setUniSearch] = useState('');
    const [uniDropOpen, setUniDropOpen] = useState(false);
    const [universities, setUniversities] = useState<Uni[]>([]);
    const [unisLoading, setUnisLoading] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    // Fetch universities when destination changes
    useEffect(() => {
        if (!destination) { setUniversities([]); return; }
        setUnisLoading(true);
        setAspiringUniversity('');
        setUniSearch('');
        fetch(`/api/universities?destination=${destination}`)
            .then(r => r.json())
            .then(data => setUniversities(Array.isArray(data) ? data : []))
            .catch(() => setUniversities([]))
            .finally(() => setUnisLoading(false));
    }, [destination]);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
                setUniDropOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const filteredUnis = universities.filter(u =>
        u.name.toLowerCase().includes(uniSearch.toLowerCase())
    );

    // Validation
    const step1Valid = destination !== '';
    const step2Valid =
        fullName.trim().length >= 2 &&
        background !== '' &&
        previousSchool.trim().length >= 2 &&
        /^\+?[0-9\s\-().]{7,20}$/.test(phoneNumber) &&
        aspiringUniversity !== '';

    async function handleSubmit() {
        if (!step2Valid) return;
        setSubmitting(true);
        setError('');
        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    background,
                    previousSchool,
                    phoneNumber,
                    studyDestination: destination,
                    aspiringUniversity,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Submission failed');
            }
            setStep(2);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const inputCls =
        'w-full text-[13.5px] text-brand-slate bg-brand-bg border-[1.5px] border-brand-border rounded-lg px-3 py-2.5 outline-none focus:border-brand-purple focus:bg-white transition-colors';
    const labelCls = 'block text-[10.5px] font-bold text-brand-mid tracking-[0.4px] uppercase mb-1.5';

    return (
        <>
            <TopBar />
            <main className="min-h-screen pt-[var(--nav-h)] bg-brand-bg flex flex-col">
                {/* Header */}
                <div className="bg-brand-purple py-10 px-4 md:px-[var(--px)]">
                    <div className="max-w-[640px] mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-brand-gold/10 border border-brand-gold/30 text-brand-gold2 text-[10.5px] font-bold tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                            Free Consultation
                        </div>
                        <h1 className="font-serif text-[clamp(26px,4vw,42px)] font-black text-white leading-tight tracking-tight mb-3">
                            Submit Your Study Enquiry
                        </h1>
                        <p className="text-[14px] text-white/65 leading-relaxed">
                            Tell us where you want to study and your academic background — our team will guide you toward the right programme.
                        </p>
                    </div>
                </div>

                {/* Step indicator */}
                <div className="bg-white border-b border-brand-border">
                    <div className="max-w-[640px] mx-auto px-4 py-3 flex items-center justify-center gap-2">
                        {STEPS.slice(0, 2).map((label, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 transition-all ${step > i ? 'bg-green-500 text-white' : step === i ? 'bg-brand-purple text-white' : 'bg-brand-pale text-brand-mid'
                                    }`}>
                                    {step > i ? (
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : i + 1}
                                </div>
                                <span className={`text-[11.5px] font-semibold ${step === i ? 'text-brand-slate' : 'text-brand-muted'}`}>{label}</span>
                                {i < 1 && <div className="w-8 h-px bg-brand-border mx-1" />}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card */}
                <div className="flex-1 flex items-start justify-center px-4 py-10">
                    <div className="w-full max-w-[580px]">

                        {/* ── STEP 0: Destination ─────────────────────────────────────── */}
                        {step === 0 && (
                            <div className="bg-white rounded-2xl border-[1.5px] border-brand-border shadow-sm overflow-hidden">
                                <div className="bg-brand-pale border-b border-brand-border px-6 py-4">
                                    <h2 className="text-[15px] font-extrabold text-brand-slate">Where do you want to study?</h2>
                                    <p className="text-[12.5px] text-brand-muted mt-0.5">This helps us show you the right universities.</p>
                                </div>
                                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {(['CAMEROON', 'ABROAD'] as const).map((dest) => (
                                        <label
                                            key={dest}
                                            className={`flex flex-col items-center gap-3 cursor-pointer rounded-xl border-[2px] p-6 text-center transition-all hover:border-brand-purple/50 has-[:checked]:border-brand-purple has-[:checked]:bg-brand-pale/60 has-[:checked]:shadow-[0_0_0_1px_rgba(74,35,134,0.15)] ${destination === dest ? 'border-brand-purple bg-brand-pale/60' : 'border-brand-border'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="destination"
                                                value={dest}
                                                checked={destination === dest}
                                                onChange={() => setDestination(dest)}
                                                className="sr-only"
                                            />
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${destination === dest ? 'bg-brand-purple text-white' : 'bg-brand-pale text-brand-purple'
                                                }`}>
                                                {dest === 'CAMEROON' ? (
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-[14px] font-extrabold text-brand-slate">
                                                    {dest === 'CAMEROON' ? 'Cameroon' : 'Abroad'}
                                                </div>
                                                <div className="text-[11.5px] text-brand-muted mt-0.5">
                                                    {dest === 'CAMEROON' ? 'State & private universities' : 'International universities'}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <div className="px-6 pb-6">
                                    <button
                                        disabled={!step1Valid}
                                        onClick={() => setStep(1)}
                                        className="w-full text-[14px] font-bold text-white bg-brand-purple py-3.5 rounded-xl hover:bg-brand-purple2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Continue
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 1: Details ─────────────────────────────────────────── */}
                        {step === 1 && (
                            <div className="bg-white rounded-2xl border-[1.5px] border-brand-border shadow-sm overflow-hidden">
                                <div className="bg-brand-pale border-b border-brand-border px-6 py-4 flex items-center gap-3">
                                    <button onClick={() => setStep(0)} className="text-brand-muted hover:text-brand-slate transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <div>
                                        <h2 className="text-[15px] font-extrabold text-brand-slate">Your Details</h2>
                                        <p className="text-[11.5px] text-brand-muted">Studying in <strong>{destination === 'CAMEROON' ? 'Cameroon' : 'Abroad'}</strong></p>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col gap-4">
                                    {/* Full Name */}
                                    <div>
                                        <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            placeholder="e.g. Ngounou Jean Baptiste"
                                            className={inputCls}
                                        />
                                    </div>

                                    {/* Academic Background */}
                                    <div>
                                        <label className={labelCls}>Academic Background <span className="text-red-400">*</span></label>
                                        <select
                                            value={background}
                                            onChange={e => setBackground(e.target.value as any)}
                                            className={inputCls}
                                        >
                                            <option value="">Select background...</option>
                                            <option value="Science">Science</option>
                                            <option value="Arts">Arts</option>
                                        </select>
                                    </div>

                                    {/* Previous School */}
                                    <div>
                                        <label className={labelCls}>Previous School <span className="text-red-400">*</span></label>
                                        <input
                                            type="text"
                                            value={previousSchool}
                                            onChange={e => setPreviousSchool(e.target.value)}
                                            placeholder="e.g. GBHS Bamenda"
                                            className={inputCls}
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className={labelCls}>Phone Number <span className="text-red-400">*</span></label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={e => setPhoneNumber(e.target.value)}
                                            placeholder="+237 6XX XXX XXX"
                                            className={inputCls}
                                        />
                                        {phoneNumber && !/^\+?[0-9\s\-().]{7,20}$/.test(phoneNumber) && (
                                            <p className="text-[11px] text-red-500 mt-1 font-medium">Please enter a valid phone number.</p>
                                        )}
                                    </div>

                                    {/* Aspiring University — Searchable dropdown */}
                                    <div>
                                        <label className={labelCls}>Aspiring University <span className="text-red-400">*</span></label>
                                        <div className="relative" ref={dropRef}>
                                            <button
                                                type="button"
                                                onClick={() => setUniDropOpen(o => !o)}
                                                className={`${inputCls} text-left flex items-center justify-between gap-2 ${!aspiringUniversity ? 'text-brand-muted' : ''}`}
                                                disabled={unisLoading}
                                            >
                                                <span className="truncate">{aspiringUniversity || (unisLoading ? 'Loading universities…' : 'Search university…')}</span>
                                                <svg className={`w-4 h-4 shrink-0 transition-transform ${uniDropOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                                            </button>

                                            {uniDropOpen && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border-[1.5px] border-brand-border rounded-xl shadow-card-lg overflow-hidden">
                                                    <div className="p-2 border-b border-brand-border">
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            value={uniSearch}
                                                            onChange={e => setUniSearch(e.target.value)}
                                                            placeholder="Type to filter…"
                                                            className="w-full text-[13px] px-3 py-2 outline-none bg-brand-bg rounded-lg border border-brand-border focus:border-brand-purple transition-colors"
                                                        />
                                                    </div>
                                                    <div className="max-h-52 overflow-y-auto">
                                                        {filteredUnis.length === 0 ? (
                                                            <div className="px-4 py-5 text-[12.5px] text-brand-muted text-center">
                                                                {universities.length === 0
                                                                    ? 'No universities found for this destination.'
                                                                    : 'No matches found.'}
                                                            </div>
                                                        ) : filteredUnis.map(u => (
                                                            <button
                                                                key={u.id}
                                                                type="button"
                                                                onClick={() => {
                                                                    setAspiringUniversity(u.name);
                                                                    setUniSearch('');
                                                                    setUniDropOpen(false);
                                                                }}
                                                                className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-brand-pale transition-colors flex items-center gap-2 ${aspiringUniversity === u.name ? 'bg-brand-pale font-bold text-brand-purple' : 'text-brand-slate'}`}
                                                            >
                                                                {u.name}
                                                                {u.short && <span className="text-[10.5px] text-brand-muted">({u.short})</span>}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-[12.5px] text-red-700 flex items-start gap-2">
                                            <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        disabled={!step2Valid || submitting}
                                        onClick={handleSubmit}
                                        className="w-full text-[14px] font-bold text-white bg-brand-purple py-3.5 rounded-xl hover:bg-brand-purple2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                                Submitting…
                                            </>
                                        ) : 'Submit Enquiry'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── STEP 2: Success ─────────────────────────────────────────── */}
                        {step === 2 && (
                            <div className="bg-white rounded-2xl border-[1.5px] border-brand-border shadow-sm p-10 text-center">
                                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="font-serif text-[22px] font-black text-brand-slate mb-3">Enquiry Submitted!</h2>
                                <p className="text-[14px] text-brand-muted leading-relaxed mb-8 max-w-[420px] mx-auto">
                                    Thank you, <strong>{fullName}</strong>! We've received your interest in <strong>{aspiringUniversity}</strong>. Our team will reach out to you at <strong>{phoneNumber}</strong> shortly.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <button
                                        onClick={() => { setStep(0); setDestination(''); setFullName(''); setBackground(''); setPreviousSchool(''); setPhoneNumber(''); setAspiringUniversity(''); setError(''); }}
                                        className="text-[13px] font-bold text-brand-purple border-[1.5px] border-brand-border px-6 py-3 rounded-xl hover:border-brand-purple hover:bg-brand-pale transition-all"
                                    >
                                        Submit Another
                                    </button>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="text-[13px] font-bold text-white bg-brand-purple px-6 py-3 rounded-xl hover:bg-brand-purple2 transition-colors"
                                    >
                                        Back to Home
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
