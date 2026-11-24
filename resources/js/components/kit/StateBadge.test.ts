// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import StateBadge from './StateBadge.vue';

describe('StateBadge', () => {
    it('draws a hollow dot for a state that has not begun and a filled one otherwise', () => {
        const waiting = mount(StateBadge, { props: { label: 'Open', tone: 'waiting' } });
        const good = mount(StateBadge, { props: { label: 'Done', tone: 'good' } });

        expect(waiting.get('[aria-hidden="true"]').classes()).toContain('bg-transparent');
        expect(good.get('[aria-hidden="true"]').classes()).toContain('bg-current');
    });
});
