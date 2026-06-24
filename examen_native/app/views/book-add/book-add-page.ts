import { EventData, ListPicker, NavigatedData, Page, TextField, TextView } from '@nativescript/core';
import { requireAuth } from '../../utils/navigation.helper';
import { BookFormViewModel } from '../shared/book-form-view-model';

let viewModel: BookFormViewModel;

export function onNavigatingTo(args: NavigatedData): void {
  if (!requireAuth()) {
    return;
  }

  const page = args.object as Page;
  viewModel = new BookFormViewModel();
  page.bindingContext = viewModel;
}

export function onTitreChange(args: EventData): void {
  viewModel.set('titre', (args.object as TextField).text);
}

export function onAuteurChange(args: EventData): void {
  viewModel.set('auteur', (args.object as TextField).text);
}

export function onAnneeChange(args: EventData): void {
  viewModel.set('annee', (args.object as TextField).text);
}

export function onStatutChange(args: EventData): void {
  const picker = args.object as ListPicker;
  viewModel.setStatutIndex(picker.selectedIndex);
}

export function onCommentaireChange(args: EventData): void {
  viewModel.set('commentaire', (args.object as TextView).text);
}

export function onSubmitTap(): void {
  viewModel.onSubmit();
}

export function onCancelTap(): void {
  viewModel.onCancel();
}
