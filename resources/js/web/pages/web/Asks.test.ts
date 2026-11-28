// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import type { AskInbox } from '@/types/generated';
import Asks from './Asks.vue';
import AskInboxPane from './AskInboxPane.vue';

vi.mock('@inertiajs/vue3', () => ({
    Head: defineComponent({ name: 'Head', render: () => null }),
    Link: { props: ['href'], template: '<a :href="href"><slot /></a>' },
}));

const data = { cards: [] } as unknown as AskInbox;

describe('the asks', () => {
    it('name themselves on their own page', () => {
        const view = mount(Asks, { props: { data } });

        expect(view.find('h1').exists()).toBe(true);
    });

    it('leave the heading to the window frame on Home', () => {
        const view = mount(AskInboxPane, { props: { items: [], inboxUrl: '/asks' } });

        expect(view.get('a').attributes('href')).toBe('/asks');
        expect(view.find('h1').exists()).toBe(false);
        expect(view.findComponent({ name: 'Head' }).exists()).toBe(false);
    });
});
