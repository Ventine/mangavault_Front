'use client';

import { useState } from 'react';

interface Props {
  activeEndpoint: string;
  onSearch: (id: string) => void;
  isLoading: boolean;
}

export default function SearchIdBar({ activeEndpoint, onSearch, isLoading }: Props) {
  const [mangaId, setMangaId] = useState('');

  if (activeEndpoint !== 'Buscar ID') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mangaId.trim()) onSearch(mangaId.trim());
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/70 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-indigo-50 mb-8 w-full max-w-xl mx-auto animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-indigo-100 p-3 rounded-2xl shadow-inner">
        <span className="text-xl">🔍</span>
      </div>
      <div className="flex-1 w-full text-center sm:text-left">
        <h3 className="font-black text-indigo-900 tracking-tight">Inspección por ID</h3>
        <p className="text-xs text-indigo-500/80 font-bold mt-0.5">Ingresa el código exacto de la bóveda</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0">
        <input 
          type="number" 
          value={mangaId}
          onChange={(e) => setMangaId(e.target.value)}
          placeholder="Ej: 28"
          className="w-full sm:w-24 px-4 py-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 focus:bg-white focus:ring-2 focus:ring-indigo-300 outline-none text-indigo-900 font-black text-center transition-all"
          required
        />
        <button 
          type="submit"
          disabled={isLoading || !mangaId}
          className="cursor-pointer px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 flex items-center justify-center min-w-[100px]"
        >
          {isLoading ? '...' : 'Inspeccionar'}
        </button>
      </form>
    </div>
  );
}