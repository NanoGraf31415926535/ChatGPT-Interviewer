import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: 'local_packages/*/locales/*',
            dest: ''
          }
        ],
        structured: true
      })
    ],
    build: {
      target: "ES2022"
    },
    base: env.VITE_BASE_PATH
  }
})
