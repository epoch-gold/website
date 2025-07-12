import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig(({ mode }) => {
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
    };
});
