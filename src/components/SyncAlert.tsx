'use client';

interface SyncData {
  totalProcessed: number;
  updatedCount: number;
  failedCount: number;
  details: any[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: SyncData | null;
}

export default function SyncAlert({ isOpen, onClose, data }: Props) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 p-5 rounded-2xl shadow-2xl w-[340px] flex flex-col gap-4">
        
        {/* Cabecera de la alerta */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-full">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Sincronización Exitosa</h4>
              <p className="text-slate-400 text-xs">Bóveda actualizada</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-2 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
          <div className="flex flex-col items-center">
            <span className="text-slate-400 text-[10px] uppercase font-black tracking-wider">Total</span>
            <span className="text-white font-bold">{data.totalProcessed}</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-700/50">
            <span className="text-emerald-400 text-[10px] uppercase font-black tracking-wider">Updates</span>
            <span className="text-emerald-300 font-bold">{data.updatedCount}</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-700/50">
            <span className="text-rose-400 text-[10px] uppercase font-black tracking-wider">Errores</span>
            <span className="text-rose-300 font-bold">{data.failedCount}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}