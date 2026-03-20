import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import node from "@astrojs/node";
import prefixer from "postcss-prefix-selector";

// https://astro.build/config
export default defineConfig({
  build: {
    assetsPrefix: "https://cdn.nav.no/pensjonskalkulator/pensjonskalkulator-microfrontend-ssr",
    inlineStylesheets: "always",
  },
  vite: {
    css: {
      postcss: {
        plugins: [
          prefixer({
            prefix: ".pensjonskalkulator-microfrontend-ssr",
            ignoreFiles: [/module.css/],
          }),
        ],
      },
    },
  },
  integrations: [react()],
  i18n: {
    defaultLocale: "nb",
    locales: ["nb", "nn", "en"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
