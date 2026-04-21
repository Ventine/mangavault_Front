'use client';

import { ApiStatus } from '@/src/types/status';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: ApiStatus | null;
}

export default function StatusModal({ isOpen, onClose, data }: Props) {
  if (!isOpen || !data) return null;

  const isOperational = data.status === 'OPERATIONAL';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white animate-in zoom-in-95">
        
        {/* Encabezado con degradado dinámico */}
        <div className={`p-6 text-white ${isOperational ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-rose-400 to-orange-500'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Estatus del Sistema</h2>
              <p className="text-white/80 text-sm font-medium">Versión {data.version}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
              <span className="text-3xl">{isOperational ? '🚀' : '⚠️'}</span>
            </div>
          </div>
        </div>

        {/* Cuerpo del Dashboard */}
        <div className="p-6 space-y-4">
          {/* Fila de Uptime y Tiempo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Tiempo de Actividad</p>
              <p className="text-slate-700 font-bold text-sm mt-1">{data.uptime}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Hora del Servidor</p>
              <p className="text-slate-700 font-bold text-sm mt-1">
                {new Date(data.serverTime).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* Dependencias */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Dependencias</h3>
            
            {/* Base de Datos */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="bg-emerald-100 p-2 rounded-lg text-lg">🍃</span>
                <span className="font-bold text-slate-700">Base de Datos</span>
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
                {data.dependencies.database.includes('UP') ? 'Conectado' : 'Error'}
              </span>
            </div>

            {/* API Externa */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="bg-sky-100 p-2 rounded-lg text-lg">🌐</span>
                <span className="font-bold text-slate-700">Jikan API (V4)</span>
              </div>
              <span className="text-xs font-black text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase">
                {data.dependencies.external_api_jikan}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}