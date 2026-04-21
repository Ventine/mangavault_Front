'use client';

import { useState } from 'react';

interface Props {
  activeEndpoint: string;
  onSearch: (id: string) => void;
  isLoading: boolean;
}

export default function RecommendationBar({ activeEndpoint, onSearch, isLoading }: Props) {
  const [mangaId, setMangaId] = useState('');

  if (activeEndpoint !== 'Recomendaciones') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mangaId.trim()) {
      onSearch(mangaId.trim());
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-white/50 mb-8 w-full max-w-xl mx-auto animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-pink-100 p-3 rounded-xl">
        <span className="text-xl">✨</span>
      </div>
      <div className="flex-1 w-full text-center sm:text-left">
        <h3 className="font-bold text-slate-800">Buscador de Recomendaciones</h3>
        <p className="text-xs text-slate-500 font-medium">Ingresa el ID de un manga para ver historias similares</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex w-full sm:w-auto gap-2 mt-2 sm:mt-0">
        <input 
          type="number" 
          value={mangaId}
          onChange={(e) => setMangaId(e.target.value)}
          placeholder="Ej: 1"
          className="w-full sm:w-24 px-4 py-2 bg-white rounded-xl border-none shadow-inner focus:ring-2 focus:ring-pink-400 outline-none text-slate-700 font-bold text-center"
          required
        />
        <button 
          type="submit"
          disabled={isLoading || !mangaId}
          className="cursor-pointer px-6 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-pink-400 flex items-center justify-center min-w-[100px]"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            'Buscar'
          )}
        </button>
      </form>
    </div>
  );
}