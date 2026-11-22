// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import Tabs from './Tabs.vue';

const tabs = [
    { key: 'brief', label: 'Brief' },
    { key: 'logs', label: 'Logs', closable: true },
    { key: 'proofs', label: 'Proofs', count: 3 },
];

function mountTabs(props: Record<string, unknown> = {}) {
    const view = mount(Tabs, {
        attachTo: document.body,
        props: {
            tabs,
            modelValue: 'brief',
            'onUpdate:modelValue': (value: string) => view.setProps({ modelValue: value }),
            ...props,
        },
        slots: { brief: () => h('p', 'Brief text'), logs: () => h('p', 'Log text'), proofs: () => h('p', 'Proof text') },
    });

    return view;
}

const settle = () => new Promise((resolve) => setTimeout(resolve));

describe('Tabs', () => {
    it('binds each tab to its labelled panel and keeps one tab stop', () => {
        const view = mountTabs();
        const tabButtons = view.findAll('[role="tab"]');

        expect(view.get('[role="tablist"]').exists()).toBe(true);
        expect(tabButtons.map((tab) => tab.attributes('aria-selected'))).toEqual(['true', 'false', 'false']);
        expect(tabButtons.map((tab) => tab.attributes('tabindex'))).toEqual(['0', '-1', '-1']);

        const panel = view.get(`#${tabButtons[0].attributes('aria-controls')}`);

        expect(panel.attributes('role')).toBe('tabpanel');
        expect(panel.attributes('aria-labelledby')).toBe(tabButtons[0].attributes('id'));
        view.unmount();
    });

    it('moves with the arrows, Home and End, round the ends, and focuses the tab it reaches', async () => {
        const view = mountTabs();
        const list = view.get('[role="tablist"]');

        await list.trigger('keydown', { key: 'ArrowRight' });
        await settle();
        expect(view.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true');
        expect(document.activeElement).toBe(view.findAll('[role="tab"]')[1].element);

        await list.trigger('keydown', { key: 'End' });
        await settle();
        expect(view.findAll('[role="tab"]')[2].attributes('aria-selected')).toBe('true');

        await list.trigger('keydown', { key: 'ArrowRight' });
        await settle();
        expect(view.findAll('[role="tab"]')[0].attributes('aria-selected')).toBe('true');

        await list.trigger('keydown', { key: 'ArrowLeft' });
        await settle();
        expect(view.findAll('[role="tab"]')[2].attributes('aria-selected')).toBe('true');
        view.unmount();
    });

    it('closes a closable tab on Delete, Backspace and a middle click, and names its close button', async () => {
        const view = mountTabs();
        const closable = view.findAll('[role="tab"]')[1];

        await closable.trigger('keydown', { key: 'Delete' });
        await closable.trigger('keydown', { key: 'Backspace' });
        await closable.trigger('auxclick', { button: 1 });
        expect(view.emitted('close')).toEqual([['logs'], ['logs'], ['logs']]);
        expect(closable.get('button').attributes('aria-label')).toBe('Close Logs');
        expect(closable.get('button').attributes('tabindex')).toBe('-1');

        await view.findAll('[role="tab"]')[0].trigger('keydown', { key: 'Delete' });
        expect(view.emitted('close')).toHaveLength(3);
        view.unmount();
    });

    it('draws the variants and the chosen line', () => {
        const pageHead = mountTabs({ variant: 'pagehead', gap: 16, line: 'quiet' });

        expect(pageHead.get('[role="tablist"]').classes()).toContain('h-13');
        expect(pageHead.get('[role="tablist"]').classes()).toContain('gap-4');
        expect(pageHead.get('[role="tab"][aria-selected="true"]').classes().join(' ')).toContain('border-3');
        expect(mountTabs({ variant: 'filters' }).get('[role="tablist"]').classes()).toContain('px-3');
        pageHead.unmount();
    });
});
