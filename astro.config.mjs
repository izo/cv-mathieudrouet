import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cv.drouet.io',

  // Integrations
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
      // Deux langues : le sitemap déclare les équivalences hreflang entre
      // / et /en/. Doit rester aligné sur src/config/i18n.ts.
      i18n: {
        defaultLocale: 'fr',
        locales: { fr: 'fr-FR', en: 'en-US' },
      },
    })
  ],
  
  // Performance optimizations
  build: {
    // Enable assets inlining for better performance
    inlineStylesheets: 'auto',
    // Split chunks for better caching
    split: true,
  },
  
  // Vite optimizations
  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize chunks
      rollupOptions: {
        output: {
          // Optimize asset naming for caching
          assetFileNames: (assetInfo) => {
            const name = assetInfo.names?.[0] ?? '';
            if (/\.(woff2?|ttf|otf|eot)$/.test(name)) {
              return `fonts/[name]-[hash][extname]`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/.test(name)) {
              return `images/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
    },
  },
  
  // Enable compression and optimizations
  compressHTML: true,
  
  // Prefetch configuration
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },
});