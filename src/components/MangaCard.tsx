'use client';

import { useState } from 'react';
import { MangaItem } from '@/src/types/manga';
import FavoriteButton from './FavoriteButton';

interface Props {
  manga: MangaItem;
  isFavoriteView?: boolean;
  onToggle?: (action: 'added' | 'removed', id: number | string) => void;
}

export default function MangaCard({ manga, isFavoriteView = false, onToggle }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fallbackImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc8hzmtGoPpYV7g__EnFDPQtwpDejqbq_Xog&s';
  const displayImage = manga.imageUrl ? manga.imageUrl : fallbackImage;

  const hasChapters = manga.chapters && manga.chapters > 0;
  const chapterBadgeClass = hasChapters
    ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
    : 'bg-rose-100 text-rose-700 ring-1 ring-rose-300';

  return (
    <>
      {/* 1. ARTICLE DEBE TENER 'relative' */}
      <article className="relative bg-white rounded-2xl shadow-md flex flex-col h-full transform transition hover:-translate-y-1 hover:shadow-xl group overflow-hidden cursor-pointer" onClick={() => setIsModalOpen(true)}>
        
        {/* 2. EL DIV DE LA IMAGEN DEBE TENER 'relative' Y 'overflow-hidden' PARA ATRAPAR AL BOTÓN */}
        <div 
          className="relative aspect-[2/3] w-full bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url(${displayImage})` }}
          title={manga.title}
        >
          {/* Sombra interna en hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* BOTÓN PERFECTAMENTE ATRAPADO */}
          <FavoriteButton 
            mangaId={manga.id} 
            isInitiallyFavorite={isFavoriteView} 
            onToggle={onToggle} 
          />
        </div>

        {/* Info del Manga */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-black text-slate-800 text-sm md:text-base leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {manga.title}
          </h3>
          
          <div className="mt-auto flex items-center justify-between">
            {manga.score ? (
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                <span className="text-amber-500 text-xs">⭐</span>
                <span className="font-bold text-amber-700 text-xs">{manga.score}</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-medium">Sin votos</div>
            )}

            {manga.chapters !== undefined && (
              <div className={`px-2 py-1 rounded-lg ${chapterBadgeClass}`}>
                <span className="font-bold text-[10px] uppercase tracking-wider">
                  {manga.chapters} Cap.
                </span>
              </div>
            )}
          </div>
        </div>
      </article>

      {/* MODAL DE DETALLE (Se mantiene igual) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          ></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-start gap-4">
              <h2 className="text-2xl font-black text-slate-800 leading-tight">
                {manga.title}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full p-1.5 transition-colors outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-5 overflow-y-auto">
              {manga.synopsis ? manga.synopsis.split('\n').map((paragraph, index) => (
                <p key={index} className="text-slate-600 mb-3 last:mb-0 leading-relaxed text-sm md:text-base">
                  {paragraph}
                </p>
              )) : (
                <p className="text-slate-500 italic text-center py-4">No hay sinopsis disponible para este manga.</p>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl shadow-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}