// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ProgressMeter from './ProgressMeter.vue';
import ToneLabel from './ToneLabel.vue';

describe('the shared progress meter and tone label', () => {
    it('names a counted bar with its value and shows only the label without a total', () => {
        const counted = mount(ProgressMeter, { props: { label: '3 of 8', completed: 3, total: 8 } });
        const bar = counted.get('[role="progressbar"]');

        expect(bar.attributes('aria-valuenow')).toBe('3');
        expect(bar.attributes('aria-valuemax')).toBe('8');
        expect(bar.attributes('aria-valuetext')).toBe('3 of 8');

        const unknown = mount(ProgressMeter, { props: { label: 'Reading' } });

        expect(unknown.find('[role="progressbar"]').exists()).toBe(false);
        expect(unknown.text()).toBe('Reading');
    });

    it('keeps the state word readable whatever its tone', () => {
        const label = mount(ToneLabel, { props: { text: 'failed', tone: 'danger' } });

        expect(label.text()).toBe('failed');
        expect(label.classes()).toContain('text-danger');
    });
});
