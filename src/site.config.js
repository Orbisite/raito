/**
 * Shell du site Raito — le contenu marketing reste dans content.json (API).
 */
export const siteConfig = {
  defaultLocale: 'fr',
  htmlLang: 'fr',

  ui: {
    loading: { fr: 'Chargement…', en: 'Loading…' },
    loadErrorTitle: {
      fr: 'Impossible de charger le contenu ou le thème.',
      en: 'Could not load content or theme.',
    },
    notFoundTitle: { fr: 'Page introuvable', en: 'Page not found' },
    notFoundLink: { fr: 'Retour à l’accueil', en: 'Back to home' },
  },

  meta: {
    title: 'Raito — Artiste 3D',
    description: 'Portfolio 3D — personnages, environnements, assets.',
    siteUrl: 'https://example.com',
  },
}

export function uiString(ui, locale) {
  const block = siteConfig.ui[ui]
  if (!block) return ''
  return block[locale] ?? block.fr ?? block.en ?? ''
}
