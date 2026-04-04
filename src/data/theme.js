import { THEME_URL } from '../config/remoteData'

/**
 * Thèmes couleur (hex + sémantique) et palette résolue pour les blocs.
 * Les clés content* / elevated* / onDark* viennent de theme.json (API) ; voir buildSemanticVars.
 * `contentScheme` à la racine de theme.json : `"light"` | `"dark"` (navbar / chrome). Si absent : déduit de la luminance de `primary.surface`.
 */

function hexToRgb(hex) {
  const raw = hex.replace('#', '')
  const h = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function withAlpha(hex, alpha) {
  const [r, g, b] = hexToRgb(hex)
  return `rgba(${r},${g},${b},${alpha})`
}

const blend = {
  primary: {
    badgeBorder: 0.5,
    badgeBg: 0.7,
    subtleBorder: 0.5,
    subtleBg: 0.8,
    ring: 0.4,
  },
  secondary: {
    badgeBorder: 0.6,
    badgeBg: 0.9,
    subtleBorder: 0.6,
    subtleBg: 1,
    ring: 0.4,
  },
  neutral: {
    badgeBorder: 0.5,
    badgeBg: 0.7,
    subtleBorder: 0.5,
    subtleBg: 0.7,
    ring: 0.4,
  },
}

const fallbackThemes = {
  primary: {
    surface: '#0a0a0a',
    accent: '#f5f5f5',
    badgeBorder: '#525252',
    badgeBg: '#262626',
    badgeText: '#f5f5f5',
    buttonBg: '#ffffff',
    buttonText: '#0a0a0a',
    buttonHover: '#e5e5e5',
    subtleBorder: '#525252',
    subtleBg: '#262626',
    subtleText: '#f5f5f5',
    subtleHover: '#404040',
    ring: '#d4d4d4',
  },
  secondary: {
    surface: '#0a0a0a',
    accent: '#e5e5e5',
    badgeBorder: '#525252',
    badgeBg: '#171717',
    badgeText: '#e5e5e5',
    buttonBg: '#e5e5e5',
    buttonText: '#0a0a0a',
    buttonHover: '#ffffff',
    subtleBorder: '#525252',
    subtleBg: '#171717',
    subtleText: '#e5e5e5',
    subtleHover: '#262626',
    ring: '#a3a3a3',
  },
  neutral: {
    surface: '#0a0a0a',
    accent: '#e5e5e5',
    badgeBorder: '#525252',
    badgeBg: '#262626',
    badgeText: '#e5e5e5',
    buttonBg: '#f5f5f5',
    buttonText: '#171717',
    buttonHover: '#ffffff',
    subtleBorder: '#525252',
    subtleBg: '#262626',
    subtleText: '#e5e5e5',
    subtleHover: '#404040',
    ring: '#737373',
  },
}

/** Luminance relative sRGB (WCAG). Au-dessus du seuil ⇒ surface perçue comme claire. */
function surfaceIsLight(hex) {
  if (!hex || typeof hex !== 'string') {
    return false
  }
  try {
    const [r, g, b] = hexToRgb(hex)
    const lin = (c) => {
      const x = c / 255
      return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
    }
    const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
    return L > 0.55
  } catch {
    return false
  }
}

let remoteThemes = null
/** `light` | `dark` — lu depuis theme.json ou déduit de primary.surface. */
let remoteContentScheme = 'dark'

function resolveContentSchemeFromTheme(next) {
  if (!next || typeof next !== 'object') {
    return 'dark'
  }
  const explicit = next.contentScheme
  if (explicit === 'light' || explicit === 'dark') {
    return explicit
  }
  const surf = next.primary && typeof next.primary.surface === 'string' ? next.primary.surface : null
  if (surf && surfaceIsLight(surf)) {
    return 'light'
  }
  return 'dark'
}

/** Pour `<BlocksThemeProvider contentScheme={…}>` après chargement du thème API. */
export function getContentScheme() {
  return remoteContentScheme
}

/** `primary.surface` résolu (API + fallback) pour `theme-color` / fond `html`. */
export function getPrimarySurface() {
  const t = remoteThemes ?? fallbackThemes
  return t.primary.surface
}

export function setRemoteThemes(next) {
  if (!next) {
    remoteThemes = null
    remoteContentScheme = 'dark'
    return
  }
  remoteContentScheme = resolveContentSchemeFromTheme(next)
  remoteThemes = {
    primary: { ...fallbackThemes.primary, ...next.primary },
    secondary: { ...fallbackThemes.secondary, ...next.secondary },
    neutral: { ...fallbackThemes.neutral, ...next.neutral },
  }
}

function getThemeRegistry() {
  return remoteThemes ?? fallbackThemes
}

const defaultThemeName = 'primary'

function resolveThemeInput(color) {
  const themes = getThemeRegistry()
  if (color && typeof color === 'object') {
    return { theme: { ...themes[defaultThemeName], ...color }, blend: blend[defaultThemeName] }
  }
  const name = typeof color === 'string' && themes[color] ? color : defaultThemeName
  return { theme: themes[name], blend: blend[name] ?? blend[defaultThemeName] }
}

const SEMANTIC_DEFAULTS_DARK = {
  contentEmphasis: '#fafafa',
  contentHeading: '#f5f5f5',
  contentBody: '#d4d4d4',
  contentMuted: '#a3a3a3',
  contentSoft: '#737373',
  contentBorder: '#404040',
  elevatedBg: '#171717',
  elevatedBorder: '#404040',
  elevatedBgSoft: 'rgba(23, 23, 23, 0.55)',
  elevatedBgMid: 'rgba(38, 38, 38, 0.4)',
  elevatedBgFlat: 'rgba(23, 23, 23, 0.7)',
  elevatedBgInset: 'rgba(23, 23, 23, 0.8)',
  elevatedBgNotice: 'rgba(23, 23, 23, 0.6)',
  elevatedBgBand: 'linear-gradient(to bottom right, #171717, #0a0a0a, #171717)',
  elevatedShadow: '0 10px 15px -3px rgb(0 0 0 / 0.25)',
  elevatedShadowLg: '0 25px 50px -12px rgb(0 0 0 / 0.35)',
  elevatedShadowXl: '0 25px 50px -12px rgb(0 0 0 / 0.45)',
  elevatedShadow2xl: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
}

const SEMANTIC_DEFAULTS_LIGHT = {
  contentEmphasis: '#0c0a09',
  contentHeading: '#1c1917',
  contentBody: '#44403c',
  contentMuted: '#78716c',
  contentSoft: '#57534e',
  contentBorder: '#e7e5e4',
  elevatedBg: '#ffffff',
  elevatedBorder: '#e7e5e4',
  elevatedBgSoft: 'rgba(255, 255, 255, 0.92)',
  elevatedBgMid: 'rgba(250, 250, 249, 0.98)',
  elevatedBgFlat: '#fafaf9',
  elevatedBgInset: '#ffffff',
  elevatedBgNotice: 'rgba(255, 247, 237, 0.97)',
  elevatedBgBand: 'linear-gradient(to bottom right, #fff7ed, #ffffff, #fffdfb)',
  elevatedShadow: '0 10px 15px -3px rgb(15 23 42 / 0.06)',
  elevatedShadowLg: '0 25px 50px -12px rgb(15 23 42 / 0.08), 0 0 0 1px rgb(231 229 228 / 0.9)',
  elevatedShadowXl: '0 25px 50px -12px rgb(15 23 42 / 0.1)',
  elevatedShadow2xl: '0 25px 50px -12px rgb(15 23 42 / 0.12)',
}

/**
 * Tokens optionnels dans theme.json (par variante primary | secondary | neutral) :
 * - contentEmphasis … contentSoft, contentBorder — texte sur --p-surface
 * - onDark* — sous-cartes (défaut = content* si omis)
 * - elevatedBg, elevatedBorder, elevatedBgSoft|Mid|Flat|Inset|Notice, elevatedBgBand
 * - elevatedShadow, elevatedShadowLg, elevatedShadowXl, elevatedShadow2xl
 *
 * Si ces clés manquent mais que `surface` est claire, les défauts suivent une palette « fond clair »
 * (évite texte gris clair sur blanc sans tout dupliquer dans l’API).
 */
function buildSemanticVars(theme) {
  const d = surfaceIsLight(theme.surface) ? SEMANTIC_DEFAULTS_LIGHT : SEMANTIC_DEFAULTS_DARK

  const contentEmphasis = theme.contentEmphasis ?? d.contentEmphasis
  const contentHeading = theme.contentHeading ?? d.contentHeading
  const contentBody = theme.contentBody ?? d.contentBody
  const contentMuted = theme.contentMuted ?? d.contentMuted
  const contentSoft = theme.contentSoft ?? d.contentSoft
  const contentBorder = theme.contentBorder ?? d.contentBorder

  return {
    '--p-content-emphasis': contentEmphasis,
    '--p-content-heading': contentHeading,
    '--p-content-body': contentBody,
    '--p-content-muted': contentMuted,
    '--p-content-soft': contentSoft,
    '--p-content-border': contentBorder,
    '--p-on-dark-emphasis': theme.onDarkEmphasis ?? contentEmphasis,
    '--p-on-dark-heading': theme.onDarkHeading ?? contentHeading,
    '--p-on-dark-body': theme.onDarkBody ?? contentBody,
    '--p-on-dark-muted': theme.onDarkMuted ?? contentMuted,
    '--p-on-dark-soft': theme.onDarkSoft ?? contentSoft,
    '--p-elevated-bg': theme.elevatedBg ?? d.elevatedBg,
    '--p-elevated-border': theme.elevatedBorder ?? d.elevatedBorder,
    '--p-elevated-bg-soft': theme.elevatedBgSoft ?? d.elevatedBgSoft,
    '--p-elevated-bg-mid': theme.elevatedBgMid ?? d.elevatedBgMid,
    '--p-elevated-bg-flat': theme.elevatedBgFlat ?? d.elevatedBgFlat,
    '--p-elevated-bg-inset': theme.elevatedBgInset ?? d.elevatedBgInset,
    '--p-elevated-bg-notice': theme.elevatedBgNotice ?? d.elevatedBgNotice,
    '--p-elevated-bg-band': theme.elevatedBgBand ?? d.elevatedBgBand,
    '--p-elevated-shadow': theme.elevatedShadow ?? d.elevatedShadow,
    '--p-elevated-shadow-lg': theme.elevatedShadowLg ?? d.elevatedShadowLg,
    '--p-elevated-shadow-xl': theme.elevatedShadowXl ?? d.elevatedShadowXl,
    '--p-elevated-shadow-2xl': theme.elevatedShadow2xl ?? d.elevatedShadow2xl,
  }
}

function buildCssVars(theme, b) {
  return {
    ...buildSemanticVars(theme),
    '--p-surface': theme.surface,
    '--p-surface-sticky': withAlpha(theme.surface, 0.8),
    '--p-accent': theme.accent,
    '--p-badge-border': withAlpha(theme.badgeBorder, b.badgeBorder),
    '--p-badge-bg': withAlpha(theme.badgeBg, b.badgeBg),
    '--p-badge-text': theme.badgeText,
    '--p-button-bg': theme.buttonBg,
    '--p-button-text': theme.buttonText,
    '--p-button-hover': theme.buttonHover,
    '--p-subtle-border': withAlpha(theme.subtleBorder, b.subtleBorder),
    '--p-subtle-bg': withAlpha(theme.subtleBg, b.subtleBg),
    '--p-subtle-text': theme.subtleText,
    '--p-subtle-hover': theme.subtleHover,
    '--p-ring': withAlpha(theme.ring, b.ring),
  }
}

const classNames = {
  section: 'bg-[var(--p-surface)]',
  accent: 'text-[var(--p-accent)]',
  badge:
    'border border-[color:var(--p-badge-border)] bg-[var(--p-badge-bg)] text-[var(--p-badge-text)]',
  button: 'bg-[var(--p-button-bg)] text-[var(--p-button-text)] hover:bg-[var(--p-button-hover)]',
  subtleButton:
    'border border-[color:var(--p-subtle-border)] bg-[var(--p-subtle-bg)] text-[var(--p-subtle-text)] hover:bg-[var(--p-subtle-hover)]',
  cardRing: 'ring-[color:var(--p-ring)]',
}

export function getColorVariant(color = defaultThemeName) {
  const { theme, blend: b } = resolveThemeInput(color)

  return {
    vars: buildCssVars(theme, b),
    ...classNames,
  }
}

export async function loadRemoteTheme() {
  const res = await fetch(THEME_URL)
  if (!res.ok) {
    throw new Error(`theme.json (${res.status})`)
  }
  const json = await res.json()
  setRemoteThemes(json)
}
