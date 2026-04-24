'use client'; // Requerido para usar useState

import { useState } from 'react';
import { MangaItem } from '@/src/types/manga';
import FavoriteButton from './FavoriteButton'; // <-- NUEVA IMPORTACIÓN

interface Props {
  manga: MangaItem;
  isFavoriteView?: boolean; // <-- NUEVO: Para saber si estamos viendo la bóveda
  onToggle?: (action: 'added' | 'removed', id: number | string) => void;
}

export default function MangaCard({ manga, isFavoriteView = false, onToggle }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Imagen por defecto
  const fallbackImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc8hzmtGoPpYV7g__EnFDPQtwpDejqbq_Xog&s';
  const displayImage = manga.imageUrl ? manga.imageUrl : fallbackImage;

  // Lógica dinámica de colores: Esmeralda si hay capítulos, Rosa si está en emisión (?)
  const hasChapters = manga.chapters && manga.chapters > 0;
  const chapterBadgeClass = hasChapters
    ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
    : 'bg-rose-100 text-rose-700 ring-1 ring-rose-300';

  return (
    <>
      {/* TARJETA PRINCIPAL */}
      <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        
        {/* Contenedor de la Imagen con overlay sutil */}
        <div 
          className="aspect-[2/3] w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${displayImage})` }}
          title={manga.title}
        >
          {/* Sombra interna inferior que aparece al hacer hover para darle profundidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <FavoriteButton mangaId={manga.id} isInitiallyFavorite={isFavoriteView} onToggle={onToggle} /> 

        {/* Contenido de la Tarjeta */}
        <div className="p-4 flex flex-col flex-1 bg-gradient-to-b from-white to-slate-50/50">
          <h3 className="font-extrabold text-slate-800 leading-tight line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors" title={manga.title}>
            {manga.title}
          </h3>
          
          {/* Etiquetas (Badges) de Color */}
          {/* Etiquetas (Badges) de Color */}
          <div className="flex justify-between items-center mb-3">
            {/* Si tiene votos (es una recomendación), mostramos el badge de votos */}
            {manga.votes !== undefined ? (
              <span className="text-xs font-black px-2.5 py-1 rounded-full shadow-sm bg-pink-100 text-pink-700 ring-1 ring-pink-300">
                ❤️ {manga.votes} Votos
              </span>
            ) : (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full shadow-sm ${chapterBadgeClass}`}>
                {hasChapters ? `${manga.chapters} Caps` : 'Emisión / ?'}
              </span>
            )}
            
            {manga.score && (
              <span className="text-xs font-black text-amber-700 bg-amber-200 px-2.5 py-1 rounded-full ring-1 ring-amber-400 shadow-sm flex items-center gap-1">
                ⭐ {manga.score}
              </span>
            )}
          </div>
          
          {/* Área de Sinopsis con Botón */}
          <div className="mt-auto border-t border-slate-100 pt-3 flex flex-col">
            <p className="text-sm text-slate-500 line-clamp-2 mb-2">
              {manga.synopsis ? manga.synopsis : 'Sin sinopsis disponible.'}
            </p>
            
            {/* Solo mostramos el botón si realmente hay una sinopsis que leer */}
            {manga.synopsis && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-xs font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-wider transition-colors mt-auto text-left w-max"
              >
                Leer más +
              </button>
            )}
          </div>
        </div>
      </article>

      {/* MODAL EMERGENTE PARA LA SINOPSIS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Contenedor del Modal */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Cabecera del Modal */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-start">
              <h3 className="font-black text-xl text-slate-800 leading-tight pr-4">
                {manga.title}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full p-1.5 transition-colors"
                aria-label="Cerrar modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Cuerpo del Modal (Con barra de desplazamiento si el texto es muy largo) */}
            <div className="p-5 overflow-y-auto">
              {/* Dividimos el texto por saltos de línea para respetar los párrafos originales del manga */}
              {manga.synopsis?.split('\n').map((paragraph, index) => (
                <p key={index} className="text-slate-600 mb-3 last:mb-0 leading-relaxed text-sm md:text-base">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Pie del Modal */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-full shadow-md transition-colors"
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