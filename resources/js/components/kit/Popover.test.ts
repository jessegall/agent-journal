// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { defineComponent, h, ref } from 'vue';
import Popover from './Popover.vue';

/** A trigger button with its popover, as a dropdown uses the kit surface. */
function harness() {
    const open = ref(true);
    const anchor = document.createElement('button');
    document.body.append(anchor);
    const outside = document.createElement('div');
    document.body.append(outside);

    const wrapper = mount(
        defineComponent({
            setup: () => () =>
                h(
                    Popover,
                    { open: open.value, anchor, label: 'Choices', 'onUpdate:open': (value: boolean) => (open.value = value) },
                    () => h('p', 'Inside'),
                ),
        }),
        { attachTo: document.body },
    );

    return { open, anchor, outside, wrapper };
}

describe('Popover', () => {
    it('closes on a press outside but not on a press inside or on its anchor', async () => {
        const { open, anchor, outside, wrapper } = harness();

        wrapper.get('p').element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        anchor.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        expect(open.value).toBe(true);

        outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        expect(open.value).toBe(false);
    });

    it('closes on Escape and gives the focus back to its anchor', async () => {
        const { open, anchor, wrapper } = harness();

        await wrapper.get('[role="dialog"]').trigger('keydown', { key: 'Escape' });

        expect(open.value).toBe(false);
        expect(document.activeElement).toBe(anchor);
    });
});
