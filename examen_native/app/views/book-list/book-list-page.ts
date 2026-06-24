import { ItemEventData, NavigatedData, Page } from '@nativescript/core';
import { Book } from '../../models/book.model';
import { requireAuth, navigateToBookDetail } from '../../utils/navigation.helper';
import { BookListViewModel } from './book-list-view-model';

let viewModel: BookListViewModel;

export function onNavigatingTo(args: NavigatedData): void {
  if (!requireAuth()) {
    return;
  }

  const page = args.object as Page;
  if (!viewModel) {
    viewModel = new BookListViewModel();
  }
  page.bindingContext = viewModel;
  viewModel.loadBooks();
}

export function onBookTap(args: ItemEventData): void {
  const book = viewModel.books[args.index] as Book;
  if (book?.id) {
    navigateToBookDetail(book.id);
  }
}

export function onAddBookTap(): void {
  viewModel.onAddBook();
}

export function onLogoutTap(): void {
  viewModel.onLogout();
  viewModel = undefined as unknown as BookListViewModel;
}

export function onNavigatedTo(): void {
  if (viewModel) {
    viewModel.loadBooks();
  }
}

export function onRefresh(): void {
  viewModel.loadBooks();
}
