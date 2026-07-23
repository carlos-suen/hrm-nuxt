import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: true},

    modules: ['@pinia/nuxt'],

    css: ['~/assets/css/main.css'],

    app: {
        head: {
            title: 'HRM System',
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            ],
            link: [
                {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
            ],
        },
    },

    runtimeConfig: {
        // Server-side private config
        supabaseUrl: process.env.SUPABASE_URL || '',
        supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
        jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-do-not-use-in-production',

        // Public config (exposed to client)
        public: {
            supabaseUrl: process.env.SUPABASE_URL || '',
            supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
        },
    },

    // Nitro 配置 - Cloudflare Workers 環境變數綁定
    nitro: {
        preset: 'cloudflare-module',
        cloudflare: {
            pages: {
                routes: {
                    exclude: ['/images/*', '/favicon.ico', '/robots.txt']
                }
            }
        },
    },

    imports: {
        dirs: ['stores'],
    },

    pinia: {
        storesDirs: ['./stores/**'],
    },

    vite: {
        plugins: [tailwindcss()],
        optimizeDeps: {
            include: ['echarts', 'vue-echarts'],
        },
    },

    features: {
        inlineStyles: false,
    },
})