import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite-plus';

/**
 * The public share reader's own build: its stylesheet alone, in public/build-sharing with its own manifest, without
 * source maps, route maps, fonts or anything of the main application.
 */
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/sharing.css'],
            buildDirectory: 'build-sharing',
            refresh: false,
        }),
    ],
    build: {
        sourcemap: false,
        emptyOutDir: true,
    },
});
