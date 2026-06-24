import { Frame } from '@nativescript/core';
import { AuthService } from '../services/auth.service';

export function requireAuth(): boolean {
  if (!AuthService.getInstance().isAuthenticated()) {
    Frame.topmost()?.navigate({
      moduleName: 'views/login/login-page',
      clearHistory: true,
      animated: false,
    });
    return false;
  }
  return true;
}

export function navigateToLogin(clearHistory = true): void {
  Frame.topmost()?.navigate({
    moduleName: 'views/login/login-page',
    clearHistory,
    animated: true,
  });
}

export function navigateToBookList(clearHistory = false): void {
  const frame = Frame.topmost();
  if (!clearHistory && frame?.canGoBack()) {
    frame.goBack();
    return;
  }

  frame?.navigate({
    moduleName: 'views/book-list/book-list-page',
    clearHistory,
    animated: true,
  });
}

export function navigateToBookDetail(bookId: number | string): void {
  Frame.topmost()?.navigate({
    moduleName: 'views/book-detail/book-detail-page',
    context: { bookId },
    animated: true,
  });
}

export function navigateToBookAdd(): void {
  Frame.topmost()?.navigate({
    moduleName: 'views/book-add/book-add-page',
    animated: true,
  });
}

export function navigateToBookEdit(bookId: number | string): void {
  Frame.topmost()?.navigate({
    moduleName: 'views/book-edit/book-edit-page',
    context: { bookId },
    animated: true,
  });
}
