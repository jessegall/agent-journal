// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DriverIcon from './DriverIcon.vue';

describe('DriverIcon', () => {
    it("draws the Claude spark in Claude's orange in light and dark alike", () => {
        const icon = mount(DriverIcon, {
            props: { driver: 'claude', size: 18 },
        });

        expect(icon.find('path').attributes('fill')).toBe('#D97757');
        expect(icon.attributes('width')).toBe('18');
        expect(icon.attributes('aria-hidden')).toBe('true');
    });

    it('draws the OpenAI knot in the current text colour, 16 px by default', () => {
        const icon = mount(DriverIcon, { props: { driver: 'codex' } });

        expect(icon.find('path').attributes('fill')).toBe('currentColor');
        expect(icon.attributes('height')).toBe('16');
    });
});
