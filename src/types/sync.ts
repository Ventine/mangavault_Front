// src/types/sync.ts

export interface SyncResponse {
  totalProcessed: number;
  updatedCount: number;
  failedCount: number;
  details: any[]; // Usamos any[] temporalmente si no sabemos qué trae 'details'
}