/**
 * Portfolio Raito — blocs variés (navbar floating, galerie, split, stats, CTA strip…).
 */
import { resolveForLocale } from '../utils/localeUtils'
import { extractContentImages } from '../utils/siteImages'

export const DEFAULT_SECTION_ORDER = [
  'navbar',
  'hero',
  'logoCloud',
  'gallery',
  'features',
  'splitContent',
  'stats',
  'ctaBanner',
  'footer',
]

export function buildPageConfig(content, locale = 'fr', onLocaleChange = () => {}, options = {}) {
  const {
    sections = null,
    spaLinkComponent = null,
    logoHref = '#',
  } = options

  const order =
    Array.isArray(sections) && sections.length > 0 ? sections : DEFAULT_SECTION_ORDER

  const images = extractContentImages(content) ?? {}
  const nav = resolveForLocale(locale, content.navbar)
  const hero = resolveForLocale(locale, content.hero)
  const logoCloud = resolveForLocale(locale, content.logoCloud)
  const gallery = resolveForLocale(locale, content.gallery)
  const features = resolveForLocale(locale, content.features)
  const splitContent = resolveForLocale(locale, content.splitContent)
  const stats = resolveForLocale(locale, content.stats)
  const ctaBanner = resolveForLocale(locale, content.ctaBanner)
  const footer = resolveForLocale(locale, content.footer)

  const galleryItems =
    Array.isArray(images.gallery) && Array.isArray(gallery?.captions) ?
      images.gallery.map((src, index) => ({
        src,
        alt: gallery.captions[index] ?? `Work ${index + 1}`,
        caption: gallery.captions[index],
      }))
    : []

  const logoItems =
    Array.isArray(logoCloud?.items) ?
      logoCloud.items.map((item) => ({
        name: typeof item.name === 'object' ? resolveForLocale(locale, item.name) : item.name,
        logoSrc: item.logoSrc,
        href: item.href,
      }))
    : []

  const statsItems =
    Array.isArray(stats?.items) ?
      stats.items.map((item) => ({
        label: resolveForLocale(locale, item.label),
        value: item.value,
        hint: item.hint != null ? resolveForLocale(locale, item.hint) : undefined,
      }))
    : []

  const blocks = {
    navbar: () => ({
      type: 'navbar',
      props: {
        logo: nav.logo,
        logoSrc: images.logo,
        links: nav.links,
        ctaText: nav.cta,
        ctaHref: nav.ctaHref ?? '#contact',
        sticky: true,
        variant: 'floating',
        color: 'primary',
        contentWidth: '7xl',
        locale,
        menuLabel: nav.menu,
        closeLabel: nav.close,
        onLocaleChange,
        spaLinkComponent,
        logoHref,
      },
    }),
    hero: () => ({
      type: 'hero',
      props: {
        sectionId: 'hero',
        eyebrow: hero.eyebrow,
        title: hero.title,
        subtitle: hero.subtitle,
        ctaText: hero.cta,
        ctaHref: hero.ctaHref ?? '#gallery',
        variant: 'split',
        color: 'primary',
        titleSize: 'lg',
        sectionPadding: 'spacious',
        contentWidth: '7xl',
        headerAlign: 'start',
        splitOrder: 'image-first',
        imageRounded: '3xl',
        imageUrl: images.hero,
        imageAlt: hero.imageAlt,
        overlapFloatingNavbar: true,
        spaLinkComponent,
      },
    }),
    logoCloud: () => ({
      type: 'logoCloud',
      props: {
        sectionId: 'tools',
        eyebrow: logoCloud.eyebrow,
        title: logoCloud.title,
        subtitle: logoCloud.subtitle,
        items: logoItems,
        color: 'primary',
        sectionPadding: 'compact',
        titleSize: 'sm',
        grayscaleLogos: false,
      },
    }),
    gallery: () => ({
      type: 'gallery',
      props: {
        sectionId: 'gallery',
        eyebrow: gallery.eyebrow,
        title: gallery.title,
        subtitle: gallery.subtitle,
        items: galleryItems,
        color: 'secondary',
        columns: 3,
        gridGap: 'relaxed',
        headerAlign: 'center',
        titleSize: 'lg',
      },
    }),
    features: () => ({
      type: 'features',
      props: {
        sectionId: features.sectionId ?? 'process',
        eyebrow: features.eyebrow,
        title: features.title,
        subtitle: features.subtitle,
        items: features.items,
        variant: 'horizontal',
        color: 'primary',
        itemSurface: 'outline',
        iconStyle: 'circle',
        contentWidth: '6xl',
      },
    }),
    splitContent: () => ({
      type: 'splitContent',
      props: {
        sectionId: 'about',
        eyebrow: splitContent.eyebrow,
        title: splitContent.title,
        body: splitContent.body,
        bullets: resolveForLocale(locale, splitContent.bullets) ?? [],
        imageUrl: images.about,
        imageAlt: splitContent.title,
        reverse: true,
        color: 'secondary',
        sectionPadding: 'spacious',
        contentWidth: '6xl',
        bulletStyle: 'arrow',
      },
    }),
    stats: () => ({
      type: 'stats',
      props: {
        sectionId: 'stats',
        eyebrow: stats.eyebrow,
        title: stats.title,
        subtitle: stats.subtitle,
        items: statsItems,
        color: 'primary',
        columns: 3,
        itemSurface: 'soft',
        statAlign: 'center',
      },
    }),
    ctaBanner: () => ({
      type: 'ctaBanner',
      props: {
        sectionId: 'contact',
        eyebrow: ctaBanner.eyebrow,
        title: ctaBanner.title,
        subtitle: ctaBanner.subtitle,
        ctaText: ctaBanner.ctaText,
        ctaHref: ctaBanner.ctaHref ?? '#',
        secondaryCtaText: ctaBanner.secondaryCtaText,
        secondaryCtaHref: ctaBanner.secondaryCtaHref ?? '#',
        displayVariant: 'strip',
        color: 'primary',
        sectionPadding: 'default',
        spaLinkComponent,
      },
    }),
    footer: () => ({
      type: 'footer',
      props: {
        sectionId: 'footer',
        variant: 'columns',
        tagline: footer.tagline,
        links:
          Array.isArray(footer.links) && footer.links.length > 0 ?
            footer.links.map((l) => ({
              label: l.label,
              href: l.href ?? '#',
            }))
          : [
              { label: footer.privacy, href: footer.linkHrefs?.privacy ?? '#' },
              { label: footer.terms, href: footer.linkHrefs?.terms ?? '#' },
              { label: footer.contact, href: footer.linkHrefs?.contact ?? '#contact' },
            ],
        socials:
          Array.isArray(footer.socials) && footer.socials.length > 0 ?
            footer.socials.map((s) => ({
              label: s.label,
              href: s.href ?? '#',
            }))
          : [],
        color: 'neutral',
        copyright: footer.copyright,
        socialStyle: 'minimal',
      },
    }),
  }

  const out = []
  for (const id of order) {
    const fn = blocks[id]
    if (fn) {
      out.push(fn())
    }
  }
  return out
}
