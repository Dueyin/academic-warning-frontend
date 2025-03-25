import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // 如果后端接口已经包含 /api 前缀，则不需要移除
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
