'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Lead = {
    id: string;
    fullName: string;
    background: string;
    previousSchool: string;
    phoneNumber: string;
    studyDestination: string;
    aspiringUniversity: string;
    createdAt: string;
};

const PAGE_SIZE = 25;

export default function StudentLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const fetchLeads = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/leads');
            if (res.ok) {
                const data = await res.json();
                setLeads(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error('Failed to load leads:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchLeads(); }, [fetchLeads]);

    const filtered = leads.filter(l =>
        [l.fullName, l.phoneNumber, l.aspiringUniversity, l.previousSchool, l.background, l.studyDestination]
            .some(v => v.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    // CSV export
    function exportCSV() {
        const headers = ['Name', 'Phone', 'Background', 'Previous School', 'Destination', 'Aspiring University', 'Submitted'];
        const rows = filtered.map(l => [
            l.fullName, l.phoneNumber, l.background, l.previousSchool,
            l.studyDestination, l.aspiringUniversity,
            new Date(l.createdAt).toLocaleDateString('en-GB'),
        ]);
        const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `student-leads-${Date.now()}.csv`; a.click();
        URL.revokeObjectURL(url);
    }

    const destinationBadge = (d: string) => (
        <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${d === 'CAMEROON'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
            {d === 'CAMEROON' ? '🇨🇲 Cameroon' : '🌍 Abroad'}
        </span>
    );

    return (
        <main className="min-h-screen pt-[var(--nav-h)] bg-brand-bg">
            <div className="bg-brand-purple py-10 px-4 md:px-[var(--px)]">
                <div className="max-w-brand-portal mx-auto flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <div className="text-[13px] font-medium text-white/70 mb-1">Admin · Dashboard</div>
                        <h1 className="font-serif text-[clamp(22px,3vw,32px)] font-black text-white leading-tight">
                            Student Leads
                        </h1>
                    </div>
                    <Link
                        href="/dashboard"
                        className="text-[12px] font-bold text-white/70 border border-white/20 px-4 py-2 rounded-lg hover:text-white hover:border-white/40 transition-all flex items-center gap-1.5"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </div>

            <div className="max-w-brand-portal mx-auto px-4 md:px-[var(--px)] py-8">
                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                value={search}
                                onChange={e => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search by name, university, phone…"
                                className="w-full pl-9 pr-3 py-2.5 text-[13px] bg-white border-[1.5px] border-brand-border rounded-xl outline-none focus:border-brand-purple transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[12px] text-brand-muted">{filtered.length} {filtered.length === 1 ? 'lead' : 'leads'}</span>
                        <button
                            onClick={exportCSV}
                            disabled={filtered.length === 0}
                            className="text-[12.5px] font-bold text-brand-purple border-[1.5px] border-brand-border bg-white px-4 py-2.5 rounded-xl hover:border-brand-purple hover:bg-brand-pale transition-all flex items-center gap-1.5 disabled:opacity-40"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border-[1.5px] border-brand-border overflow-hidden">
                    {loading ? (
                        <div className="py-20 text-center">
                            <svg className="w-8 h-8 animate-spin text-brand-purple mx-auto" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="w-14 h-14 bg-brand-pale rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-7 h-7 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-[14px] font-bold text-brand-slate mb-1">No leads yet</p>
                            <p className="text-[12.5px] text-brand-muted">
                                {search ? 'No leads match your search.' : 'Leads submitted via /apply will appear here.'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-brand-purple text-white">
                                        {['Name', 'Phone', 'Background', 'Previous School', 'Destination', 'Aspiring University', 'Submitted'].map(h => (
                                            <th key={h} className="text-left p-3 text-[10.5px] font-bold tracking-wider uppercase whitespace-nowrap">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginated.map((lead, i) => (
                                        <tr key={lead.id} className={i % 2 === 0 ? 'bg-white' : 'bg-brand-bg/40'}>
                                            <td className="p-3 text-[13px] font-semibold text-brand-slate whitespace-nowrap">{lead.fullName}</td>
                                            <td className="p-3 text-[12.5px] text-brand-mid whitespace-nowrap">{lead.phoneNumber}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${lead.background === 'Science'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                        : 'bg-amber-50 text-amber-700 border-amber-200'
                                                    }`}>{lead.background}</span>
                                            </td>
                                            <td className="p-3 text-[12.5px] text-brand-mid">{lead.previousSchool}</td>
                                            <td className="p-3">{destinationBadge(lead.studyDestination)}</td>
                                            <td className="p-3 text-[12.5px] text-brand-slate max-w-[200px]">
                                                <span className="line-clamp-2">{lead.aspiringUniversity}</span>
                                            </td>
                                            <td className="p-3 text-[11.5px] text-brand-muted whitespace-nowrap">
                                                {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="w-9 h-9 rounded-lg border border-brand-border bg-white flex items-center justify-center hover:border-brand-purple transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={`w-9 h-9 rounded-lg text-[13px] font-bold border transition-colors ${n === page
                                        ? 'bg-brand-purple text-white border-brand-purple'
                                        : 'bg-white text-brand-slate border-brand-border hover:border-brand-purple'
                                    }`}
                            >
                                {n}
                            </button>
                        ))}
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="w-9 h-9 rounded-lg border border-brand-border bg-white flex items-center justify-center hover:border-brand-purple transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
