// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import Tabs from './Tabs.vue';

describe('Tabs', () => {
    it('moves between tabs with the arrow keys, Home and End, each bound to its labelled panel', async () => {
        const view = mount(Tabs, {
            attachTo: document.body,
            props: {
                tabs: [
                    { key: 'brief', label: 'Brief' },
                    { key: 'logs', label: 'Logs' },
                    { key: 'proofs', label: 'Proofs' },
                ],
                modelValue: 'brief',
                'onUpdate:modelValue': (value: string) => view.setProps({ modelValue: value }),
            },
            slots: { brief: () => h('p', 'Brief text'), logs: () => h('p', 'Log text'), proofs: () => h('p', 'Proof text') },
        });
        const list = view.get('[role="tablist"]');

        await list.trigger('keydown', { key: 'ArrowRight' });
        await new Promise((resolve) => setTimeout(resolve));
        expect(view.findAll('[role="tab"]')[1].attributes('aria-selected')).toBe('true');
        expect(document.activeElement).toBe(view.findAll('[role="tab"]')[1].element);

        await list.trigger('keydown', { key: 'End' });
        await new Promise((resolve) => setTimeout(resolve));
        expect(view.findAll('[role="tab"]')[2].attributes('aria-selected')).toBe('true');

        await list.trigger('keydown', { key: 'ArrowRight' });
        await new Promise((resolve) => setTimeout(resolve));
        expect(view.findAll('[role="tab"]')[0].attributes('aria-selected')).toBe('true');

        const tab = view.findAll('[role="tab"]')[0];
        const panel = view.get(`#${tab.attributes('aria-controls')}`);
        expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'));
        view.unmount();
    });
});
