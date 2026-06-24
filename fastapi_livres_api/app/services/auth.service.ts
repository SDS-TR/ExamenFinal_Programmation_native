import { ApplicationSettings } from '@nativescript/core';
import { Http, HttpResponse } from '@nativescript/core';
import { API_BASE_URL } from '../config/api.config';
import { Messages } from '../constants/messages';
import { LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'jwt_token';

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  getToken(): string {
    return ApplicationSettings.getString(TOKEN_KEY, '');
  }

  isAuthenticated(): boolean {
    return this.getToken().length > 0;
  }

  private saveToken(token: string): void {
    ApplicationSettings.setString(TOKEN_KEY, token);
  }

  clearToken(): void {
    ApplicationSettings.remove(TOKEN_KEY);
  }

  logout(): void {
    this.clearToken();
  }

  async login(courriel: string, motDePasse: string): Promise<void> {
    try {
      // API FastAPI : email + password
      let response: HttpResponse = await this.sendLoginRequest({
        email: courriel,
        password: motDePasse,
      });

      if (response.statusCode >= 400) {
        throw new Error(this.parseLoginError(response));
      }

      const parsed = JSON.parse(response.content.toString()) as LoginResponse & {
        data?: LoginResponse;
      };
      const token =
        parsed.token ||
        parsed.accessToken ||
        parsed.access_token ||
        parsed.jwt ||
        parsed.data?.token ||
        parsed.data?.accessToken ||
        parsed.data?.access_token ||
        parsed.data?.jwt;

      if (!token) {
        throw new Error(Messages.ERREUR_GENERIQUE);
      }

      this.saveToken(token);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(Messages.ERREUR_CONNEXION_API);
    }
  }

  private parseLoginError(response: HttpResponse): string {
    try {
      const data = JSON.parse(response.content?.toString() || '{}') as {
        message?: string;
        error?: string;
      };
      return data.message || data.error || Messages.LOGIN_INVALIDE;
    } catch {
      return Messages.LOGIN_INVALIDE;
    }
  }

  private sendLoginRequest(payload: object): Promise<HttpResponse> {
    return Http.request({
      url: `${API_BASE_URL}/auth/login`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      content: JSON.stringify(payload),
    });
  }
}
