import { Observable } from '@nativescript/core';
import { Messages } from '../../constants/messages';
import { Book } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import {
  navigateToBookEdit,
  navigateToBookList,
} from '../../utils/navigation.helper';

export class BookDetailViewModel extends Observable {
  book: Book | null = null;
  errorMessage = '';
  isLoading = false;
  commentaireDisplay = 'Aucun commentaire';

  private bookService = BookService.getInstance();
  private bookId: number | string;

  constructor(bookId: number | string) {
    super();
    this.bookId = bookId;
  }

  async loadBook(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';
    this.notifyPropertyChange('isLoading', this.isLoading);
    this.notifyPropertyChange('errorMessage', this.errorMessage);

    try {
      this.book = await this.bookService.getById(this.bookId);
      this.commentaireDisplay =
        this.book.commentaire?.trim() || 'Aucun commentaire';
      this.notifyPropertyChange('book', this.book);
      this.notifyPropertyChange('commentaireDisplay', this.commentaireDisplay);
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : Messages.LIVRE_INTROUVABLE;
      this.notifyPropertyChange('errorMessage', this.errorMessage);
    } finally {
      this.isLoading = false;
      this.notifyPropertyChange('isLoading', this.isLoading);
    }
  }

  onEdit(): void {
    navigateToBookEdit(this.bookId);
  }

  onBack(): void {
    navigateToBookList();
  }

  async onDelete(): Promise<boolean> {
    const { confirm, alert } = await import('@nativescript/core');
    const confirmed = await confirm({
      title: 'Supprimer le livre',
      message: 'Voulez-vous vraiment supprimer ce livre ?',
      okButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });

    if (!confirmed) {
      return false;
    }

    try {
      await this.bookService.delete(this.bookId);
      await alert({
        title: 'Succès',
        message: Messages.LIVRE_SUPPRIME,
        okButtonText: 'OK',
      });
      navigateToBookList();
      return true;
    } catch (error) {
      await alert({
        title: 'Erreur',
        message:
          error instanceof Error ? error.message : Messages.ERREUR_GENERIQUE,
        okButtonText: 'OK',
      });
      return false;
    }
  }
}
