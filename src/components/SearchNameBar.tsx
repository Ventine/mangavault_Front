'use client';

import { useState } from 'react';

interface Props {
  activeEndpoint: string;
  onSearch: (name: string) => void;
  isLoading: boolean;
}

export default function SearchNameBar({ activeEndpoint, onSearch, isLoading }: Props) {
  const [query, setQuery] = useState('');

  if (activeEndpoint !== 'Buscar Nombre') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/70 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-sky-50 mb-8 w-full max-w-xl mx-auto animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-sky-100 p-3 rounded-2xl shadow-inner">
        <span className="text-xl">📖</span>
      </div>
      <div className="flex-1 w-full text-center sm:text-left">
        <h3 className="font-black text-sky-900 tracking-tight">Buscar por Título</h3>
        <p className="text-xs text-sky-600/80 font-bold mt-0.5">Encuentra un manga por su nombre exacto</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: Naruto"
          className="w-full sm:w-32 px-4 py-2.5 bg-sky-50/50 rounded-xl border border-sky-100 focus:bg-white focus:ring-2 focus:ring-sky-300 outline-none text-sky-900 font-bold text-center transition-all"
          required
        />
        <button 
          type="submit"
          disabled={isLoading || !query}
          className="cursor-pointer px-6 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-sky-400 flex items-center justify-center min-w-[100px]"
        >
          {isLoading ? '...' : 'Buscar'}
        </button>
      </form>
    </div>
  );
}