import { defineConfig } from 'vite';

export default defineConfig({
  base: '/_/',
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.js'],
  },
});
