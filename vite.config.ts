import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// 多页面输入：入口(index.html)、正面(front.html)、反面(back.html)、正面Daily(front-daily.html)、反面可增值(back-recharge.html)
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        front: resolve(__dirname, 'front.html'),
        back: resolve(__dirname, 'back.html'),
        frontDaily: resolve(__dirname, 'front-daily.html'),
        backRecharge: resolve(__dirname, 'back-recharge.html'),
        frontMulti: resolve(__dirname, 'front-multi.html'),
      },
    },
  },
});


