export const Messages = {
  CHAMPS_OBLIGATOIRES: 'Veuillez remplir tous les champs obligatoires.',
  LOGIN_INVALIDE: 'Courriel ou mot de passe invalide.',
  CHARGEMENT_LIVRES: 'Chargement des livres...',
  AUCUN_LIVRE: 'Aucun livre à afficher.',
  ERREUR_CHARGEMENT_LIVRES: 'Impossible de charger les livres.',
  LIVRE_AJOUTE: 'Le livre a été ajouté avec succès.',
  LIVRE_MODIFIE: 'Le livre a été modifié avec succès.',
  LIVRE_SUPPRIME: 'Le livre a été supprimé avec succès.',
  LIVRE_INTROUVABLE: 'Livre introuvable.',
  ERREUR_MODIFICATION: 'La modification du livre est impossible.',
  ERREUR_GENERIQUE: 'Une erreur est survenue. Veuillez réessayer.',
  SESSION_EXPIREE: 'Session expirée. Veuillez vous reconnecter.',
  UTILISATEUR_NON_AUTORISE: 'Utilisateur non autorisé.',
  ANNEE_NUMERIQUE: "L'année doit être numérique.",
  ERREUR_CONNEXION_API: 'Impossible de se connecter au serveur.',
} as const;

export const STATUTS_LIVRE = ['À lire', 'En cours', 'Terminé'] as const;
