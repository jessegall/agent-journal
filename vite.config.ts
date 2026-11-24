import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { fileURLToPath } from 'node:url';
import { defineConfig, lazyPlugins } from 'vite-plus';
import { domainAliases, watchedModuleRoots } from './vite.domains';

export default defineConfig({
    plugins: lazyPlugins(() => [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: true,
            fonts: [
                bunny('Geist', {
                    weights: [400, 500, 600],
                }),
                bunny('Geist Mono', {
                    weights: [400, 500],
                }),
            ],
        }),
        inertia(),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        // An image build generates the routes with PHP first and builds in Node alone (.docker/app/Dockerfile).
        ...(process.env.WAYFINDER_GENERATED === '1'
            ? []
            : [wayfinder({ formVariants: true })]),
    ]),
    resolve: {
        // The generated aliases name paths from the project root.
        alias: Object.fromEntries(
            Object.entries(domainAliases).map(([alias, path]) => [
                alias,
                fileURLToPath(new URL(path, import.meta.url)),
            ]),
        ),
    },
    server: {
        // The app container reaches the Vite container by this name for server-side rendering.
        allowedHosts: ['vite'],
        watch: {
            // In the Docker container on macOS the mounted folder sends no file events, so poll there.
            usePolling: process.env.LARAVEL_SAIL === '1',
            // Each poll walks every watched file, so it runs every two seconds rather than several times a second.
            interval: 2000,
            binaryInterval: 5000,
            // A change counts once the file has been still for five seconds, so a burst of generated files reloads once.
            awaitWriteFinish: { stabilityThreshold: 5000, pollInterval: 1000 },
            ignored: [
                // Polling walks every watched file each interval, so folders of run outputs, logs and history are left out.
                '**/.journal/**',
                '**/.git/**',
                '**/storage/**',
                '**/node_modules/**',
                '**/.agents/**',
                '**/.claude/**',
                '**/.cursor/**',
                '**/.junie/**',
                (path: string) =>
                    path.includes('/vendor/') &&
                    !watchedModuleRoots.some((root) =>
                        path.includes(`/${root}/`),
                    ),
            ],
        },
    },
    lint: {
        ignorePatterns: [
            'vendor/**',
            'node_modules/**',
            'public/**',
            'bootstrap/ssr/**',
            'tailwind.config.js',
            'resources/js/actions/**',
            'resources/js/generated/**',
            'resources/js/components/ui/*',
            'resources/js/routes/**',
            'resources/js/wayfinder/**',
            'resources/js/types/generated/**',
        ],
        options: {
            denyWarnings: true,
            typeAware: true,
        },
    },
    fmt: {
        printWidth: 80,
        tabWidth: 4,
        singleQuote: true,
        semi: true,
        singleAttributePerLine: false,
        htmlWhitespaceSensitivity: 'css',
        ignorePatterns: [
            '.github/**',
            'composer.json',
            'resources/js/components/ui/*',
            'resources/views/mail/*',
            'resources/js/types/generated/**',
            'resources/js/routes/**',
            'resources/js/actions/**',
            'resources/js/generated/**',
            'resources/js/wayfinder/**',
            'docs/**',
            'tests/Fixtures/**',
            '.commandments/**',
        ],
        sortTailwindcss: {
            functions: ['clsx', 'cn', 'cva'],
            stylesheet: 'resources/css/app.css',
        },
    },
    test: {
        include: [
            'resources/js/**/*.test.ts',
            'domain/*/resources/js/**/*.test.ts',
            'tools/design-compare/**/*.test.ts',
            'tools/refactoring/**/*.test.ts',
        ],
    },
});
