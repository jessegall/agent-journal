// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import type { PaneWindow } from '@/components/panes/paneLayout';
import { providePaneLayout } from '@/components/panes/usePaneLayout';
import AgentBar from './AgentBar.vue';
import InformationBar from './InformationBar.vue';

vi.mock('@inertiajs/vue3', () => ({
    router: { post: vi.fn(), put: vi.fn(), delete: vi.fn() },
    usePage: () => ({ url: '/', props: {} }),
    Link: { props: ['href'], template: '<a :href="href"><slot /></a>' },
}));

const windows = [
    { key: 'chat', title: 'Chat', icon: 'chat' },
    { key: 'tasks', title: 'Tasks', icon: 'todos' },
] as PaneWindow[];

function harness(child: ReturnType<typeof defineComponent>, afterProvide?: (store: ReturnType<typeof providePaneLayout>) => void) {
    return defineComponent({
        setup() {
            const store = providePaneLayout('test-layout', () => windows);
            afterProvide?.(store);

            return () => h(child, { layouts: [] });
        },
    });
}

describe('the agent bar', () => {
    it('names its layouts, add and hide controls, and hides the domains sections but keeps a way back', async () => {
        const view = mount(harness(AgentBar));
        const labels = view.findAll('button').map((button) => button.attributes('aria-label'));

        expect(labels).toEqual(expect.arrayContaining(['Layouts', 'Add a window', 'Hide the agent bar']));

        await view.get('[aria-label="Hide the agent bar"]').trigger('click');

        expect(view.get('[aria-label="Show the agent bar"]').attributes('aria-pressed')).toBe('true');
    });
});

describe('the information bar', () => {
    it('is not there without a floating window and is a row of chips, one for each floating window, above the desk', async () => {
        const empty = mount(harness(InformationBar));

        expect(empty.find('[aria-label="Floating windows"]').exists()).toBe(false);

        const view = mount(
            harness(InformationBar, (store) => {
                store.apply({
                    grid: store.arrangement.value.grid,
                    detached: [{ key: 'tasks', left: 10, top: 10, width: 400, height: 300, isMinimised: true }],
                });
            }),
        );

        const bar = view.get('[aria-label="Floating windows"]');
        expect(bar.classes()).not.toContain('absolute');
        expect(bar.text()).toContain('Tasks');

        await view.get('[aria-label="Restore Tasks"]').trigger('click');
    });
});
