import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BlocksThemeProvider, PageRenderer, applyDocumentChrome } from '@orbisite/blocks'
import { siteConfig, uiString } from './site.config'
import {
  getColorVariant,
  getContentScheme,
  getPrimarySurface,
  loadRemoteTheme,
  setRemoteThemes,
} from './data/theme'
import { loadContent } from './data/content'
import { buildPageConfig } from './data/page.config'
import { applySiteSettings, loadSiteSettings } from './data/site'
import { getContentForRoute } from './data/routeContent'
import { extractContentImages } from './utils/siteImages'

function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function RoutedPage({ content, locale, setLocale }) {
  const { pathname } = useLocation()
  const route = useMemo(() => getContentForRoute(content, pathname), [content, pathname])

  const page = useMemo(() => {
    if (!route.merged) {
      return []
    }
    return buildPageConfig(
      route.merged,
      locale,
      () => setLocale((current) => (current === 'fr' ? 'en' : 'fr')),
      {
        sections: route.sections,
        spaLinkComponent: Link,
        logoHref: '/',
      },
    )
  }, [route.merged, route.sections, locale, setLocale])

  if (route.notFound) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stone-50 px-6 text-center text-stone-600">
        <p className="text-lg font-medium text-stone-900">{uiString('notFoundTitle', locale)}</p>
        <Link to="/" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
          {uiString('notFoundLink', locale)}
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <PageRenderer page={page} />
    </main>
  )
}

function App() {
  const [locale, setLocale] = useState(siteConfig.defaultLocale)
  const [content, setContent] = useState(null)
  const [status, setStatus] = useState({ loading: true, error: null })

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    if (status.loading || status.error || !content) {
      applyDocumentChrome({ contentScheme: 'light', chromeSurface: '#fafaf9' })
    }
  }, [status.loading, status.error, content])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [contentJson, , siteJson] = await Promise.all([
          loadContent(),
          loadRemoteTheme(),
          loadSiteSettings(),
        ])
        if (cancelled) {
          return
        }
        applySiteSettings(siteJson)
        setContent(contentJson)
        setStatus({ loading: false, error: null })
      } catch (e) {
        if (cancelled) {
          return
        }
        setRemoteThemes(null)
        setStatus({
          loading: false,
          error: e instanceof Error ? e.message : uiString('loadErrorTitle', siteConfig.defaultLocale),
        })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!content) {
      return
    }
    const { favicon, ogImage } = extractContentImages(content) ?? {}
    if (favicon) {
      let link = document.querySelector('link[rel="icon"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        link.type = 'image/png'
        document.head.appendChild(link)
      }
      link.href = favicon
    }
    if (ogImage) {
      document.querySelector('meta[property="og:image"]')?.setAttribute('content', ogImage)
      document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', ogImage)
    }
  }, [content])

  if (status.loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50 text-stone-500">
        {uiString('loading', locale)}
      </main>
    )
  }

  if (status.error || !content) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-stone-50 px-6 text-center text-stone-700">
        <p className="font-medium text-stone-900">{uiString('loadErrorTitle', locale)}</p>
        <p className="max-w-md text-sm text-stone-500">{status.error}</p>
      </main>
    )
  }

  return (
    <BlocksThemeProvider
      getColorVariant={getColorVariant}
      contentScheme={getContentScheme()}
      chromeSurface={getPrimarySurface()}
    >
      <ScrollToTop />
      <RoutedPage content={content} locale={locale} setLocale={setLocale} />
    </BlocksThemeProvider>
  )
}

export default App
