import { Http, HttpResponse } from '@nativescript/core';
import { API_BASE_URL } from '../config/api.config';
import { Messages } from '../constants/messages';
import { AuthService } from './auth.service';
import { navigateToLogin } from '../utils/navigation.helper';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ApiService {
  private authService = AuthService.getInstance();

  protected async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: object,
    requireAuth = true
  ): Promise<T> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      if (requireAuth) {
        const token = this.authService.getToken();
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const options: Parameters<typeof Http.request>[0] = {
        url: `${API_BASE_URL}${endpoint}`,
        method,
        headers,
      };

      if (body !== undefined) {
        options.content = JSON.stringify(body);
      }

      const response: HttpResponse = await Http.request(options);

      if (response.statusCode === 401) {
        this.authService.logout();
        navigateToLogin(true);
        throw new Error(Messages.SESSION_EXPIREE);
      }

      if (response.statusCode === 403) {
        throw new Error(Messages.UTILISATEUR_NON_AUTORISE);
      }

      if (response.statusCode >= 400) {
        throw new Error(this.extractErrorMessage(response));
      }

      if (response.statusCode === 204 || !response.content) {
        return null as T;
      }

      return JSON.parse(response.content.toString()) as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(Messages.ERREUR_CONNEXION_API);
    }
  }

  private extractErrorMessage(response: HttpResponse): string {
    if (response.statusCode === 404) {
      return Messages.LIVRE_INTROUVABLE;
    }

    try {
      const raw = response.content?.toString() || '{}';
      const data = JSON.parse(raw) as { message?: string; error?: string };
      return data.message || data.error || Messages.ERREUR_GENERIQUE;
    } catch {
      return Messages.ERREUR_GENERIQUE;
    }
  }
}