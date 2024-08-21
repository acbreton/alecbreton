import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: './public/',
  plugins: [],
  base: "./",
  build: {
      outDir: './dist',
      emptyOutDir: true,
      sourcemap: true
  },
})
