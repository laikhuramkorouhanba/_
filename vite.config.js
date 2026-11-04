import { defineConfig } from 'vite';

export default defineConfig({
  base: '/_/',
  test: {
    environment: 'jsdom',
  },
});
