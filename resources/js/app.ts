import { createInertiaApp } from '@inertiajs/vue3';
import AppSidebarLayout from '@/layouts/app/AppSidebarLayout.vue';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * The pages that sit outside the app shell: signing in.
 */
const pagesWithoutShell = new Set(['Login']);

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => (pagesWithoutShell.has(name) ? null : AppSidebarLayout),
    progress: {
        color: '#5e64c9',
    },
});
