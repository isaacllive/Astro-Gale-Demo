// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import db from "@astrojs/db";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: "https://example.com",

  adapter: node({
    mode: 'standalone',
  }),

  integrations: [db()],

  vite: {
    plugins: [tailwindcss()],
  },
});