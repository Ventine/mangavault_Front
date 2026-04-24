'use client';

import { useState, useEffect } from 'react';

interface Props {
  mangaId?: number | string;
  isInitiallyFavorite?: boolean;
  // NUEVO: El botón ahora avisa qué hizo y sobre qué ID
  onToggle?: (action: 'added' | 'removed', id: number | string) => void;
  displayMode?: 'icon' | 'text';
}

export default function FavoriteButton({ mangaId, isInitiallyFavorite = false, onToggle, displayMode = 'icon' }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);

  useEffect(() => {
    const checkVault = async () => {
      if (!mangaId || isInitiallyFavorite) return;
      try {
        const response = await fetch(`/api/v1/mangas/vault/${mangaId}`);
        if (response.ok) setIsFavorite(true);
      } catch (err) {
        setIsFavorite(false);
      }
    };
    checkVault();
  }, [mangaId, isInitiallyFavorite]);

  if (!mangaId) return null;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsProcessing(true);
    setStatus('idle');
    let currentAction: 'added' | 'removed' = 'added';

    try {
      if (isFavorite) {
        const response = await fetch(`/api/v1/mangas/vault/${mangaId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error();
        setIsFavorite(false);
        currentAction = 'removed';
      } else {
        const response = await fetch(`/api/v1/mangas/vault/${mangaId}`, { method: 'POST' });
        if (!response.ok) throw new Error();
        setIsFavorite(true);
        currentAction = 'added';
      }

      setStatus('success');
      // ENVIAMOS LA ACCIÓN EXACTA HACIA ARRIBA
      if (onToggle) onToggle(currentAction, mangaId);
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  if (displayMode === 'text' && isFavorite && status !== 'error') {
    return (
      <div className="absolute top-4 right-4 animate-in zoom-in duration-300 z-20">
        <div className="bg-emerald-100/90 backdrop-blur-md border border-emerald-200 px-4 py-2 rounded-3xl shadow-sm flex items-center gap-2">
          <span className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">En tu Bóveda</span>
          <button 
            onClick={handleToggleFavorite}
            disabled={isProcessing}
            className="cursor-pointer text-emerald-400 hover:text-rose-500 transition-colors ml-1 p-0.5 disabled:opacity-50 outline-none"
            title="Quitar de la bóveda"
          >
            {isProcessing ? (
              <div className="animate-spin h-4 w-4 border-2 border-rose-500 border-t-transparent rounded-full" />
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isProcessing}
      title={isInitiallyFavorite ? "Eliminar de la bóveda" : (isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos")}
      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 z-20 outline-none
        ${isProcessing ? 'bg-slate-100/80 cursor-wait' : 'bg-white/70 hover:bg-rose-50 cursor-pointer hover:scale-110'}
        ${status === 'error' ? 'bg-rose-100/90 ring-2 ring-rose-400' : ''}
      `}
    >
      {isProcessing ? (
        <div className="animate-spin h-5 w-5 border-2 border-rose-500 border-t-transparent rounded-full" />
      ) : isInitiallyFavorite ? (
        // NUEVO: Si estamos dentro de la bóveda, mostramos un Bote de Basura
        <svg className="w-5 h-5 transition-colors text-rose-500 hover:text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ) : (
        <svg className={`w-5 h-5 transition-colors ${isFavorite ? 'text-rose-500' : 'text-slate-400 group-hover:text-rose-400'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      )}
    </button>
  );
}