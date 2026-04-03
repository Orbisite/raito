/**
 * URLs du dépôt raito-api. Surchargées par `.env.local` (VITE_*).
 * Valeurs par défaut : branche main du dépôt `raito-api` sous le compte **Orbisite** (à adapter).
 */
const RAW_BASE = 'https://raw.githubusercontent.com/Orbisite/raito-api/main'

export const CONTENT_URL = import.meta.env.VITE_CONTENT_URL ?? `${RAW_BASE}/content.json`

export const THEME_URL = import.meta.env.VITE_THEME_URL ?? `${RAW_BASE}/theme.json`

export const SITE_URL = import.meta.env.VITE_SITE_URL ?? `${RAW_BASE}/site.json`

export const API_IMG_BASE = import.meta.env.VITE_API_IMG_BASE ?? `${RAW_BASE}/img`
