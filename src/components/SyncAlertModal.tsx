// src/components/SyncAlertModal.tsx
'use client';

import { SyncResponse } from '@/src/types/sync';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: SyncResponse | null;
}

export default function SyncAlertModal({ isOpen, onClose, data }: Props) {
  if (!isOpen || !data) return null;

  // Lógica de colores: Si hay fallos, el tema se vuelve rojo/naranja. Si todo está en 0 o fue éxito, es azul/esmeralda.
  const hasErrors = data.failedCount > 0;
  const isZero = data.totalProcessed === 0;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 animate-in zoom-in-95">
        
        {/* Cabecera (Cambia de color según el resultado) */}
        <div className={`p-6 text-center ${hasErrors ? 'bg-rose-50' : isZero ? 'bg-slate-50' : 'bg-blue-50'}`}>
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
            <span className="text-3xl">
              {hasErrors ? '⚠️' : isZero ? '🤷‍♂️' : '✨'}
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-800">
            {hasErrors ? 'Sincronización con Errores' : 'Sincronización Finalizada'}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Bóveda de mangas actualizada.
          </p>
        </div>

        {/* Métricas de Resultado */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            
            {/* Procesados */}
            <div className="bg-slate-50 p-3 rounded-2xl">
              <p className="text-2xl font-black text-slate-700">{data.totalProcessed}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Leídos</p>
            </div>

            {/* Actualizados */}
            <div className="bg-emerald-50 p-3 rounded-2xl">
              <p className="text-2xl font-black text-emerald-600">{data.updatedCount}</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-1">Nuevos</p>
            </div>

            {/* Fallidos */}
            <div className="bg-rose-50 p-3 rounded-2xl">
              <p className={`text-2xl font-black ${hasErrors ? 'text-rose-600' : 'text-slate-300'}`}>
                {data.failedCount}
              </p>
              <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${hasErrors ? 'text-rose-500' : 'text-slate-400'}`}>
                Fallos
              </p>
            </div>

          </div>
        </div>

        {/* Botón de Cierre */}
        <div className="p-4 pt-0">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all active:scale-95 shadow-md"
          >
            Aceptar
          </button>
        </div>

      </div>
    </div>
  );
}