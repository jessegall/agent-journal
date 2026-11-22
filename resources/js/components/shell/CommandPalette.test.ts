// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { reactive } from 'vue';
import { describe, expect, it, vi } from 'vitest';

const page = reactive({
    url: '/',
    props: {
        name: 'Journal',
        navigation: {
            items: [
                { key: 'home', label: 'Home', url: '/', children: [], atFoot: false, counted: false },
                { key: 'plans', label: 'Plans', url: '/plans', children: [], atFoot: false, counted: false },
            ],
            groups: [],
            current: [],
        },
    },
});

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
    router: { visit: vi.fn() },
    Link: { props: ['href'], template: '<a :href="href"><slot /></a>' },
}));

const { default: CommandPalette } = await import('./CommandPalette.vue');
const { useShellOverlays } = await import('@/composables/useShellOverlays');

function open() {
    const { isPaletteOpen } = useShellOverlays();
    isPaletteOpen.value = true;

    return mount(CommandPalette, { attachTo: document.body });
}

describe('the command palette', () => {
    it('lists the shell commands and the pages in groups and filters them as the user types', async () => {
        const view = open();
        await view.vm.$nextTick();
        const input = document.body.querySelector('input') as HTMLInputElement;

        expect(document.body.querySelectorAll('[role="group"]')).toHaveLength(2);
        input.value = 'pla';
        input.dispatchEvent(new Event('input'));
        await view.vm.$nextTick();

        expect([...document.body.querySelectorAll('[role="option"]')].map((option) => option.textContent?.trim())).toEqual(['Plans']);
        expect(input.getAttribute('aria-activedescendant')).toBe(document.body.querySelector('[role="option"]')?.id);
        view.unmount();
    });

    it('goes to the chosen page on Enter', async () => {
        const view = open();
        await view.vm.$nextTick();
        const input = document.body.querySelector('input') as HTMLInputElement;

        input.value = 'plans';
        input.dispatchEvent(new Event('input'));
        await view.vm.$nextTick();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        expect(router.visit).toHaveBeenCalledWith('/plans');
        view.unmount();
    });

    it('says no command matches and leaves the arrows and Enter doing nothing', async () => {
        const view = open();
        await view.vm.$nextTick();
        const input = document.body.querySelector('input') as HTMLInputElement;

        input.value = 'zzz';
        input.dispatchEvent(new Event('input'));
        await view.vm.$nextTick();
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(0);
        expect(document.body.textContent).toContain('No matching commands');
        view.unmount();
    });
});
