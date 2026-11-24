import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    watch: {
      ignored: ['**/assets/certificates/**', '**/assets/*.pdf', '**/public/**', '**/*.pdf'],
    },
  },
});

