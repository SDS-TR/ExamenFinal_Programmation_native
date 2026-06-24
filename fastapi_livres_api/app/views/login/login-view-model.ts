import { Observable } from '@nativescript/core';
import { Messages } from '../../constants/messages';
import { AuthService } from '../../services/auth.service';
import { navigateToBookList } from '../../utils/navigation.helper';

export class LoginViewModel extends Observable {
  courriel = '';
  motDePasse = '';
  errorMessage = '';
  isLoading = false;

  private authService = AuthService.getInstance();

  async onLogin(): Promise<void> {
    this.errorMessage = '';

    if (!this.courriel?.trim() || !this.motDePasse?.trim()) {
      this.errorMessage = Messages.CHAMPS_OBLIGATOIRES;
      this.notifyPropertyChange('errorMessage', this.errorMessage);
      return;
    }

    this.isLoading = true;
    this.notifyPropertyChange('isLoading', this.isLoading);

    try {
      await this.authService.login(this.courriel.trim(), this.motDePasse);
      navigateToBookList(true);
    } catch (error) {
      this.errorMessage =
        error instanceof Error ? error.message : Messages.LOGIN_INVALIDE;
      this.notifyPropertyChange('errorMessage', this.errorMessage);
    } finally {
      this.isLoading = false;
      this.notifyPropertyChange('isLoading', this.isLoading);
    }
  }
}
