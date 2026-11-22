// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import PaneGrid from './PaneGrid.vue';
import type { PaneWindow } from './paneLayout';
import { providePaneLayout } from './usePaneLayout';

vi.mock('@inertiajs/vue3', () => ({ Link: { props: ['href'], template: '<a :href="href"><slot /></a>' } }));

class FakeObserver {
    constructor(private readonly callback: (entries: { contentRect: { width: number } }[]) => void) {}

    observe(): void {
        this.callback([{ contentRect: { width: 390 } }]);
    }

    disconnect(): void {}
}

const windows = [
    { key: 'chat', title: 'Chat', icon: 'chat' },
    { key: 'tasks', title: 'Tasks', icon: 'todos' },
] as PaneWindow[];

describe('the desk on a phone', () => {
    it('shows one window under a switcher and keeps the others mounted with their drafts', async () => {
        vi.stubGlobal('ResizeObserver', FakeObserver);
        const Harness = defineComponent({
            setup() {
                providePaneLayout('phone-desk', () => windows);

                return () =>
                    h(PaneGrid, null, {
                        default: ({ windowKey }: { windowKey: string }) => h('input', { 'data-draft': windowKey }),
                    });
            },
        });
        const view = mount(Harness, { attachTo: document.body });
        await nextTick();

        expect(view.get('[data-window-switcher]').exists()).toBe(true);
        expect(view.get('[data-phone-window="chat"]').isVisible()).toBe(true);
        expect(view.get('[data-phone-window="tasks"]').isVisible()).toBe(false);

        (view.get('[data-draft="chat"]').element as HTMLInputElement).value = 'a draft';
        await view.get('[data-segment="tasks"]').trigger('click');

        expect(view.get('[data-phone-window="tasks"]').isVisible()).toBe(true);
        expect(view.get('[data-phone-window="chat"]').isVisible()).toBe(false);

        await view.get('[data-segment="chat"]').trigger('click');

        expect((view.get('[data-draft="chat"]').element as HTMLInputElement).value).toBe('a draft');
        vi.unstubAllGlobals();
        view.unmount();
    });
});
