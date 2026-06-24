import { NavigatedData, Page } from '@nativescript/core';
import { requireAuth } from '../../utils/navigation.helper';
import { BookDetailViewModel } from './book-detail-view-model';

let viewModel: BookDetailViewModel;

export function onNavigatingTo(args: NavigatedData): void {
  if (!requireAuth()) {
    return;
  }

  const page = args.object as Page;
  const context = page.navigationContext as { bookId?: number | string };
  const bookId = context?.bookId;

  if (!bookId) {
    viewModel = new BookDetailViewModel(0);
    viewModel.set('errorMessage', 'Identifiant du livre manquant.');
    page.bindingContext = viewModel;
    return;
  }

  viewModel = new BookDetailViewModel(bookId);
  page.bindingContext = viewModel;
  viewModel.loadBook();
}

export function onEditTap(): void {
  viewModel.onEdit();
}

export function onBackTap(): void {
  viewModel.onBack();
}

export function onDeleteTap(): void {
  viewModel.onDelete();
}
