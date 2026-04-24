'use client';

import { VaultStats } from '@/src/types/stats';

interface Props {
  loading: boolean;
  error: string | null;
  stats: VaultStats | null;
}

export default function VaultStatsPanel({ loading, error, stats }: Props) {
  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-6 animate-pulse p-4">
        <div className="flex-1 h-48 bg-slate-200/70 rounded-3xl"></div>
        <div className="flex-1 h-48 bg-slate-200/70 rounded-3xl"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-10">
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl max-w-md text-center shadow-sm">
          <p className="text-rose-800 font-bold text-lg">Error al cargar estadísticas</p>
          <p className="text-rose-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Si no hay stats o el total es 0
  if (!stats || stats.totalMangas === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 animate-in zoom-in-95 duration-500">
        <div className="bg-white/60 backdrop-blur-xl p-10 rounded-[2.5rem] text-center border border-indigo-50 shadow-xl shadow-indigo-900/5 max-w-md">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Sin Datos</h3>
          <p className="text-slate-500 text-sm font-medium">Agrega mangas a tu bóveda para ver tus estadísticas.</p>
        </div>
      </div>
    );
  }

  // Colores dinámicos para los estados
  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('finish')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s.includes('publish') || s.includes('releas')) return 'bg-sky-100 text-sky-700 border-sky-200';
    if (s.includes('hiatus')) return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-purple-100 text-purple-700 border-purple-200'; // Default
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Estadísticas de tu Bóveda</h2>
        <p className="text-slate-500 font-medium mt-1">Un resumen de tu colección personal</p>
      </div>

      {/* METRICAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Total de Mangas */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2rem] p-8 shadow-xl shadow-indigo-900/10 text-white relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-9xl opacity-20 transform group-hover:scale-110 transition-transform duration-500">📚</div>
          <div className="relative z-10">
            <p className="text-indigo-100 font-bold uppercase tracking-widest text-sm mb-2">Total Coleccionado</p>
            <p className="text-6xl font-black">{stats.totalMangas}</p>
          </div>
        </div>

        {/* Puntuación Promedio */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2rem] p-8 shadow-xl shadow-amber-900/10 text-white relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-9xl opacity-20 transform group-hover:scale-110 transition-transform duration-500">⭐</div>
          <div className="relative z-10">
            <p className="text-amber-100 font-bold uppercase tracking-widest text-sm mb-2">Puntuación Promedio</p>
            <p className="text-6xl font-black">{stats.averageScore.toFixed(2)}</p>
          </div>
        </div>

      </div>

      {/* DESGLOSE POR ESTADO */}
      <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-black text-slate-700 mb-6 uppercase tracking-widest">Desglose por Estado</h3>
        
        <div className="flex flex-wrap gap-4">
          {Object.entries(stats.countByStatus).map(([status, count]) => (
            <div key={status} className={`flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-sm ${getStatusColor(status)}`}>
              <span className="font-black text-lg uppercase tracking-wider">{status}</span>
              <div className="w-px h-6 bg-current opacity-20"></div>
              <span className="text-2xl font-black">{count}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}