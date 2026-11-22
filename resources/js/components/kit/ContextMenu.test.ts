// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

vi.mock('@inertiajs/vue3', () => ({
    Link: { template: '<a><slot /></a>' },
}));

const { default: ContextMenu } = await import('./ContextMenu.vue');
const { default: MenuItem } = await import('./MenuItem.vue');

function contextMenu() {
    return mount(ContextMenu, {
        attachTo: document.body,
        props: { label: 'Actions for the document bar' },
        slots: {
            default: () => [h('button', { id: 'host' }, 'Bar'), h('input', { id: 'field' })],
            menu: () => [h(MenuItem, () => 'Open'), h(MenuItem, { disabled: true }, () => 'Hand it over'), h(MenuItem, () => 'Copy')],
        },
    });
}

afterEach(() => {
    document.body.innerHTML = '';
    window.getSelection()?.removeAllRanges();
});

describe('ContextMenu', () => {
    it('opens at the pointer on a right click, on the first enabled item, named by its label', async () => {
        const view = contextMenu();

        await view.get('#host').trigger('contextmenu', { clientX: 40, clientY: 50 });
        await new Promise((resolve) => setTimeout(resolve));

        const menu = view.get('[role="menu"]');

        expect(menu.attributes('aria-label')).toBe('Actions for the document bar');
        expect(menu.attributes('style')).toContain('left: 40px');
        expect(menu.attributes('style')).toContain('top: 50px');
        expect(document.activeElement?.textContent).toBe('Open');
    });

    it('opens from the Menu key and from Shift+F10 at the focused element', async () => {
        const view = contextMenu();

        await view.get('#host').trigger('keydown', { key: 'ContextMenu' });
        expect(view.find('[role="menu"]').exists()).toBe(true);

        await view.get('[role="menu"]').trigger('keydown', { key: 'Escape' });
        expect(view.find('[role="menu"]').exists()).toBe(false);

        await view.get('#host').trigger('keydown', { key: 'F10', shiftKey: true });
        expect(view.find('[role="menu"]').exists()).toBe(true);
    });

    it('does not open over a field, so the browser menu stays', async () => {
        const view = contextMenu();

        await view.get('#field').trigger('contextmenu');

        expect(view.find('[role="menu"]').exists()).toBe(false);
    });

    it('does not open over selected text, so Copy works there', async () => {
        const view = contextMenu();
        const host = view.get('#host').element;
        const range = document.createRange();
        range.selectNodeContents(host);
        window.getSelection()?.addRange(range);

        await view.get('#host').trigger('contextmenu');

        expect(view.find('[role="menu"]').exists()).toBe(false);
    });

    it('moves between the enabled items with the arrow keys and wraps', async () => {
        const view = contextMenu();
        await view.get('#host').trigger('contextmenu', { clientX: 1, clientY: 1 });
        const menu = view.get('[role="menu"]');

        await menu.trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement?.textContent).toBe('Copy');

        await menu.trigger('keydown', { key: 'ArrowDown' });
        expect(document.activeElement?.textContent).toBe('Open');
    });

    it('closes with Escape and gives the focus back to the element that had it', async () => {
        const view = contextMenu();
        (view.get('#host').element as HTMLElement).focus();
        await view.get('#host').trigger('contextmenu', { clientX: 1, clientY: 1 });

        await view.get('[role="menu"]').trigger('keydown', { key: 'Escape' });

        expect(view.find('[role="menu"]').exists()).toBe(false);
        expect(document.activeElement).toBe(view.get('#host').element);
    });

    it('closes when an item is chosen', async () => {
        const view = contextMenu();
        await view.get('#host').trigger('contextmenu', { clientX: 1, clientY: 1 });

        await view.findAll('[role="menuitem"]')[0].trigger('click');

        expect(view.find('[role="menu"]').exists()).toBe(false);
    });
});
