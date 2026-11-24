// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { reactive } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';

const page = reactive({
    url: '/',
    props: {
        name: 'Journal',
        navigation: {
            items: [
                { key: 'home', label: 'Home', url: '/', children: [], isAtBottom: false, isCounted: false, isInSidebar: true },
                { key: 'plans', label: 'Plans', url: '/plans', children: [], isAtBottom: false, isCounted: false, isInSidebar: true },
                { key: 'rules', label: 'Rules', url: '/rules', children: [], isAtBottom: false, isCounted: false, isInSidebar: false },
            ],
            groups: [],
            current: [],
        },
    },
});

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => page,
    router: { visit: vi.fn(), reload: vi.fn() },
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
    afterEach(() => {
        vi.useRealTimers();
        vi.mocked(router.reload).mockReset();
    });

    it('lists the records the search finds for the words under the commands and pages, each opening its page', async () => {
        vi.useFakeTimers();
        vi.mocked(router.reload).mockImplementation((options) => {
            options?.onSuccess?.({
                props: {
                    search: {
                        hits: [
                            {
                                sourceKey: 'tasks',
                                sourceLabel: 'Task',
                                title: 'Persist plans and phases',
                                snippet: '',
                                score: 1,
                                recordType: 'task',
                                recordId: 'task-1',
                                locationLabel: null,
                                href: '/tasks/1',
                            },
                        ],
                        status: 'complete',
                        continuation: null,
                        directOpen: null,
                    },
                },
            } as never);
        });
        const view = open();
        await view.vm.$nextTick();
        const input = document.body.querySelector('input') as HTMLInputElement;

        input.value = 'plans';
        input.dispatchEvent(new Event('input'));
        await vi.advanceTimersByTimeAsync(300);
        await view.vm.$nextTick();

        const options = [...document.body.querySelectorAll('[role="option"]')].map((option) => option.textContent?.trim());
        expect(options).toEqual(['Plans', 'Persist plans and phases']);
        (document.body.querySelectorAll('[role="option"]')[1] as HTMLElement).click();
        expect(router.visit).toHaveBeenCalledWith('/tasks/1');
        view.unmount();
    });

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

    it('finds a page kept off the sidebar among the commands', async () => {
        const view = open();
        await view.vm.$nextTick();
        const input = document.body.querySelector('input') as HTMLInputElement;

        input.value = 'rules';
        input.dispatchEvent(new Event('input'));
        await view.vm.$nextTick();
        expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(1);
        input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

        expect(router.visit).toHaveBeenCalledWith('/rules');
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
        expect(document.body.querySelector('[role="status"]')).not.toBeNull();
        view.unmount();
    });
});
