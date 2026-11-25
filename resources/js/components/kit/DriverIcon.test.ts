// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { declaredLooks } from '@/kit/testing/driverLooks';
import DriverIcon from './DriverIcon.vue';

vi.mock('@inertiajs/vue3', () => ({ usePage: () => ({ props: { drivers: declaredLooks } }) }));

describe('DriverIcon', () => {
    it('draws a mark in its own colours as an image of the declared mark, so it keeps them in light and dark', () => {
        const icon = mount(DriverIcon, { props: { driver: 'claude-code', size: 18 } });

        expect(icon.element.tagName).toBe('IMG');
        expect(icon.attributes('src')).toBe('/images/drivers/claude-code.svg');
        expect(icon.attributes('width')).toBe('18');
        expect(icon.attributes('aria-hidden')).toBe('true');
    });

    it('draws a mark in the text colour as a mask of the declared mark, 16 px by default', () => {
        const icon = mount(DriverIcon, { props: { driver: 'codex' } });

        expect(icon.element.tagName).toBe('SPAN');
        expect(icon.classes()).toContain('bg-current');
        expect(icon.attributes('style')).toContain('/images/drivers/codex.svg');
        expect(icon.attributes('style')).toContain('16px');
    });
});
