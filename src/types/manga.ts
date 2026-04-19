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