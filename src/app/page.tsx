'use client';

import { useEffect, useState } from 'react';
import { TopMangasResponse, MangaItem } from '@/src/types/manga';
import { ApiStatus } from '@/src/types/status'; // Asegúrate de tener este tipo
import EndpointNav from '@/src/components/EndpointNav';
import MangaGrid from '@/src/components/MangaGrid';
import FilterBar from '@/src/components/FilterBar';
import StatusModal from '@/src/components/StatusModal'; // Importamos el nuevo modal

export default function Home() {
  // --- ESTADOS DE MANGAS ---
  const [mangas, setMangas] = useState<MangaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [slowLoading, setSlowLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // --- ESTADOS DE NAVEGACIÓN ---
  const [activeEndpoint, setActiveEndpoint] = useState('Top');
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [currentType, setCurrentType] = useState('manga');
  const [currentFilter, setCurrentFilter] = useState('bypopularity');

  // --- ESTADOS DE ESTATUS API ---
  const [statusData, setStatusData] = useState<ApiStatus | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [previousEndpoint, setPreviousEndpoint] = useState('Top'); // Para recordar dónde estábamos

  // 1. EFECTO: CARGAR MANGAS
  useEffect(() => {
    const controller = new AbortController();
    let slowLoadTimeout: NodeJS.Timeout;
    
    const fetchMangas = async () => {
      setLoading(true);
      setSlowLoading(false);
      setApiError(null);
      
      slowLoadTimeout = setTimeout(() => {
        setSlowLoading(true);
      }, 5000);
      
      try {
        const params = new URLSearchParams({
          type: currentType,
          filter: currentFilter,
          page: page.toString()
        });

        const response = await fetch(`/api/v1/mangas/top?${params.toString()}`, { 
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        
        clearTimeout(slowLoadTimeout);
        
        if (!response.ok) {
          throw new Error(`El servidor respondió con error ${response.status}. Revisa que Render esté activo.`);
        }
        
        const result: TopMangasResponse = await response.json();
        setMangas(result.data || []);
        setHasNextPage(result.pagination?.has_next_page || false);
        
      } catch (error: any) {
        clearTimeout(slowLoadTimeout);
        if (error.name !== 'AbortError') {
          console.error("Error Fetch:", error);
          setApiError(error.message || "Fallo al conectar con la bóveda de mangas.");
          setMangas([]);
        }
      } finally {
        setLoading(false);
        setSlowLoading(false);
      }
    };

    if (activeEndpoint === 'Top') {
      fetchMangas();
      setPreviousEndpoint('Top'); // Guardamos que estamos en Top
    } 
    // Protegemos la grilla: Si el usuario hace clic en una "Acción" (como Estatus API), NO borramos los mangas
    else if (!['Estatus API', 'Sincronizar', 'Agregar Favorito'].includes(activeEndpoint)) {
      setMangas([]);
      setLoading(false);
      setApiError(null);
      setPreviousEndpoint(activeEndpoint);
    }
    
    return () => {
      controller.abort();
      clearTimeout(slowLoadTimeout);
    };
  }, [page, currentType, currentFilter, activeEndpoint]);

  // 2. EFECTO: OBTENER ESTATUS API
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/v1/mangas/status');
        if (!response.ok) throw new Error('Fallo al obtener el estatus');
        const data = await response.json();
        setStatusData(data);
        setIsStatusModalOpen(true);
      } catch (error) {
        console.error("Error Status:", error);
        alert("El servidor en Render no está respondiendo. Por favor, espera a que despierte.");
      } finally {
        // Devolvemos silenciosamente el activeEndpoint a lo que el usuario estaba viendo
        // para que el botón deje de estar "presionado" y no rompa la navegación
        setActiveEndpoint(previousEndpoint);
      }
    };

    if (activeEndpoint === 'Estatus API') {
      fetchStatus();
    }
  }, [activeEndpoint, previousEndpoint]);

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
      <div className="absolute inset-0 bg-[#FDFBF7]/85 backdrop-blur-sm z-0 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-6 flex-1 flex flex-col">
        
        <header className="mb-6 border-b border-slate-400/30 pb-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">MangaVault</h1>
          <p className="text-slate-600 mt-1 font-medium">Explorando y sincronizando tu colección.</p>
        </header>

        <EndpointNav activeEndpoint={activeEndpoint} setActiveEndpoint={setActiveEndpoint} />

        {/* Mantenemos el filtro visible si estábamos en Top, incluso si hacemos clic en Estatus */}
        {(activeEndpoint === 'Top' || previousEndpoint === 'Top') && (
          <FilterBar 
            activeEndpoint={activeEndpoint === 'Estatus API' ? previousEndpoint : activeEndpoint}
            currentType={currentType}
            setCurrentType={setCurrentType}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
            setPage={setPage}
          />
        )}

        <section aria-label="Resultados de Mangas" className="flex-1 flex flex-col">
          {loading && slowLoading && (
            <div className="flex justify-center mb-6">
              <div className="bg-amber-100 border border-amber-300 text-amber-800 px-6 py-3 rounded-full flex items-center gap-3 shadow-sm animate-pulse">
                <span className="text-xl">☕</span>
                <p className="font-medium text-sm">
                  Despertando la API en Render... esto puede tomar alrededor de un minuto.
                </p>
              </div>
            </div>
          )}

          <MangaGrid 
            loading={loading} 
            mangas={mangas} 
            page={page} 
            setPage={setPage} 
            hasNextPage={hasNextPage}
            activeEndpoint={previousEndpoint} // Le pasamos la vista real, no la acción
            error={apiError}
          />
        </section>

      </div>

      {/* RENDERIZAMOS EL MODAL DE ESTATUS FUERA DEL FLUJO PRINCIPAL */}
      <StatusModal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)} 
        data={statusData} 
      />
    </main>
  );
}