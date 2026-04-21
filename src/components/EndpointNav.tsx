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
  // 1. Agregamos la propiedad para saber si algo está cargando
  isStatusLoading: boolean; 
}

export default function EndpointNav({ activeEndpoint, setActiveEndpoint, isStatusLoading }: Props) {
  return (
    <nav aria-label="Filtros de endpoints" className="mb-8 w-full">
      <ul className="flex overflow-x-auto sm:flex-wrap gap-3 p-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        {/* 2. Abrimos llaves { } para poder ejecutar lógica antes del return */}
        {ENDPOINTS.map((ep) => {
          
          // 3. Evaluamos si ESTE botón específico es el que debe mostrar el spinner
          const isLoadingThis = (ep.name === 'Estatus API' && isStatusLoading) || (ep.name === 'Sincronizar' && isStatusLoading);

          return (
            <li key={ep.name} className="snap-start shrink-0">
              <button
                onClick={() => setActiveEndpoint(ep.name)}
                aria-pressed={activeEndpoint === ep.name}
                // 4. Deshabilitamos el botón si está cargando para evitar doble clic
                disabled={isLoadingThis} 
                className={`
                  px-6 py-2.5 text-base md:text-lg rounded-full font-bold transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFBF7] flex items-center justify-center gap-2
                  ${ep.color}
                  /* 5. Si está cargando, cambiamos el cursor y lo hacemos semitransparente */
                  ${isLoadingThis ? 'cursor-wait opacity-70 scale-95' : 'cursor-pointer'}
                  
                  /* Lógica normal de hover y selección (solo si NO está cargando) */
                  ${activeEndpoint === ep.name && !isLoadingThis
                    ? 'ring-2 ring-slate-600 ring-offset-2 ring-offset-[#FDFBF7] scale-105 shadow-md z-20' 
                    : (!isLoadingThis && 'opacity-85 hover:opacity-100 hover:scale-105 hover:shadow-md z-10')
                  }
                `}
              >
                {/* 6. Si isLoadingThis es true, dibujamos el SVG del spinner y el texto, si no, solo el nombre */}
                {isLoadingThis ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 h-5 w-5 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Consultando...
                  </>
                ) : (
                  ep.name
                )}
              </button>
            </li>
          );
        })}

      </ul>
    </nav>
  );
}