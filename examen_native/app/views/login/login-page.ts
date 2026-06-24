import { EventData, NavigatedData, Page, TextField } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { navigateToBookList } from '../../utils/navigation.helper';
import { LoginViewModel } from './login-view-model';

let viewModel: LoginViewModel;

export function onNavigatingTo(args: NavigatedData): void {
  if (AuthService.getInstance().isAuthenticated()) {
    navigateToBookList(true);
    return;
  }

  const page = args.object as Page;
  viewModel = new LoginViewModel();
  page.bindingContext = viewModel;
}

export function onCourrielChange(args: EventData): void {
  viewModel.set('courriel', (args.object as TextField).text);
}

export function onMotDePasseChange(args: EventData): void {
  viewModel.set('motDePasse', (args.object as TextField).text);
}

export function onLoginTap(): void {
  viewModel.onLogin();
}
