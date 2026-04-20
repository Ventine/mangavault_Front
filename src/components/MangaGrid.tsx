import { MangaItem } from '@/src/types/manga';
import MangaCard from './MangaCard';

interface Props {
  loading: boolean;
  mangas: MangaItem[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasNextPage: boolean;
  activeEndpoint: string;
  error: string | null; // Nuevo prop para manejar errores reales de la API
}

export default function MangaGrid({ loading, mangas, page, setPage, hasNextPage, activeEndpoint, error }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-2">
            <div className="bg-slate-300/60 rounded-lg aspect-[2/3] w-full shadow-sm"></div>
            <div className="h-4 bg-slate-300/60 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-300/60 rounded-md w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Si hubo un error al conectar con Render
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 p-6 rounded-xl shadow-sm max-w-md">
          <p className="text-red-800 text-lg font-bold mb-1">Error de Conexión</p>
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  // Si no hay mangas (arreglando el bug visual)
  if (mangas.length === 0) {
    if (activeEndpoint !== 'Top') {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-[#FDFBF7]/90 backdrop-blur-sm border border-slate-200 p-6 rounded-xl shadow-sm">
            <p className="text-slate-800 text-lg font-bold">Panel en construcción 🚧</p>
            <p className="text-slate-500 text-sm mt-1">El endpoint "{activeEndpoint}" aún no está conectado a la API.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-slate-800 text-lg font-bold bg-[#FDFBF7]/90 p-6 rounded-xl border border-slate-200 shadow-sm">
          No se encontraron mangas con estos filtros.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
        {mangas.map((manga, index) => (
          <MangaCard key={manga.title + index} manga={manga} />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-auto py-6 border-t border-slate-400/30">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-6 py-2 bg-slate-800 text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 hover:shadow-md transition-all"
        >
          &larr; Anterior
        </button>
        <span className="font-bold text-slate-800 bg-white/70 px-4 py-1.5 rounded-xl shadow-sm backdrop-blur-sm">
          Página {page}
        </span>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!hasNextPage}
          className="px-6 py-2 bg-slate-800 text-white rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 hover:shadow-md transition-all"
        >
          Siguiente &rarr;
        </button>
      </div>
    </>
  );
}