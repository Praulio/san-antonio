import { defineConfig } from 'vite';

const REPO = 'san-antonio';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? `/${REPO}/` : './',
  build: { outDir: 'dist', sourcemap: true }
});
