export interface Manga {
  id: number;
  title: string;
  imageUrl: string;
  score: number;
  status: string;
  synopsis?: string;
}

export interface Pagination {
  last_visible_page: number;
  has_next_page: boolean;
}

export interface JikanTopResponse {
  data: Manga[];
  pagination: Pagination;
}

export interface VaultStats {
  totalMangas: number;
  averageScore: number;
  countByStatus: Record<string, number>;
}

export interface MangaItem {
  title: string;
  // Hacemos que el resto sea opcional para que TypeScript no llore si el backend no los manda
  id?: number | string; 
  imageUrl?: string;
  score?: number;
  status?: string;
  chapters?: number;
  synopsis?: string;
}

export interface PaginationData {
  last_visible_page: number;
  has_next_page: boolean;
}

export interface TopMangasResponse {
  data: MangaItem[];
  pagination: PaginationData;
}