export interface ApiStatus {
  status: string;
  version: string;
  serverTime: string;
  uptime: string;
  dependencies: {
    database: string;
    external_api_jikan: string;
  };
}