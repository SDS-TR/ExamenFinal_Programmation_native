import { isAndroid } from '@nativescript/core';

/**
 * URL de base de l'API FastAPI locale.
 * Android émulateur -> machine hote: 10.0.2.2
 * iOS simulateur -> machine hote: localhost
 */
const API_SCHEME = 'http';
const API_PORT = '8000';
const API_HOST = isAndroid ? '10.0.2.2' : 'localhost';

export const API_BASE_URL = `${API_SCHEME}://${API_HOST}:${API_PORT}`;
