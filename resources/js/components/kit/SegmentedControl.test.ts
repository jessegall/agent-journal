// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SegmentedControl from './SegmentedControl.vue';

const items = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This week' },
    { value: 'month', label: 'This month' },
] as const;

function mountControl(chosen: string = 'today') {
    const view = mount(SegmentedControl, {
        attachTo: document.body,
        props: {
            label: 'Spent',
            items,
            modelValue: chosen,
            'onUpdate:modelValue': (value: string) => view.setProps({ modelValue: value }),
        },
    });

    return view;
}

describe('SegmentedControl', () => {
    it('is a radio group whose chosen item alone is checked and in the tab order', () => {
        const view = mountControl('week');
        const radios = view.findAll('[role="radio"]');

        expect(view.get('[role="radiogroup"]').attributes('aria-label')).toBe('Spent');
        expect(radios.map((radio) => radio.attributes('aria-checked'))).toEqual(['false', 'true', 'false']);
        expect(radios.map((radio) => radio.attributes('tabindex'))).toEqual(['-1', '0', '-1']);
        view.unmount();
    });

    it('moves the choice and the focus with Left and Right, round the ends, and with Home and End', async () => {
        const view = mountControl('today');
        const group = view.get('[role="radiogroup"]');

        await group.trigger('keydown', { key: 'ArrowLeft' });
        expect(view.emitted('update:modelValue')?.at(-1)).toEqual(['month']);
        expect(document.activeElement?.textContent).toContain('This month');

        await group.trigger('keydown', { key: 'ArrowRight' });
        expect(view.emitted('update:modelValue')?.at(-1)).toEqual(['today']);

        await group.trigger('keydown', { key: 'End' });
        expect(view.emitted('update:modelValue')?.at(-1)).toEqual(['month']);

        await group.trigger('keydown', { key: 'Home' });
        expect(view.emitted('update:modelValue')?.at(-1)).toEqual(['today']);
        view.unmount();
    });

    it('chooses an item on click', async () => {
        const view = mountControl('today');

        await view.findAll('[role="radio"]')[1].trigger('click');

        expect(view.emitted('update:modelValue')?.at(-1)).toEqual(['week']);
        view.unmount();
    });
});
