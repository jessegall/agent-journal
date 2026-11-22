// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Splitter from './Splitter.vue';

function splitter(props: { axis: 'x' | 'y'; span: number; modelValue: number }) {
    const view = mount(Splitter, {
        props: { ...props, 'onUpdate:modelValue': (value: number) => view.setProps({ modelValue: value }) },
    });

    return view;
}

describe('Splitter', () => {
    it('is a labelled separator that reports its orientation and position', () => {
        const view = splitter({ axis: 'x', span: 1000, modelValue: 0.5 });
        const bar = view.get('[role="separator"]');

        expect(bar.attributes('aria-label')).toBe('Resize panes');
        expect(bar.attributes('aria-orientation')).toBe('vertical');
        expect(bar.attributes('aria-valuenow')).toBe('50');
        expect(bar.attributes('aria-valuemin')).toBe('14');
        expect(bar.attributes('aria-valuemax')).toBe('86');
        expect(bar.attributes('tabindex')).toBe('0');
        expect(splitter({ axis: 'y', span: 1000, modelValue: 0.5 }).get('[role="separator"]').attributes('aria-orientation')).toBe(
            'horizontal',
        );
    });

    it('moves 5% with the arrows along its axis only', async () => {
        const view = splitter({ axis: 'x', span: 1000, modelValue: 0.5 });
        const bar = view.get('[role="separator"]');

        await bar.trigger('keydown', { key: 'ArrowRight' });
        expect(view.props('modelValue')).toBeCloseTo(0.55);
        await bar.trigger('keydown', { key: 'ArrowLeft' });
        await bar.trigger('keydown', { key: 'ArrowLeft' });
        expect(view.props('modelValue')).toBeCloseTo(0.45);
        await bar.trigger('keydown', { key: 'ArrowDown' });
        expect(view.props('modelValue')).toBeCloseTo(0.45);
    });

    it('keeps 140 px for each pane', async () => {
        const view = splitter({ axis: 'x', span: 400, modelValue: 0.6 });
        const bar = view.get('[role="separator"]');

        await bar.trigger('keydown', { key: 'ArrowRight' });
        await bar.trigger('keydown', { key: 'ArrowRight' });
        expect(view.props('modelValue')).toBeCloseTo(0.65);
        await bar.trigger('keydown', { key: 'ArrowRight' });
        expect(view.props('modelValue')).toBeCloseTo(0.65);
    });

    it('resets to half on a double click', async () => {
        const view = splitter({ axis: 'y', span: 1000, modelValue: 0.3 });

        await view.get('[role="separator"]').trigger('dblclick');
        expect(view.props('modelValue')).toBe(0.5);
    });
});
