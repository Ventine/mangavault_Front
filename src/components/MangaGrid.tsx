import { MangaItem } from '@/src/types/manga';
import MangaCard from './MangaCard';

interface Props {
  loading: boolean;
  mangas: MangaItem[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasNextPage: boolean;
  activeEndpoint: string;
  error: string | null;
  onRefresh?: (action: 'added' | 'removed', id: number | string) => void;
}

export default function MangaGrid({ loading, mangas, page, setPage, hasNextPage, activeEndpoint, error, onRefresh }: Props) {
  
  // 1. ESTADO DE CARGA (Skeletons Premium)
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 animate-in fade-in duration-500">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-3">
            <div className="bg-slate-200/80 rounded-2xl aspect-[2/3] w-full shadow-sm"></div>
            <div className="h-4 bg-slate-200/80 rounded-md w-3/4 ml-1"></div>
            <div className="h-3 bg-slate-200/80 rounded-md w-1/2 ml-1"></div>
          </div>
        ))}
      </div>
    );
  }

  // 2. ESTADO DE ERROR
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-500">
        <div className="bg-white/80 backdrop-blur-xl border border-rose-200 p-8 rounded-[2rem] shadow-xl shadow-rose-900/5 max-w-md relative overflow-hidden">
          {/* Decoración de fondo de error */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 translate-x-1/2 -translate-y-1/2 z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-5xl mb-4 block drop-shadow-sm">⚠️</span>
            <p className="text-rose-800 text-xl font-black mb-1 tracking-tight">Error de Conexión</p>
            <p className="text-rose-600/80 text-sm font-bold leading-relaxed">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // 3. ESTADO VACÍO (No hay mangas)
  if (!mangas || mangas.length === 0) {
    
    // 3A. Si estamos en "Ver Favoritos" y está vacío
    if (activeEndpoint === 'Ver Favoritos') {
      return (
        <div className="flex flex-col items-center justify-center py-16 animate-in slide-in-from-bottom-8 fade-in duration-700">
          <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] text-center border border-indigo-50 shadow-xl shadow-indigo-900/5 max-w-md relative overflow-hidden">
            {/* Luces pasteles de fondo */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-2xl opacity-60 -translate-x-1/2 translate-y-1/2 z-0 pointer-events-none"></div>
            
            {/* Contenido */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="text-7xl mb-6 drop-shadow-md transform transition hover:scale-110 cursor-default">🥺</div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Bóveda Vacía</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Aún no has guardado ningún manga.<br/> 
                Explora el catálogo y usa el corazón para llenar tu colección.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // 3B. Para las barras de búsqueda antes de buscar algo
    if (['Recomendaciones', 'Buscar ID', 'Buscar Nombre'].includes(activeEndpoint)) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-700">
          <div className="bg-white/40 backdrop-blur-md border border-slate-100 p-8 rounded-[2rem] shadow-sm max-w-sm">
            <span className="text-4xl mb-4 block drop-shadow-sm opacity-80">✨</span>
            <p className="text-slate-700 text-lg font-black tracking-tight">Esperando tu búsqueda</p>
            <p className="text-slate-500 text-sm font-medium mt-1">Usa la barra superior para comenzar.</p>
          </div>
        </div>
      );
    }

    // 3C. Para el Top con filtros muy estrictos que no arrojan resultados
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
        <div className="bg-white/60 backdrop-blur-md px-10 py-8 rounded-[2rem] border border-slate-200 shadow-sm max-w-sm">
          <span className="text-5xl mb-4 block drop-shadow-sm">👻</span>
          <p className="text-slate-800 font-black text-xl tracking-tight">Sin resultados</p>
          <p className="text-slate-500 text-sm mt-2 font-medium leading-relaxed">
            No encontramos mangas que coincidan con estos filtros.
          </p>
        </div>
      </div>
    );
  }

  // 4. ESTADO DE ÉXITO (Pintar la grilla)
  const isFavoriteView = activeEndpoint === 'Ver Favoritos';

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* GRILLA DE TARJETAS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
        {mangas.map((manga, index) => (
          <MangaCard 
            key={`${manga.id || manga.title}-${index}`} 
            manga={manga} 
            isFavoriteView={isFavoriteView}
            onToggle={onRefresh}
          />
        ))}
      </div>

      {/* PAGINACIÓN (Solo se muestra si estamos en un endpoint paginado) */}
      {(!['Recomendaciones', 'Buscar ID', 'Buscar Nombre'].includes(activeEndpoint)) && (
        <div className="flex justify-center items-center gap-4 mt-auto py-8 border-t border-slate-300/40">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer px-6 py-2.5 bg-slate-800 text-white rounded-full font-bold text-sm md:text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
          >
            &larr; Anterior
          </button>
          
          <span className="font-black text-slate-700 bg-white/80 px-5 py-2 rounded-xl shadow-sm backdrop-blur-sm border border-slate-100 min-w-[100px] text-center select-none">
            Página {page}
          </span>
          
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage}
            className="cursor-pointer px-6 py-2.5 bg-slate-800 text-white rounded-full font-bold text-sm md:text-base disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]"
          >
            Siguiente &rarr;
          </button>
        </div>
      )}
    </div>
  );
}