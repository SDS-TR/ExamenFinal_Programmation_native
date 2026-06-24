import { Observable } from '@nativescript/core';
import { Messages } from '../../constants/messages';
import { Book } from '../../models/book.model';
import { AuthService } from '../../services/auth.service';
import { BookService } from '../../services/book.service';
import {
  navigateToBookAdd,
  navigateToLogin,
} from '../../utils/navigation.helper';

export class BookListViewModel extends Observable {
  books: Book[] = [];
  statusMessage = '';
  isLoading = false;
  hasError = false;
  isEmpty = false;
  showList = false;

  private bookService = BookService.getInstance();
  private authService = AuthService.getInstance();

  private updateShowList(): void {
    this.showList = !this.isLoading && !this.hasError && !this.isEmpty;
    this.notifyPropertyChange('showList', this.showList);
  }

  async loadBooks(): Promise<void> {
    this.isLoading = true;
    this.hasError = false;
    this.isEmpty = false;
    this.statusMessage = Messages.CHARGEMENT_LIVRES;
    this.notifyPropertyChange('isLoading', this.isLoading);
    this.notifyPropertyChange('hasError', this.hasError);
    this.notifyPropertyChange('isEmpty', this.isEmpty);
    this.updateShowList();
    this.notifyPropertyChange('statusMessage', this.statusMessage);

    try {
      const books = await this.bookService.getAll();
      this.books = books;

      if (books.length === 0) {
        this.isEmpty = true;
        this.statusMessage = Messages.AUCUN_LIVRE;
      } else {
        this.statusMessage = '';
      }

      this.notifyPropertyChange('books', this.books);
      this.notifyPropertyChange('isEmpty', this.isEmpty);
      this.notifyPropertyChange('statusMessage', this.statusMessage);
      this.updateShowList();
    } catch {
      this.hasError = true;
      this.books = [];
      this.statusMessage = Messages.ERREUR_CHARGEMENT_LIVRES;
      this.notifyPropertyChange('books', this.books);
      this.notifyPropertyChange('hasError', this.hasError);
      this.notifyPropertyChange('statusMessage', this.statusMessage);
    } finally {
      this.isLoading = false;
      this.notifyPropertyChange('isLoading', this.isLoading);
      this.updateShowList();
    }
  }

  onAddBook(): void {
    navigateToBookAdd();
  }

  onLogout(): void {
    this.authService.logout();
    navigateToLogin(true);
  }
}
