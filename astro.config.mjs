// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Atualize 'site' com seu usuário do GitHub: https://SEU_USUARIO.github.io
  // Atualize 'base' se o nome do repositório for diferente de 'metodo-wave'
  site: 'https://lovveapp.github.io',

  base: '/metodo-wave',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});