'use client'; // Necesario porque usaremos useEffect y useState

import { useEffect, useState } from 'react';
import api from '@/src/services/api';
import { Manga, JikanTopResponse } from '@/src/types/manga';
import MangaCard from '@/src/components/MangaCard';

export default function Home() {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await api.get<JikanTopResponse>('/mangas/top');
        setMangas(response.data.data);
      } catch (error) {
        console.error("Error al cargar mangas", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-blue-500 font-mono">
      Cargando Bóveda...
    </div>
  );

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <header className="max-w-7xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          MangaVault Explorer
        </h1>
        <p className="text-gray-400 mt-2">Descubre y guarda tus historias favoritas</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {mangas.map((manga) => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>
    </main>
  );
}