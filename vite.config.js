import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isProduction = mode === 'production';

    return {
        plugins: [
            vue(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        build: {
            outDir: 'dist',
            sourcemap: !isProduction,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ['vue', 'vue-router', 'vuex', 'axios'],
                    },
                },
            },
            target: 'esnext',
        },
        optimizeDeps: {
            include: ['vue', 'vue-router', 'vuex', 'axios'],
        },
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            },
        },
    };
});