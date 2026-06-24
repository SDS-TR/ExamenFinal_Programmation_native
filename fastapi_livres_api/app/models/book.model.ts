export interface Book {
  id: number | string;
  titre: string;
  auteur: string;
  annee: number;
  statut: string;
  commentaire?: string;
}

export interface BookFormData {
  titre: string;
  auteur: string;
  annee: number;
  statut: string;
  commentaire?: string;
}

/** Format attendu par l'API FastAPI (POST/PUT /books). */
export interface ApiBookPayload {
  title: string;
  author: string;
  year: number;
  status: string;
  comment?: string;
}

export function toApiBookPayload(book: BookFormData): ApiBookPayload {
  return {
    title: book.titre,
    author: book.auteur,
    year: book.annee,
    status: book.statut,
    comment: book.commentaire,
  };
}

/** Normalise la réponse API (champs FR ou EN). */
export function mapBook(raw: Record<string, unknown>): Book {
  return {
    id: raw.id as number | string,
    titre: String(raw.titre ?? raw.title ?? ''),
    auteur: String(raw.auteur ?? raw.author ?? ''),
    annee: Number(raw.annee ?? raw.year ?? 0),
    statut: String(raw.statut ?? raw.status ?? ''),
    commentaire: (raw.commentaire ?? raw.comment) as string | undefined,
  };
}
