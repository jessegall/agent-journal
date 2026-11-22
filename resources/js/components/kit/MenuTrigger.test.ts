// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

vi.mock('@inertiajs/vue3', () => ({
    Link: { template: '<a><slot /></a>' },
}));

const { default: MenuTrigger } = await import('./MenuTrigger.vue');
const { default: MenuItem } = await import('./MenuItem.vue');

function trigger(props: Record<string, unknown> = {}) {
    return mount(MenuTrigger, {
        attachTo: document.body,
        props: { label: 'Agent 1', ...props },
        slots: {
            leading: '<i id="avatar" />',
            default: () => [h(MenuItem, () => 'Rename'), h(MenuItem, () => 'Retire')],
        },
    });
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('MenuTrigger', () => {
    it('is the pill by default: 26 high, round, with the --border-2 border on --raised', () => {
        const button = trigger().get('button');

        expect(button.classes()).toEqual(expect.arrayContaining(['h-6.5', 'rounded-full', 'border-border-2', 'bg-raised']));
        expect(button.text()).toContain('Agent 1');
        expect(button.find('#avatar').exists()).toBe(true);
        expect(button.find('svg').exists()).toBe(true);
    });

    it('is the field at 24 high with a --line border and medium weight', () => {
        const button = trigger({ variant: 'field' }).get('button');

        expect(button.classes()).toEqual(expect.arrayContaining(['h-6', 'rounded-button', 'border-line', 'font-medium']));
    });

    it('is the who with a subline that ends in an ellipsis, and only the who shows one', () => {
        const who = trigger({ variant: 'who', subline: 'Working on task 12' }).get('button');
        const pill = trigger({ subline: 'Working on task 12' }).get('button');

        expect(who.classes()).toEqual(expect.arrayContaining(['rounded-field', 'hover:bg-hover']));
        expect(who.text()).toContain('Working on task 12');
        expect(who.get('.text-badge').classes()).toEqual(expect.arrayContaining(['truncate', 'text-text-3']));
        expect(pill.text()).not.toContain('Working on task 12');
    });

    it('shows a spinner while it is busy', () => {
        expect(trigger({ busy: true }).get('button').find('[aria-hidden="true"].animate-spin').exists()).toBe(true);
        expect(trigger().get('button').find('.animate-spin').exists()).toBe(false);
    });

    it('takes the hover fill and a 2px focus outline at offset 1 as a drop target', () => {
        const button = trigger({ variant: 'who', dropTarget: true }).get('button');

        expect(button.classes()).toEqual(expect.arrayContaining(['bg-hover', 'outline-2', 'outline-offset-1', 'outline-focus']));
    });

    it('has aria-haspopup menu and aria-expanded, and opens on a click (Enter, Space) and on Down', async () => {
        const view = trigger();
        const button = view.get('button');

        expect(button.attributes('aria-haspopup')).toBe('menu');
        expect(button.attributes('aria-expanded')).toBe('false');

        await button.trigger('click');
        expect(button.attributes('aria-expanded')).toBe('true');
        expect(document.activeElement?.textContent).toBe('Rename');

        await view.get('[role="menu"]').trigger('keydown', { key: 'Escape' });
        expect(button.attributes('aria-expanded')).toBe('false');

        await button.trigger('keydown', { key: 'ArrowDown' });
        await new Promise((resolve) => setTimeout(resolve));
        expect(button.attributes('aria-expanded')).toBe('true');
    });
});
