// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import Popover from './Popover.vue';

/**
 * An anchor 40 px tall whose top sits 600 px down a window 800 px high, as the agent row above the composer does.
 */
function anchorAt(top: number): HTMLElement {
    const anchor = document.createElement('button');
    anchor.getBoundingClientRect = () => ({ top, bottom: top + 40, left: 900, right: 1100, width: 200, height: 40, x: 900, y: top, toJSON: () => ({}) });
    document.body.append(anchor);

    return anchor;
}

describe('Popover placed above', () => {
    it('opens upward from its anchor, fixed over the page and held inside the window with its own scroll', async () => {
        window.innerHeight = 800;
        window.innerWidth = 1280;
        const anchor = anchorAt(600);
        const open = ref(true);
        const view = mount(
            defineComponent({
                setup: () => () =>
                    h(Popover, { open: open.value, label: 'Chats', anchor, placement: 'above', align: 'right', width: 384 }, () => h('p', 'list')),
            }),
            { attachTo: document.body },
        );
        await flushPromises();

        const panel = view.get('[data-popover-above]');
        expect(panel.classes()).toEqual(expect.arrayContaining(['fixed', 'overflow-y-auto']));
        expect(panel.attributes('style')).toContain('bottom: 204px');
        expect(panel.attributes('style')).toContain('max-height: 590px');
        view.unmount();
    });
});
