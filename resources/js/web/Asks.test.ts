// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { provideWindowKey } from '@/framework/useWindowQuery';
import type { AskInbox } from '@/types/generated';
import Asks from './Asks.vue';

vi.mock('@inertiajs/vue3', () => ({
    Head: defineComponent({ name: 'Head', render: () => null }),
}));

const data = { cards: [] } as unknown as AskInbox;

describe('the asks', () => {
    it('name themselves on their own page', () => {
        const view = mount(Asks, { props: { data } });

        expect(view.find('h1').exists()).toBe(true);
    });

    it('leave the heading to the window frame on Home', () => {
        const InWindow = defineComponent({
            setup() {
                provideWindowKey('web.asks');

                return () => h(Asks, { data });
            },
        });
        const view = mount(InWindow, {});

        expect(view.find('h1').exists()).toBe(false);
        expect(view.findComponent({ name: 'Head' }).exists()).toBe(false);
    });
});
