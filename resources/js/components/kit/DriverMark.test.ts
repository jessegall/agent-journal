// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { declaredLooks } from '@/kit/testing/driverLooks';
import DriverMark from './DriverMark.vue';

vi.mock('@inertiajs/vue3', () => ({ usePage: () => ({ props: { drivers: declaredLooks } }) }));

function drawn(driver: string) {
    const mark = mount(DriverMark, { props: { driver } });

    return { label: mark.attributes('aria-label'), family: mark.find('[data-driver]').attributes('data-driver') };
}

describe('DriverMark', () => {
    it('shows the label and mark the server declares for each family', () => {
        expect(drawn('claude-code')).toEqual({ label: 'Claude Code', family: 'claude-code' });
        expect(drawn('codex')).toEqual({ label: 'Codex', family: 'codex' });
    });

    it('keeps the Claude mark in its own colours and draws the Codex mark in the text colour', () => {
        expect(mount(DriverMark, { props: { driver: 'claude-code' } }).find('img').exists()).toBe(true);
        expect(mount(DriverMark, { props: { driver: 'codex' } }).find('span.bg-current').exists()).toBe(true);
    });

    it("shows a short, registration or vendor name of a driver with its family's look", () => {
        expect(drawn('claude')).toEqual({ label: 'Claude Code', family: 'claude-code' });
        expect(drawn('codex-headless')).toEqual({ label: 'Codex', family: 'codex' });
        expect(drawn('vendor/claude-code')).toEqual({ label: 'Claude Code', family: 'claude-code' });
    });

    it('keeps the recorded name of a driver no family declares, beside the neutral mark', () => {
        const mark = mount(DriverMark, { props: { driver: 'removed-driver' } });

        expect(mark.attributes('aria-label')).toBe('removed-driver');
        expect(mark.find('[data-driver]').exists()).toBe(false);
    });
});
