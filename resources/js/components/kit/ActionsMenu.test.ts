// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

vi.mock('@inertiajs/vue3', () => ({
    Link: { template: '<a><slot /></a>' },
}));

const { default: ActionsMenu } = await import('./ActionsMenu.vue');
const { default: ActionsMenuItem } = await import('./ActionsMenuItem.vue');

function menu() {
    return mount(ActionsMenu, {
        attachTo: document.body,
        props: { label: 'Actions for build plan 12' },
        slots: {
            default: () => [
                h(ActionsMenuItem, () => 'Start plan'),
                h(ActionsMenuItem, { disabled: true }, () => 'Pause plan'),
                h(ActionsMenuItem, { href: '/plans?plan=12' }, () => 'Open plan'),
            ],
        },
    });
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('ActionsMenu', () => {
    it('names its button and its menu by the label and opens on the first item', async () => {
        const view = menu();
        const button = view.get('button[aria-haspopup="menu"]');

        expect(button.attributes('aria-label')).toBe('Actions for build plan 12');
        expect(button.attributes('aria-expanded')).toBe('false');
        expect(view.get('[role="menu"]').attributes('aria-label')).toBe('Actions for build plan 12');

        await button.trigger('click');

        expect(button.attributes('aria-expanded')).toBe('true');
        expect(document.activeElement?.textContent).toBe('Start plan');
    });

    it('moves between the enabled items with the arrow keys, Home and End', async () => {
        const view = menu();
        await view.get('button[aria-haspopup="menu"]').trigger('click');
        const panel = view.get('[role="menu"]');

        await panel.trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement?.textContent).toBe('Open plan');

        await panel.trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement?.textContent).toBe('Start plan');

        await panel.trigger('keydown', { key: 'End' });
        expect(document.activeElement?.textContent).toBe('Open plan');

        await panel.trigger('keydown', { key: 'Home' });
        expect(document.activeElement?.textContent).toBe('Start plan');
    });

    it('opens on the last item with the up arrow on its button', async () => {
        const view = menu();
        await view.get('button[aria-haspopup="menu"]').trigger('keydown', { key: 'ArrowUp' });
        await new Promise((resolve) => setTimeout(resolve));

        expect(document.activeElement?.textContent).toBe('Open plan');
    });

    it('closes with Escape and gives the focus back to its button', async () => {
        const view = menu();
        const button = view.get('button[aria-haspopup="menu"]');
        await button.trigger('click');

        await view.get('[role="menu"]').trigger('keydown', { key: 'Escape' });

        expect(button.attributes('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(button.element);
    });

    it('closes when an item is chosen', async () => {
        const view = menu();
        const button = view.get('button[aria-haspopup="menu"]');
        await button.trigger('click');

        await view.findAll('[role="menuitem"]')[0].trigger('click');

        expect(button.attributes('aria-expanded')).toBe('false');
    });
});
