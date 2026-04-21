'use client';

import { useState } from 'react';
import { University } from '@/types';
import UniversityCard from './UniversityCard';

export default function UniversityGrid({ universities }: { universities: University[] }) {
  const [filterMode, setFilterMode] = useState<'all' | 'state' | 'private'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = universities.filter((u) => {
    // Only State universities in this DB anyway, but let's implement the filter as it was
    const matchesFilter = filterMode === 'all' || u.tag.toLowerCase().includes(filterMode);
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.short.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="max-w-brand-portal mx-auto pt-5 flex items-center gap-3.5 flex-wrap px-4 md:px-[var(--px)]">
        <div className="flex bg-white p-1 rounded-xl border-[1.5px] border-brand-border shrink-0">
          <button 
            onClick={() => setFilterMode('all')}
            className={`text-[12.5px] font-semibold px-4 py-1.5 rounded-lg transition-colors ${filterMode === 'all' ? 'bg-brand-purple text-white shadow-[0_4px_12px_rgba(75,29,121,0.22)]' : 'text-brand-muted hover:bg-brand-pale'}`}
          >
            All Universities
          </button>
          <button 
            onClick={() => setFilterMode('state')}
            className={`text-[12.5px] font-semibold px-4 py-1.5 rounded-lg transition-colors ${filterMode === 'state' ? 'bg-brand-purple text-white shadow-[0_4px_12px_rgba(75,29,121,0.22)]' : 'text-brand-muted hover:bg-brand-pale'}`}
          >
            State Only
          </button>
          <button 
            onClick={() => setFilterMode('private')}
            className={`text-[12.5px] font-semibold px-4 py-1.5 rounded-lg transition-colors ${filterMode === 'private' ? 'bg-brand-purple text-white shadow-[0_4px_12px_rgba(75,29,121,0.22)]' : 'text-brand-muted hover:bg-brand-pale'}`}
          >
            Private
          </button>
        </div>

        <div className="flex-1 max-w-[320px] relative">
          <input 
            type="text" 
            placeholder="Search universities..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-[13px] bg-white border-[1.5px] border-brand-border rounded-xl py-2.5 pr-3.5 pl-9 outline-none transition-colors text-brand-slate focus:border-brand-purple"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>
      </div>

      <div className="max-w-brand-portal mx-auto py-7 pb-20 px-4 md:px-[var(--px)]">
        <div className="flex justify-between items-center mb-5 flex-wrap gap-2">
          <h2 className="text-[17px] font-extrabold text-brand-slate">Explore Universities</h2>
          <span className="text-[12.5px] text-brand-muted">Showing {filtered.length} results</span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map((uni) => (
              <UniversityCard key={uni.id} uni={uni} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-brand-muted flex flex-col items-center">
            <svg className="w-12 h-12 mb-3 opacity-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <p className="text-[14px]">No universities found matching your search.</p>
          </div>
        )}
      </div>
    </>
  );
}
