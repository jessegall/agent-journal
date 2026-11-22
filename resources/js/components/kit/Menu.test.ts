// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

vi.mock('@inertiajs/vue3', () => ({
    Link: { template: '<a><slot /></a>' },
}));

const { default: Menu } = await import('./Menu.vue');
const { default: MenuItem } = await import('./MenuItem.vue');
const { default: MenuSeparator } = await import('./MenuSeparator.vue');

function menu() {
    return mount(Menu, {
        attachTo: document.body,
        props: { label: 'Actions for build plan 12' },
        slots: {
            default: () => [
                h(MenuItem, () => 'Start plan'),
                h(MenuSeparator),
                h(MenuItem, { disabled: true }, () => 'Pause plan'),
                h(MenuItem, { href: '/plans?plan=12' }, () => 'Open plan'),
                h(MenuItem, { checked: true }, () => 'Wide'),
            ],
        },
    });
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('Menu', () => {
    it('names its button and its menu by the label and opens on the first enabled item', async () => {
        const view = menu();
        const button = view.get('button[aria-haspopup="menu"]');

        expect(button.attributes('aria-label')).toBe('Actions for build plan 12');
        expect(button.attributes('aria-expanded')).toBe('false');
        expect(view.get('[role="menu"]').attributes('aria-label')).toBe('Actions for build plan 12');

        await button.trigger('click');

        expect(button.attributes('aria-expanded')).toBe('true');
        expect(document.activeElement?.textContent).toBe('Start plan');
    });

    it('moves between the enabled items with Down and Up, wraps, and jumps with Home and End', async () => {
        const view = menu();
        await view.get('button[aria-haspopup="menu"]').trigger('click');
        const panel = view.get('[role="menu"]');

        await panel.trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement?.textContent).toBe('Open plan');

        await panel.trigger('keydown', { key: 'ArrowDown' });
        await panel.trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement?.textContent).toBe('Start plan');

        await panel.trigger('keydown', { key: 'ArrowUp' });
        expect(document.activeElement?.textContent).toBe('Wide');

        await panel.trigger('keydown', { key: 'Home' });
        expect(document.activeElement?.textContent).toBe('Start plan');

        await panel.trigger('keydown', { key: 'End' });
        expect(document.activeElement?.textContent).toBe('Wide');
    });

    it('moves to the next enabled item that starts with the letters typed', async () => {
        const view = menu();
        await view.get('button[aria-haspopup="menu"]').trigger('click');
        const panel = view.get('[role="menu"]');

        await panel.trigger('keydown', { key: 'o' });
        expect(document.activeElement?.textContent).toBe('Open plan');

        await panel.trigger('keydown', { key: 'p' });
        expect(document.activeElement?.textContent).toBe('Open plan');

        await new Promise((resolve) => setTimeout(resolve, 600));
        await panel.trigger('keydown', { key: 'w' });
        expect(document.activeElement?.textContent).toBe('Wide');
    });

    it('opens on the last item with Up on its button', async () => {
        const view = menu();
        await view.get('button[aria-haspopup="menu"]').trigger('keydown', { key: 'ArrowUp' });
        await new Promise((resolve) => setTimeout(resolve));

        expect(document.activeElement?.textContent).toBe('Wide');
    });

    it('closes with Escape and gives the focus back to its button', async () => {
        const view = menu();
        const button = view.get('button[aria-haspopup="menu"]');
        await button.trigger('click');

        await view.get('[role="menu"]').trigger('keydown', { key: 'Escape' });

        expect(button.attributes('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(button.element);
    });

    it('closes with Tab without taking the focus from where Tab sends it', async () => {
        const view = menu();
        const button = view.get('button[aria-haspopup="menu"]');
        await button.trigger('click');

        await view.get('[role="menu"]').trigger('keydown', { key: 'Tab' });

        expect(button.attributes('aria-expanded')).toBe('false');
    });

    it('closes when an item is chosen and returns the focus to its button', async () => {
        const view = menu();
        const button = view.get('button[aria-haspopup="menu"]');
        await button.trigger('click');

        await view.findAll('[role="menuitem"]')[0].trigger('click');

        expect(button.attributes('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(button.element);
    });

    it('marks a ticked item menuitemcheckbox with aria-checked', async () => {
        const view = menu();

        const ticked = view.get('[role="menuitemcheckbox"]');

        expect(ticked.attributes('aria-checked')).toBe('true');
    });
});
