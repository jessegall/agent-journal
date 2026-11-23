// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DriverMark from './DriverMark.vue';

describe('DriverMark', () => {
    it("draws the product's own icon for a driver named by its family or by its short name", () => {
        const drawn = (driver: string) => mount(DriverMark, { props: { driver } }).attributes('data-driver');

        expect(drawn('claude-code')).toBe('claude');
        expect(drawn('claude')).toBe('claude');
        expect(drawn('codex')).toBe('codex');
    });

    it('draws no product icon for a driver it does not know', () => {
        const mark = mount(DriverMark, { props: { driver: 'another' } });

        expect(mark.attributes('data-driver')).toBeUndefined();
    });
});
