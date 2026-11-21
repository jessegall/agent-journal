// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import OptionCards from './OptionCards.vue';

const options = [
    { value: 'sign-in', title: 'Sign in with Claude', aside: 'Subscription', description: 'Opens the page.' },
    { value: 'token', title: 'Provider token', aside: 'Subscription', description: 'Paste a token.' },
    { value: 'key', title: 'API key', aside: 'API usage', description: 'Paste a key.' },
];

function mountCards(chosen: string | null) {
    const view = mount(OptionCards, {
        attachTo: document.body,
        props: {
            label: 'How to sign in',
            options,
            modelValue: chosen,
            'onUpdate:modelValue': (value: string | null) => view.setProps({ modelValue: value }),
        },
    });

    return view;
}

describe('OptionCards', () => {
    it('shows each card with its title, grey aside and description, none chosen and the first in the tab order', () => {
        const view = mountCards(null);
        const cards = view.findAll('[role="radio"]');

        expect(cards[0].text()).toContain('Sign in with Claude');
        expect(cards[2].text()).toContain('API usage');
        expect(cards[1].text()).toContain('Paste a token.');
        expect(cards.map((card) => card.attributes('aria-checked'))).toEqual(['false', 'false', 'false']);
        expect(cards.map((card) => card.attributes('tabindex'))).toEqual(['0', '-1', '-1']);
        view.unmount();
    });

    it('marks the chosen card with the blue outline and the checked state', () => {
        const view = mountCards('token');
        const chosen = view.findAll('[role="radio"]')[1];

        expect(chosen.attributes('aria-checked')).toBe('true');
        expect(chosen.attributes('tabindex')).toBe('0');
        expect(chosen.classes()).toContain('border-brand');
        view.unmount();
    });

    it('chooses with a click, the arrow keys and Space, and confirms with Enter or a double click', async () => {
        const view = mountCards(null);
        const group = view.find('[role="radiogroup"]');
        const cards = view.findAll('[role="radio"]');

        await cards[1].trigger('click');
        expect(view.emitted('update:modelValue')?.at(-1)).toEqual(['token']);

        await group.trigger('keydown', { key: 'ArrowDown' });
        expect(view.emitted('update:modelValue')?.at(-1)).toEqual(['key']);
        expect(document.activeElement?.textContent).toContain('API key');

        await group.trigger('keydown', { key: 'ArrowUp' });
        expect(view.emitted('update:modelValue')?.at(-1)).toEqual(['token']);

        await cards[0].trigger('keydown', { key: ' ' });
        expect(view.emitted('update:modelValue')?.at(-1)).toEqual(['sign-in']);

        await cards[2].trigger('keydown', { key: 'Enter' });
        await cards[0].trigger('dblclick');
        expect(view.emitted('confirm')).toEqual([['key'], ['sign-in']]);
        view.unmount();
    });
});
