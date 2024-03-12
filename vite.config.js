import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  publicPath:'./',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    host:'0.0.0.0',
    port:5173,
    disableHostCheck: true,
    proxy:{
      '/api':{                          //处理跨域问题
        target:"http://localhost:8080", //后台服务所在的源
        changeOrigin:true, //修改源
        rewrite:(path)=>path.replace(/^\/api/,"") // api替换成空字符串
      }
    }
  }
})
