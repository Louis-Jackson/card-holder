import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// 多页面输入：入口(index.html)、正面(front.html)、反面(back.html)
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        front: resolve(__dirname, 'front.html'),
        back: resolve(__dirname, 'back.html'),
      },
    },
  },
});


