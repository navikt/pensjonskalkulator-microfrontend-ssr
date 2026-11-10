# pensjonskalkulator-microfrontend-ssr

Mikrofrontend for Min side som viser et kort med lenke til Navs pensjonskalkulator.
Appen leverer serverrendret HTML.

## Kjøre appen lokalt

Bruk Node.js 22.13 eller nyere og pnpm 10.28.2.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Åpne http://localhost:3000/nb. `/nn` og `/en` er også tilgjengelige.
Start appen på nytt etter endringer.

## Produksjon

- Kjører med Node.js 24 i Docker på Nais, i `prod-gcp` og namespace `pensjonskalkulator`.
- Deployes fra `main` via [GitHub Actions](.github/workflows/deploy.yaml).
- Kalles av `tms-min-side`. HTML-endepunktene krever foreløpig ikke autentisering.
- Lytter på port `3000`. `HOST` og `PORT` kan settes som miljøvariabler.
- Helsesjekker: `/api/internal/isAlive` og `/api/internal/isReady`.

Se [Nais-konfigurasjonen](nais/prod-gcp/nais.yaml) for produksjonsoppsettet.
