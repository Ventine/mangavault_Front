'use client';

import { useEffect, useState } from 'react';
import { TopMangasResponse, MangaItem } from '@/src/types/manga';
import { ApiStatus } from '@/src/types/status';
import { SyncResponse } from '@/src/types/sync';

import EndpointNav from '@/src/components/EndpointNav';
import MangaGrid from '@/src/components/MangaGrid';
import FilterBar from '@/src/components/FilterBar';
import StatusModal from '@/src/components/StatusModal';
import SyncAlertModal from '@/src/components/SyncAlertModal';
import RecommendationBar from '@/src/components/RecommendationBar';
import SearchIdBar from '@/src/components/SearchIdBar';
import SingleMangaDetail from '@/src/components/SingleMangaDetail';
import SearchNameBar from '@/src/components/SearchNameBar';
import ActionAlert from '@/src/components/ActionAlert';
import { VaultStats } from '@/src/types/stats';
import VaultStatsPanel from '@/src/components/VaultStatsPanel';

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

  // --- ESTADOS DE ACCIONES (ESTATUS Y SYNC) ---
  const [statusData, setStatusData] = useState<ApiStatus | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  
  const [syncData, setSyncData] = useState<SyncResponse | null>(null);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  
  const [isStatusLoading, setIsStatusLoading] = useState(false); 
  const [previousEndpoint, setPreviousEndpoint] = useState('Top');

  const [showAlert, setShowAlert] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statsData, setStatsData] = useState<VaultStats | null>(null);
  const [alertMessage, setAlertMessage] = useState('');

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
      setPreviousEndpoint('Top');
    } 
    else if (!['Estatus API', 'Sincronizar', 'Agregar Favorito', 'Estadísticas'].includes(activeEndpoint)) {
      setMangas([]);
      setLoading(false);
      setApiError(null);
      setPreviousEndpoint(activeEndpoint);
    }
    
    return () => {
      controller.abort();
      clearTimeout(slowLoadTimeout);
    };
  }, [page, currentType, currentFilter, activeEndpoint, refreshKey]);

  // 2. EFECTO: OBTENER ESTATUS API
  useEffect(() => {
    const fetchStatus = async () => {
      setIsStatusLoading(true);
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
        setIsStatusLoading(false);
        setActiveEndpoint(previousEndpoint);
      }
    };

    if (activeEndpoint === 'Estatus API') {
      fetchStatus();
    }
  }, [activeEndpoint, previousEndpoint]);

  // 3. EFECTO: SINCRONIZAR BÓVEDA
  useEffect(() => {
    const triggerSync = async () => {
      setIsStatusLoading(true);
      try {
        const response = await fetch('/api/v1/mangas/vault/sync', {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Código ${response.status}: ${errorText || response.statusText}`);
        }
        
        const data = await response.json();
        setSyncData(data);
        setIsSyncModalOpen(true);
      } catch (error: any) {
        console.error("Error exacto del Sync:", error);
        alert(`Fallo en la sincronización.\nMotivo: ${error.message}`);
      } finally {
        setIsStatusLoading(false);
        setActiveEndpoint(previousEndpoint);
      }
    };

    if (activeEndpoint === 'Sincronizar') {
      triggerSync();
    }
  }, [activeEndpoint, previousEndpoint]);

  // --- FUNCIÓN DE BÚSQUEDA DE FAVORITOS (GET) ---
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      setApiError(null);
      setPreviousEndpoint('Ver Favoritos');
      
      try {
        const apiPage = page - 1;
        const response = await fetch(`/api/v1/mangas/vault?page=${apiPage}&size=10&sort=title,asc`);
        
        // MANEJO DEL 204: Si la bóveda está vacía
        if (response.status === 204) {
          setMangas([]);
          setHasNextPage(false);
          setLoading(false);
          return; 
        }
        
        if (!response.ok) {
          throw new Error('No se pudo acceder a la bóveda de favoritos.');
        }
        
        const data = await response.json();
        const favMangas = data.content || data.data || (Array.isArray(data) ? data : []);
        setMangas(favMangas);
        setHasNextPage(data.last !== undefined ? !data.last : false);
        
      } catch (error: any) {
        console.error("Error Favorites:", error);
        setApiError(error.message);
        setMangas([]);
      } finally {
        setLoading(false);
      }
    };
    

    if (activeEndpoint === 'Ver Favoritos') {
      fetchFavorites();
    }
  }, [activeEndpoint, page, refreshKey]);

  // --- FUNCIÓN DE ESTADÍSTICAS (GET) ---
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setApiError(null);
      setPreviousEndpoint('Estadísticas');
      
      try {
        const response = await fetch('/api/v1/mangas/vault/stats');
        
        // Si no hay datos (204 No Content)
        if (response.status === 204) {
          setStatsData({ totalMangas: 0, averageScore: 0, countByStatus: {} });
          setLoading(false);
          return;
        }

        if (!response.ok) throw new Error('No se pudieron cargar las estadísticas.');
        
        const data = await response.json();
        setStatsData(data);
      } catch (error: any) {
        console.error("Error Stats:", error);
        setApiError(error.message);
        setStatsData(null);
      } finally {
        setLoading(false);
      }
    };

    if (activeEndpoint === 'Estadísticas') {
      fetchStats();
    }
  }, [activeEndpoint, refreshKey]); // El refreshKey asegura que se actualicen si eliminas un manga

  // --- FUNCIÓN DE BÚSQUEDA DE RECOMENDACIONES ---
  const handleSearchRecommendations = async (id: string) => {
    setLoading(true);
    setApiError(null);
    setPreviousEndpoint('Recomendaciones');
    
    try {
      const response = await fetch(`/api/v1/mangas/vault/${id}/recommendations`);
      
      if (!response.ok) {
        throw new Error('No se pudieron obtener recomendaciones para este ID.');
      }
      
      const data = await response.json();
      setMangas(data || []);
      setHasNextPage(false);
      
    } catch (error: any) {
      console.error("Error Recommendations:", error);
      setApiError(error.message);
      setMangas([]);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIÓN DE BÚSQUEDA POR ID ---
  const handleSearchById = async (id: string) => {
    setLoading(true);
    setApiError(null);
    setPreviousEndpoint('Buscar ID');
    
    try {
      const response = await fetch(`/api/v1/mangas/${id}`);
      
      if (!response.ok) {
        throw new Error('No pudimos encontrar este Manga en la base de datos externa.');
      }
      
      const data = await response.json();
      setMangas([data]); 
      setHasNextPage(false);
      
    } catch (error: any) {
      console.error("Error ID Search:", error);
      setApiError(error.message);
      setMangas([]);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIÓN DE BÚSQUEDA POR NOMBRE ---
  const handleSearchByName = async (name: string) => {
    setLoading(true);
    setApiError(null);
    setPreviousEndpoint('Buscar Nombre');
    
    try {
      const response = await fetch(`/api/v1/mangas/search?q=${encodeURIComponent(name)}`);
      
      if (!response.ok) {
        throw new Error(`No se encontró ningún manga con el título "${name}".`);
      }
      
      const data = await response.json();
      
      // CAMBIO CLAVE: Como data ya es un array (ej: [ {id: 11, title: "Naruto"}, ... ]), 
      // lo pasamos directamente. Si viene nulo o indefinido, pasamos [] por seguridad.
      setMangas(data || []); 
      setHasNextPage(false); // Asumimos que esta búsqueda no tiene paginación por ahora
      
    } catch (error: any) {
      console.error("Error Name Search:", error);
      setApiError(error.message);
      setMangas([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionComplete = (action?: 'added' | 'removed', id?: number | string) => {
    // Definimos el mensaje según lo que pasó
    if (action === 'added') {
      setAlertMessage('¡Manga guardado en tu bóveda! ✨');
    } else {
      setAlertMessage('Manga eliminado de la bóveda 🗑️');
      
      // 🚀 BORRADO OPTIMISTA: Si estamos en Favoritos, lo quitamos del estado local de inmediato
      if (activeEndpoint === 'Ver Favoritos' && id) {
        setMangas(prev => prev.filter(m => m.id !== id));
      }
    }

    setShowAlert(true);
    setRefreshKey(prev => prev + 1); // Recarga real de fondo
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <main 
      className="min-h-screen relative font-sans flex flex-col overflow-hidden"
      style={{
        backgroundImage: "url('https://i.ytimg.com/vi/eAMeMkVsjiw/maxresdefault.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-[#FDFBF7]/85 backdrop-blur-sm z-0 pointer-events-none transition-all duration-700"></div>
      
      <ActionAlert message={alertMessage} isVisible={showAlert} />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto p-4 sm:p-6 flex-1 flex flex-col animate-in fade-in duration-700">
        
        <header className="mb-8 pt-4 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-300/50">
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 text-[#FDFBF7] p-3.5 rounded-2xl shadow-md transform transition hover:scale-105 hover:rotate-3 cursor-default">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight drop-shadow-sm">
                MangaVault
              </h1>
              <p className="text-slate-500 mt-1 font-bold tracking-widest uppercase text-[10px] md:text-xs">
                Explorador & Sincronizador
              </p>
            </div>
          </div>
        </header>

        <EndpointNav 
          activeEndpoint={activeEndpoint} 
          setActiveEndpoint={setActiveEndpoint} 
          isStatusLoading={isStatusLoading}
        />

        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
          {(activeEndpoint === 'Top' || previousEndpoint === 'Top') && (
            <FilterBar 
              activeEndpoint={activeEndpoint === 'Estatus API' || activeEndpoint === 'Sincronizar' ? previousEndpoint : activeEndpoint}
              currentType={currentType}
              setCurrentType={setCurrentType}
              currentFilter={currentFilter}
              setCurrentFilter={setCurrentFilter}
              setPage={setPage}
            />
          )}
        </div>

        <RecommendationBar 
          activeEndpoint={activeEndpoint === 'Estatus API' || activeEndpoint === 'Sincronizar' ? previousEndpoint : activeEndpoint}
          onSearch={handleSearchRecommendations}
          isLoading={loading}
        />

        <SearchIdBar 
          activeEndpoint={activeEndpoint === 'Estatus API' || activeEndpoint === 'Sincronizar' ? previousEndpoint : activeEndpoint}
          onSearch={handleSearchById}
          isLoading={loading}
        />

        <SearchNameBar 
          activeEndpoint={activeEndpoint === 'Estatus API' || activeEndpoint === 'Sincronizar' ? previousEndpoint : activeEndpoint}
          onSearch={handleSearchByName}
          isLoading={loading}
        />
        
        <section aria-label="Resultados de Mangas" className="flex-1 flex flex-col animate-in fade-in duration-700 delay-150">
          
          {loading && slowLoading && (
            <div className="flex justify-center mb-8">
              <div className="bg-white/80 backdrop-blur-md border border-amber-200 text-amber-800 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-lg shadow-amber-900/5 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </div>
                <p className="font-bold text-sm">
                  Despertando la bóveda en Render... <span className="font-medium opacity-80">Esto puede tomar un minuto.</span>
                </p>
              </div>
            </div>
          )}

          {previousEndpoint === 'Estadísticas' ? (
            <VaultStatsPanel 
              loading={loading} 
              error={apiError} 
              stats={statsData} 
            />
          ) : previousEndpoint === 'Buscar ID' ? (
            <SingleMangaDetail 
              loading={loading} 
              error={apiError} 
              manga={mangas[0] || null} 
              onToggle={handleActionComplete}
            />
          ) : (
            <MangaGrid 
              loading={loading} 
              mangas={mangas} 
              page={page} 
              setPage={setPage} 
              hasNextPage={hasNextPage}
              activeEndpoint={previousEndpoint}
              error={apiError}
              onRefresh={handleActionComplete}
            />
          )}
        </section>

        <footer className="mt-12 py-6 border-t border-slate-300/40 text-center text-slate-400 text-sm font-medium">
          MangaVault © {new Date().getFullYear()} — Bóveda de colecciones
        </footer>

      </div>

      <StatusModal 
        isOpen={isStatusModalOpen} 
        onClose={() => setIsStatusModalOpen(false)} 
        data={statusData} 
      />
      
      <SyncAlertModal 
        isOpen={isSyncModalOpen} 
        onClose={() => setIsSyncModalOpen(false)} 
        data={syncData} 
      />
    </main>
  );
}