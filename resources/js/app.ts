import { createInertiaApp } from '@inertiajs/vue3';
import type { DefineComponent } from 'vue';
import { hostedPage } from '@/framework/hostedPage';
import { pressedButtons } from '@/framework/pressedButtons';
import { components, declaredPages } from '@/generated/ui-manifest';
import AppSidebarLayout from '@/layouts/app/AppSidebarLayout.vue';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

/**
 * The pages that sit outside the app shell: signing in.
 */
const pagesWithoutShell = new Set(['Login']);

pressedButtons.watch();

void createInertiaApp({
    // Pages come from the generated manifest, so two domains' components of one name never collide. The manifest
    // knows only that each module exports a component, so it is named a component here, where Inertia takes it.
    resolve: async (name) => {
        const component = (await components[name]()).default as DefineComponent;

        // A declared page gets its reader's result as page props; the page host hands its component the Data alone.
        return (declaredPages.has(name) ? hostedPage(component) : component) as DefineComponent;
    },
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => (pagesWithoutShell.has(name) ? null : AppSidebarLayout),
    progress: {
        color: '#5e64c9',
    },
});
