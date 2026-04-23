'use client';

import { useState } from 'react';

interface Props {
  mangaId?: number | string;
  isInitiallyFavorite?: boolean; // NUEVO: Para saber si ya es favorito al cargar
  onToggle?: () => void;
}

export default function FavoriteButton({ mangaId, isInitiallyFavorite = false, onToggle }: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Estado real: El corazón sabe si está activo o no
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);

  if (!mangaId) return null;

const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsProcessing(true);
    setStatus('idle');

    try {
      if (isFavorite) {
        // 1. ELIMINAR (DELETE)
        const response = await fetch(`/api/v1/mangas/vault/${mangaId}`, {
          method: 'DELETE',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Fallo al eliminar');
        setIsFavorite(false); // Apagamos el corazón localmente
        
      } else {
        // 2. AGREGAR (POST)
        const response = await fetch(`/api/v1/mangas/vault/${mangaId}`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) throw new Error('Fallo al agregar');
        setIsFavorite(true); // Encendemos el corazón localmente
      }

      // 3. ÉXITO (COMÚN PARA AMBOS CASOS)
      setStatus('success');
      
      // ¡AQUÍ ESTÁ LA MAGIA! Avisamos a la página principal que algo cambió
      if (onToggle) {
        onToggle(); 
      }
      
      setTimeout(() => setStatus('idle'), 2000);

    } catch (error) {
      console.error("Error Favorite:", error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isProcessing}
      title={isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
      className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md shadow-sm transition-all duration-300 z-20 outline-none focus-visible:ring-2 focus-visible:ring-rose-400 group
        ${isProcessing ? 'bg-slate-100/80 cursor-wait scale-95' : 'bg-white/70 hover:bg-rose-50 cursor-pointer hover:scale-110'}
        ${status === 'error' ? 'bg-rose-100/90 ring-2 ring-rose-400' : ''}
      `}
    >
      {isProcessing ? (
        <svg className="animate-spin h-5 w-5 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : status === 'error' ? (
        <span className="text-rose-600 font-black text-sm">✗</span>
      ) : (
        // Si isFavorite es true, el corazón se pinta de rojo sólido
        <svg className={`w-5 h-5 transition-colors ${isFavorite ? 'text-rose-500' : 'text-slate-400 group-hover:text-rose-400'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      )}
    </button>
  );
}