import { Manga } from '@/src/types/manga';
import { Star } from 'lucide-react';

export default function MangaCard({ manga }: { manga: Manga }) {
  return (
    <div className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-blue-500 transition-all duration-300 shadow-xl">
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={manga.imageUrl} 
          alt={manga.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-white font-bold truncate text-sm" title={manga.title}>
          {manga.title}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center text-yellow-500 text-xs">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {manga.score || 'N/A'}
          </div>
          <span className="px-2 py-0.5 bg-blue-600 text-[10px] text-white rounded-full uppercase font-semibold">
            {manga.status}
          </span>
        </div>
      </div>
    </div>
  );
}