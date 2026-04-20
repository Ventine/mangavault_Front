import { Dispatch, SetStateAction } from 'react';

interface Props {
  activeEndpoint: string;
  currentType: string;
  setCurrentType: Dispatch<SetStateAction<string>>;
  currentFilter: string;
  setCurrentFilter: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
}

export default function FilterBar({ activeEndpoint, currentType, setCurrentType, currentFilter, setCurrentFilter, setPage }: Props) {
  // Ocultamos el componente completamente si no estamos en 'Top'
  if (activeEndpoint !== 'Top') return null;

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentType(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentFilter(e.target.value);
    setPage(1);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white/60 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white/50 mb-6 w-fit">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">Formato</span>
        <select 
          value={currentType} 
          onChange={handleTypeChange}
          className="bg-white/80 border-none text-slate-800 font-medium text-sm rounded-xl focus:ring-2 focus:ring-slate-400 p-2 shadow-sm outline-none cursor-pointer transition-all hover:bg-white"
        >
          <option value="manga">📚 Manga</option>
          <option value="novel">📖 Novela</option>
          <option value="lightnovel">⚡ Novela Ligera</option>
          <option value="manhwa">🇰🇷 Manhwa</option>
          <option value="manhua">🇨🇳 Manhua</option>
        </select>
      </div>

      <div className="hidden sm:block w-px h-6 bg-slate-300"></div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-2">Filtro</span>
        <select 
          value={currentFilter} 
          onChange={handleFilterChange}
          className="bg-white/80 border-none text-slate-800 font-medium text-sm rounded-xl focus:ring-2 focus:ring-slate-400 p-2 shadow-sm outline-none cursor-pointer transition-all hover:bg-white"
        >
          <option value="bypopularity">🔥 Popularidad</option>
          <option value="favorite">❤️ Más Favoritos</option>
          <option value="publishing">📡 En Emisión</option>
          <option value="upcoming">🗓️ Próximos</option>
        </select>
      </div>
    </div>
  );
}