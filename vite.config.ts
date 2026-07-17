import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni()
  ],
  base: './',
  build: {
    target: 'es2020',
    minify: 'terser',
    cssCodeSplit: false,
    assetsInlineLimit: 10000,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 9999,
    strictPort: false,   // 端口被占用时自动尝试下一个可用端口
    allowedHosts: true
  }
});
