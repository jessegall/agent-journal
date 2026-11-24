// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import DetachedWindowFrame from '@/web/pages/web/partials/DetachedWindowFrame.vue';
import PaneTabs from '@/components/kit/PaneTabs.vue';
import type { PaneWindow } from './paneLayout';
import { providePaneLayout } from './usePaneLayout';

const windows = [
    { key: 'chat', title: 'Chat', icon: 'speech' },
    { key: 'tasks', title: 'Tasks', icon: 'todos' },
] as PaneWindow[];

describe('the desk by keyboard', () => {
    it('opens a tab menu with the Menu key and offers the four docks', async () => {
        const view = mount(PaneTabs, {
            props: {
                tabs: [
                    { key: 'chat', title: 'Chat', icon: 'speech', isActive: true },
                    { key: 'tasks', title: 'Tasks', icon: 'todos', isActive: false },
                ],
            },
        });

        await view.get('[data-tab="tasks"]').trigger('keydown', { key: 'ContextMenu' });
        const items = view.findAll('[role="menuitem"]').map((item) => item.text());

        expect(items).toEqual(expect.arrayContaining(['Dock left', 'Dock right', 'Dock above', 'Dock below']));
    });

    it('resizes a floating window by 12 px, or 48 px with Shift, with Option and the arrows', async () => {
        const Harness = defineComponent({
            setup() {
                const store = providePaneLayout('desk-keys', () => windows);
                store.apply({
                    grid: store.arrangement.value.grid,
                    detached: [{ key: 'tasks', left: 20, top: 20, width: 400, height: 300, isMinimised: false }],
                });

                return () => h(DetachedWindowFrame, { window: store.detached.value[0] }, () => 'content');
            },
        });
        const view = mount(Harness, { attachTo: document.body });

        await view.get('section').trigger('keydown', { key: 'ArrowRight', altKey: true });
        await view.get('section').trigger('keydown', { key: 'ArrowDown', altKey: true, shiftKey: true });

        expect(view.get('section').attributes('style')).toContain('width: 412px');
        expect(view.get('section').attributes('style')).toContain('height: 348px');
        view.unmount();
    });
});
