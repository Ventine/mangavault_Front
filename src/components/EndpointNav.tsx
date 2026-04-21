import { Dispatch, SetStateAction } from 'react';

const ENDPOINTS = [
  { name: 'Top', color: 'bg-rose-200 hover:bg-rose-300 text-rose-900' },
  { name: 'Recomendaciones', color: 'bg-pink-200 hover:bg-pink-300 text-pink-900' },
  { name: 'Buscar Nombre', color: 'bg-sky-200 hover:bg-sky-300 text-sky-900' },
  { name: 'Buscar ID', color: 'bg-indigo-200 hover:bg-indigo-300 text-indigo-900' },
  { name: 'Ver Favoritos', color: 'bg-amber-200 hover:bg-amber-300 text-amber-900' },
  { name: 'Estadísticas', color: 'bg-purple-200 hover:bg-purple-300 text-purple-900' },
  { name: 'Estatus API', color: 'bg-slate-300 hover:bg-slate-400 text-slate-900' },
  { name: 'Sincronizar', color: 'bg-blue-200 hover:bg-blue-300 text-blue-900' },
];

interface Props {
  activeEndpoint: string;
  setActiveEndpoint: Dispatch<SetStateAction<string>>;
}

export default function EndpointNav({ activeEndpoint, setActiveEndpoint }: Props) {
  return (
    <nav aria-label="Filtros de endpoints" className="mb-8 w-full">
      <ul className="flex overflow-x-auto sm:flex-wrap gap-3 p-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {ENDPOINTS.map((ep) => (
          <li key={ep.name} className="snap-start shrink-0">
            <button
              onClick={() => setActiveEndpoint(ep.name)}
              aria-pressed={activeEndpoint === ep.name}
              // Se agregó 'cursor-pointer' y mejoramos el focus para el teclado
              className={`cursor-pointer px-6 py-2.5 text-base md:text-lg rounded-full font-bold transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7]
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
  );
}