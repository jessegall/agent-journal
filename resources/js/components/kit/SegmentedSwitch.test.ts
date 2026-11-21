// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SegmentedSwitch from './SegmentedSwitch.vue';

const options = [
    { value: 'claude', label: 'Claude Code' },
    { value: 'codex', label: 'Codex' },
] as const;

function mountSwitch(chosen: 'claude' | 'codex' = 'claude') {
    return mount(SegmentedSwitch, {
        attachTo: document.body,
        props: {
            label: 'Program',
            options,
            modelValue: chosen,
            'onUpdate:modelValue': (value: string) =>
                switchView.setProps({ modelValue: value }),
        },
    });
}

let switchView: ReturnType<typeof mountSwitch>;

describe('SegmentedSwitch', () => {
    it('is a radio group whose chosen option alone is checked and in the tab order', () => {
        switchView = mountSwitch('claude');
        const radios = switchView.findAll('[role="radio"]');

        expect(
            switchView.find('[role="radiogroup"]').attributes('aria-label'),
        ).toBe('Program');
        expect(radios.map((radio) => radio.attributes('aria-checked'))).toEqual(
            ['true', 'false'],
        );
        expect(radios.map((radio) => radio.attributes('tabindex'))).toEqual([
            '0',
            '-1',
        ]);
        switchView.unmount();
    });

    it('moves the choice and the focus with the arrow keys, round the ends', async () => {
        switchView = mountSwitch('claude');
        const group = switchView.find('[role="radiogroup"]');

        await group.trigger('keydown', { key: 'ArrowRight' });
        expect(switchView.emitted('update:modelValue')?.at(-1)).toEqual([
            'codex',
        ]);
        expect(document.activeElement?.textContent).toContain('Codex');

        await group.trigger('keydown', { key: 'ArrowRight' });
        expect(switchView.emitted('update:modelValue')?.at(-1)).toEqual([
            'claude',
        ]);

        await group.trigger('keydown', { key: 'ArrowLeft' });
        expect(switchView.emitted('update:modelValue')?.at(-1)).toEqual([
            'codex',
        ]);
        switchView.unmount();
    });

    it('chooses an option on click', async () => {
        switchView = mountSwitch('claude');

        await switchView.findAll('[role="radio"]')[1].trigger('click');

        expect(switchView.emitted('update:modelValue')?.at(-1)).toEqual([
            'codex',
        ]);
        switchView.unmount();
    });
});
