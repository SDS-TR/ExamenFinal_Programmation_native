export interface LoginRequest {
  courriel: string;
  motDePasse: string;
}

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  jwt?: string;
}
