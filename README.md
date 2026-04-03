# raito

Application **Vite + React** — portfolio **Raito** (artiste 3D), basée sur le [modèle Orbisite](../model) et [`@orbisite/blocks`](https://github.com/Orbisite/blocks) (npm / GitHub Packages).

## Prérequis

- Dépôt [`raito-api`](../raito-api) poussé sur GitHub (JSON + images en raw).
- `npm install` — pour `@orbisite/blocks`, un token GitHub Packages (`GITHUB_PACKAGES_TOKEN`) peut être requis (voir `.npmrc`).

## Configuration

1. **Par défaut** (`npm run dev` sans `VITE_*` dans `.env.local`) : le site charge l’API depuis GitHub raw [`Orbisite/raito-api`](https://github.com/Orbisite/raito-api) (`src/config/remoteData.js`).
2. **API locale** : `npx serve ../raito-api -l 8787`, puis décommenter les 4 lignes `VITE_*` dans `.env.local` (voir `.env.example`). Si `.env.local` pointe vers `127.0.0.1` sans serveur lancé, le chargement échoue.
3. **Autre dépôt / branche** : définir les 4 `VITE_*` vers vos URLs raw.

## Scripts

| Commande | Action |
|----------|--------|
| `npm run dev` | Serveur de dev |
| `npm run build` | Build production + `dist/404.html` (GitHub Pages) |
| `npm run preview` | Prévisualiser le build |

## Déploiement (GitHub Pages)

URL publique : **`https://orbisite.github.io/raito/`** (dépôt projet sous le compte `Orbisite`).

1. Sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions** (pas « Deploy from a branch »).
2. Chaque push sur **`main`** lance le workflow **Deploy GitHub Pages** (`.github/workflows/deploy-pages.yml`), qui build avec `VITE_BASE=/raito/` et publie `dist`.

**Manuellement** (branche `gh-pages`, depuis ta machine avec token GitHub Packages pour `npm ci` / `npm install`) :

```bash
npm run deploy
```

**En local**, `npm run dev` et `npm run build` sans variable utilisent **`base: /`** (racine). Pour tester le build « comme en prod » :

```bash
npm run build:gh && npm run preview
```

Mettre à jour `canonicalUrl` et `og.url` dans `raito-api/site.json` avec `https://orbisite.github.io/raito/`.

## Dossier du projet

Le dépôt GitHub du site doit s’appeler **`raito`** (dossier local **`raito`** dans ce monorepo).
