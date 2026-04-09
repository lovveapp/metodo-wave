// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Atualize 'site' com seu usuário do GitHub: https://SEU_USUARIO.github.io
  // Atualize 'base' se o nome do repositório for diferente de 'metodo-wave'
  site: 'https://YOUR_USERNAME.github.io',
  base: '/metodo-wave',
  vite: {
    plugins: [tailwindcss()],
  },
});
