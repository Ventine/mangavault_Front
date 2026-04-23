import { MangaItem } from '@/src/types/manga';
import FavoriteButton from './FavoriteButton';

interface Props {
  loading: boolean;
  error: string | null;
  manga: MangaItem | null;
  onToggle?: () => void; // Agregado para mantener la comunicación con page.tsx
}

export default function SingleMangaDetail({ loading, error, manga, onToggle }: Props) {
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white/50 rounded-3xl p-6 md:p-8 animate-pulse flex flex-col md:flex-row gap-8 shadow-sm border border-slate-100">
        <div className="w-full md:w-72 aspect-[2/3] bg-slate-200/70 rounded-2xl"></div>
        <div className="flex-1 space-y-4 py-4">
          <div className="h-8 bg-slate-200/70 rounded-lg w-3/4"></div>
          <div className="h-4 bg-slate-200/70 rounded-md w-1/4 mb-8"></div>
          <div className="h-4 bg-slate-200/70 rounded-md w-full"></div>
          <div className="h-4 bg-slate-200/70 rounded-md w-full"></div>
          <div className="h-4 bg-slate-200/70 rounded-md w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-10">
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl max-w-md text-center shadow-sm">
          <p className="text-rose-800 font-bold text-lg">Manga no encontrado</p>
          <p className="text-rose-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!manga) return null;

  const fallbackImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc8hzmtGoPpYV7g__EnFDPQtwpDejqbq_Xog&s';
  const displayImage = manga.imageUrl || fallbackImage;

  return (
    <div className="w-full max-w-5xl mx-auto animate-in zoom-in-95 duration-500">
      <article className="bg-[#FDFBF7] rounded-[2rem] shadow-xl shadow-indigo-900/5 border border-white overflow-hidden flex flex-col md:flex-row relative">
        
        {/* BOTÓN DE FAVORITOS: Posicionado absolutamente en la esquina de la tarjeta */}
        <FavoriteButton 
          mangaId={manga.id} 
          displayMode="text" 
          onToggle={onToggle}
        />
        
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 z-0 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/3 -translate-x-1/3 z-0 pointer-events-none"></div>

        {/* Imagen del Manga */}
        <div className="w-full md:w-[340px] shrink-0 p-4 md:p-6 relative z-10">
          <img 
            src={displayImage} 
            alt={manga.title} 
            className="w-full h-auto aspect-[2/3] object-cover rounded-2xl shadow-lg ring-1 ring-slate-900/5"
          />
        </div>
        
        {/* Detalles del Manga */}
        <div className="flex-1 p-6 md:p-10 md:pl-4 flex flex-col relative z-10">
          
          <div className="flex flex-wrap gap-2 mb-4">
            {manga.type && (
              <span className="bg-indigo-100 text-indigo-700 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg">
                {manga.type}
              </span>
            )}
            {manga.status && (
              <span className={`font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg ${manga.status.includes('Hiatus') ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {manga.status}
              </span>
            )}
          </div>

          <h2 className="text-3xl md:text-5xl font-black text-slate-800 leading-tight mb-4 tracking-tight md:pr-32">
            {manga.title}
          </h2>

          <div className="flex items-center gap-6 mb-8 bg-white/60 p-4 rounded-2xl border border-slate-100 w-fit backdrop-blur-sm shadow-sm">
            {manga.score && (
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Puntuación</p>
                <p className="text-2xl font-black text-amber-500 flex items-center gap-1">⭐ {manga.score}</p>
              </div>
            )}
            {manga.rank && (
              <>
                <div className="w-px h-8 bg-slate-200"></div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ranking</p>
                  <p className="text-2xl font-black text-slate-700">#{manga.rank}</p>
                </div>
              </>
            )}
          </div>

          {/* Sinopsis con párrafos respetados */}
          <div className="prose prose-slate prose-sm md:prose-base mb-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3">Sinopsis</h3>
            {manga.synopsis ? manga.synopsis.split('\n').map((p, i) => (
              <p key={i} className="mb-2 text-slate-600 leading-relaxed font-medium">{p}</p>
            )) : <p className="text-slate-500">No hay sinopsis disponible.</p>}
          </div>

          {/* Géneros en píldoras pasteles */}
          {manga.genres && manga.genres.length > 0 && (
            <div className="mt-auto pt-6 border-t border-slate-200/60">
              <div className="flex flex-wrap gap-2">
                {manga.genres.map(genre => (
                  <span key={genre} className="bg-purple-50 text-purple-600 border border-purple-100 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all hover:bg-purple-100">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </article>
    </div>
  );
}