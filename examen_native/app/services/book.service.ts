import { Messages } from '../constants/messages';
import { Book, BookFormData, mapBook, toApiBookPayload } from '../models/book.model';
import { ApiService } from './api.service';

export class BookService extends ApiService {
  private static instance: BookService;

  static getInstance(): BookService {
    if (!BookService.instance) {
      BookService.instance = new BookService();
    }
    return BookService.instance;
  }

  private normalizeList(result: unknown): Book[] {
    let items: Record<string, unknown>[] = [];

    if (Array.isArray(result)) {
      items = result as Record<string, unknown>[];
    } else if (result && typeof result === 'object' && 'data' in result) {
      const data = (result as { data: unknown }).data;
      items = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
    }

    return items.map(mapBook);
  }

  async getAll(): Promise<Book[]> {
    try {
      const result = await this.request<unknown>('GET', '/books');
      return this.normalizeList(result);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(Messages.ERREUR_CHARGEMENT_LIVRES);
    }
  }

  async getById(id: number | string): Promise<Book> {
    try {
      const result = await this.request<Record<string, unknown>>('GET', `/books/${id}`);
      return mapBook(result);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(Messages.LIVRE_INTROUVABLE);
    }
  }

  async create(book: BookFormData): Promise<Book> {
    try {
      const result = await this.request<Record<string, unknown>>(
        'POST',
        '/books',
        toApiBookPayload(book)
      );
      return mapBook(result);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(Messages.ERREUR_GENERIQUE);
    }
  }

  async update(id: number | string, book: BookFormData): Promise<Book> {
    try {
      const result = await this.request<Record<string, unknown>>(
        'PUT',
        `/books/${id}`,
        toApiBookPayload(book)
      );
      return mapBook(result);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          error.message === Messages.LIVRE_INTROUVABLE
            ? Messages.ERREUR_MODIFICATION
            : error.message
        );
      }
      throw new Error(Messages.ERREUR_MODIFICATION);
    }
  }

  async delete(id: number | string): Promise<void> {
    try {
      await this.request<void>('DELETE', `/books/${id}`);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(Messages.ERREUR_GENERIQUE);
    }
  }
}
