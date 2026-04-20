'use client';

import { useEffect, useState } from 'react';
import api from '@/src/services/api';
import { Manga, JikanTopResponse } from '@/src/types/manga';
import MangaCard from '@/src/components/MangaCard';

const ENDPOINTS = [
  { name: 'Top', color: 'bg-rose-200 hover:bg-rose-300 text-rose-900' },
  { name: 'Recomendaciones', color: 'bg-pink-200 hover:bg-pink-300 text-pink-900' },
  { name: 'Buscar Nombre', color: 'bg-sky-200 hover:bg-sky-300 text-sky-900' },
  { name: 'Buscar ID', color: 'bg-indigo-200 hover:bg-indigo-300 text-indigo-900' },
  { name: 'Ver Favoritos', color: 'bg-amber-200 hover:bg-amber-300 text-amber-900' },
  { name: 'Estadísticas', color: 'bg-purple-200 hover:bg-purple-300 text-purple-900' },
  { name: 'Estatus API', color: 'bg-slate-300 hover:bg-slate-400 text-slate-900' },
  { name: 'Sincronizar', color: 'bg-blue-200 hover:bg-blue-300 text-blue-900' },
  { name: 'Agregar Favorito', color: 'bg-emerald-200 hover:bg-emerald-300 text-emerald-900' }, 
  { name: 'Eliminar Favorito', color: 'bg-red-200 hover:bg-red-300 text-red-900' },
];

export default function Home() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeEndpoint, setActiveEndpoint] = useState('Top');

  useEffect(() => {
    const controller = new AbortController();

    const fetchMangas = async () => {
      setLoading(true);
      try {
        if (['Top', 'Recomendaciones', 'Ver Favoritos'].includes(activeEndpoint)) {
          const response = await api.get<JikanTopResponse>('/mangas/top', {
            signal: controller.signal
          });
          setMangas(response.data.data);
        } else {
          setMangas([]); 
        }
      } catch (error: any) {
        if (error.name !== 'CanceledError') {
          console.error("Error al cargar datos", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMangas();
    return () => controller.abort();
  }, [activeEndpoint]);

  return (
    <main 
      className="min-h-screen relative font-sans flex flex-col"
      style={{
        backgroundImage: "url('https://i.ytimg.com/vi/eAMeMkVsjiw/maxresdefault.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-[#FDFBF7]/80 backdrop-blur-[2px] z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
        
        <header className="mb-6 border-b border-slate-400/30 pb-4 text-center md:text-left mt-2 md:mt-0">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight drop-shadow-sm">
            MangaVault
          </h1>
          <p className="text-slate-600 mt-2 text-base md:text-lg font-medium max-w-2xl">
            Gestiona, busca y sincroniza tus colecciones.
          </p>
        </header>

        {/* --- NAVEGACIÓN CORREGIDA --- */}
        <nav aria-label="Filtros de endpoints" className="mb-8 w-full">
          {/* El 'p-2' aquí es vital: evita que el hover corte los botones al hacer scale */}
          <ul className="flex overflow-x-auto sm:flex-wrap gap-3 p-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {ENDPOINTS.map((ep) => (
              <li key={ep.name} className="snap-start shrink-0">
                <button
                  onClick={() => setActiveEndpoint(ep.name)}
                  aria-pressed={activeEndpoint === ep.name}
                  /* Botones más grandes: px-6 py-2.5 y texto más grande (text-base md:text-lg) */
                  className={`px-6 py-2.5 text-base md:text-lg rounded-full font-bold transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]
                    ${ep.color}
                    ${activeEndpoint === ep.name 
                      ? 'ring-2 ring-slate-600 ring-offset-2 ring-offset-[#FDFBF7] scale-105 shadow-md z-20' 
                      : 'opacity-85 hover:opacity-100 hover:scale-105 hover:shadow-md z-10'
                    }
                  `}
                >
                  {ep.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {/* --------------------------- */}

        <section aria-label={`Resultados de ${activeEndpoint}`} className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-2">
                  <div className="bg-slate-300/60 rounded-lg aspect-[2/3] w-full shadow-sm"></div>
                  <div className="h-3 bg-slate-300/60 rounded-md w-3/4"></div>
                  <div className="h-2 bg-slate-300/60 rounded-md w-1/2"></div>
                </div>
              ))}
            </div>
          ) : mangas.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
              {mangas.map((manga) => (
                <MangaCard key={manga.id} manga={manga} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-[#FDFBF7]/80 backdrop-blur-md border border-slate-200 p-6 rounded-xl shadow-sm max-w-sm w-full">
                <p className="text-slate-800 text-lg font-bold mb-1">Panel vacío</p>
                <p className="text-slate-600 text-sm font-medium">
                  El panel de <span className="text-slate-800 font-bold">{activeEndpoint}</span> está en construcción.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}