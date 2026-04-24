export interface VaultStats {
  totalMangas: number;
  averageScore: number;
  countByStatus: Record<string, number>; // Un objeto con claves dinámicas (ej: "Finished": 1)
}