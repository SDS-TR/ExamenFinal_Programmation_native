import { Observable } from '@nativescript/core';
import { Messages, STATUTS_LIVRE } from '../../constants/messages';
import { BookFormData } from '../../models/book.model';
import { BookService } from '../../services/book.service';
import { navigateToBookList } from '../../utils/navigation.helper';

export class BookFormViewModel extends Observable {
  titre = '';
  auteur = '';
  annee = '';
  statut = STATUTS_LIVRE[0] as string;
  commentaire = '';
  statuts = [...STATUTS_LIVRE];
  statutIndex = 0;
  pageTitle = 'Ajouter un livre';
  submitLabel = 'Ajouter';
  errorMessage = '';
  isLoading = false;
  isEditMode = false;

  private bookService = BookService.getInstance();
  private bookId?: number | string;

  constructor(bookId?: number | string) {
    super();
    if (bookId !== undefined) {
      this.bookId = bookId;
      this.isEditMode = true;
      this.pageTitle = 'Modifier un livre';
      this.submitLabel = 'Enregistrer';
    }
    this.notifyPropertyChange('pageTitle', this.pageTitle);
    this.notifyPropertyChange('submitLabel', this.submitLabel);
    this.notifyPropertyChange('isEditMode', this.isEditMode);
    this.notifyPropertyChange('statuts', this.statuts);
  }

  setStatutIndex(index: number): void {
    this.statutIndex = index;
    this.statut = this.statuts[index] ?? STATUTS_LIVRE[0];
    this.notifyPropertyChange('statutIndex', this.statutIndex);
    this.notifyPropertyChange('statut', this.statut);
  }

  private syncStatutIndex(): void {
    const index = this.statuts.indexOf(this.statut as (typeof STATUTS_LIVRE)[number]);
    this.statutIndex = index >= 0 ? index : 0;
    this.notifyPropertyChange('statutIndex', this.statutIndex);
  }

  async loadBookIfEdit(): Promise<void> {
    if (!this.isEditMode || this.bookId === undefined) {
      return;
    }

    this.isLoading = true;
    this.notifyPropertyChange('isLoading', this.isLoading);

    try {
      const book = await this.bookService.getById(this.bookId);
      this.titre = book.titre;
      this.auteur = book.auteur;
      this.annee = String(book.annee);
      this.statut = book.statut;
      this.commentaire = book.commentaire || '';
      this.syncStatutIndex();
      this.notifyPropertyChange('titre', this.titre);
      this.notifyPropertyChange('auteur', this.auteur);
      this.notifyPropertyChange('annee', this.annee);
      this.notifyPropertyChange('statut', this.statut);
      this.notifyPropertyChange('commentaire', this.commentaire);
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : Messages.LIVRE_INTROUVABLE;
      this.notifyPropertyChange('errorMessage', this.errorMessage);
    } finally {
      this.isLoading = false;
      this.notifyPropertyChange('isLoading', this.isLoading);
    }
  }

  private validate(): string | null {
    if (
      !this.titre?.trim() ||
      !this.auteur?.trim() ||
      !this.annee?.trim() ||
      !this.statut?.trim()
    ) {
      return Messages.CHAMPS_OBLIGATOIRES;
    }
    if (!/^\d+$/.test(this.annee.trim())) {
      return Messages.ANNEE_NUMERIQUE;
    }
    return null;
  }

  private buildPayload(): BookFormData {
    return {
      titre: this.titre.trim(),
      auteur: this.auteur.trim(),
      annee: parseInt(this.annee.trim(), 10),
      statut: this.statut.trim(),
      commentaire: this.commentaire?.trim() || undefined,
    };
  }

  async onSubmit(): Promise<void> {
    this.errorMessage = '';
    this.notifyPropertyChange('errorMessage', this.errorMessage);

    const validationError = this.validate();
    if (validationError) {
      this.errorMessage = validationError;
      this.notifyPropertyChange('errorMessage', this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.notifyPropertyChange('isLoading', this.isLoading);

    try {
      const payload = this.buildPayload();

      if (this.isEditMode && this.bookId !== undefined) {
        await this.bookService.update(this.bookId, payload);
      } else {
        await this.bookService.create(payload);
      }

      const { alert } = await import('@nativescript/core');
      await alert({
        title: 'Succès',
        message: this.isEditMode ? Messages.LIVRE_MODIFIE : Messages.LIVRE_AJOUTE,
        okButtonText: 'OK',
      });

      navigateToBookList();
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : Messages.ERREUR_GENERIQUE;
      this.notifyPropertyChange('errorMessage', this.errorMessage);
    } finally {
      this.isLoading = false;
      this.notifyPropertyChange('isLoading', this.isLoading);
    }
  }

  onCancel(): void {
    navigateToBookList();
  }
}
