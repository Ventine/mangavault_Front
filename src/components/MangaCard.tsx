// src/components/MangaCard.tsx

import { MangaItem } from '@/src/types/manga';

interface Props {
  manga: MangaItem;
}

export default function MangaCard({ manga }: Props) {
  return (
    <article className="bg-[#FDFBF7] rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      
      {/* Manejo dinámico de la Imagen */}
      {manga.imageUrl ? (
        <div 
          className="aspect-[2/3] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${manga.imageUrl})` }}
          title={manga.title}
        />
      ) : (
        <div className="bg-slate-300 aspect-[2/3] w-full flex flex-col items-center justify-center text-slate-500 p-4 text-center">
          <span className="font-bold text-lg text-slate-400">Sin Imagen</span>
          <span className="text-xs mt-2">Agrega 'images' al backend</span>
        </div>
      )}

      {/* Contenido de la Tarjeta */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-800 leading-tight line-clamp-2 mb-1" title={manga.title}>
          {manga.title}
        </h3>
        
        {/* Mostramos status o capítulos dependiendo de lo que llegue */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs text-slate-500 font-medium">
            Caps: {manga.chapters ? manga.chapters : '?'}
          </p>
          {manga.score && (
            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">
              ★ {manga.score}
            </span>
          )}
        </div>

        <p className="text-sm text-slate-600 line-clamp-3 mt-auto border-t border-slate-100 pt-2">
          {manga.synopsis ? manga.synopsis : 'Sin sinopsis disponible.'}
        </p>
      </div>
    </article>
  );
}