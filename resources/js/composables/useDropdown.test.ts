// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { describe, expect, it } from 'vitest';
import { useDropdown } from './useDropdown';

/**
 * A menu button and its panel inside one element, as a dropdown is written.
 */
const Menu = defineComponent({
    setup() {
        const { isOpen, toggle } = useDropdown('menu');

        return () =>
            h('div', [
                h('div', { ref: 'menu' }, [
                    h('button', { class: 'toggle', onClick: toggle }, 'Scheme'),
                    isOpen.value ? h('div', { role: 'menu' }, 'System') : null,
                ]),
                h('p', { class: 'outside' }, 'Elsewhere'),
            ]);
    },
});

describe('useDropdown', () => {
    it('closes on a pointer outside it and stays open on a pointer inside it', async () => {
        const menu = mount(Menu, { attachTo: document.body });

        await menu.find('.toggle').trigger('click');
        menu.find('[role="menu"]').element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        await menu.vm.$nextTick();
        expect(menu.find('[role="menu"]').exists()).toBe(true);

        menu.find('.outside').element.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
        await menu.vm.$nextTick();
        expect(menu.find('[role="menu"]').exists()).toBe(false);
        menu.unmount();
    });

    it('closes on Escape, and its button closes it again', async () => {
        const menu = mount(Menu, { attachTo: document.body });

        await menu.find('.toggle').trigger('click');
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        await menu.vm.$nextTick();
        expect(menu.find('[role="menu"]').exists()).toBe(false);

        await menu.find('.toggle').trigger('click');
        await menu.find('.toggle').trigger('click');
        expect(menu.find('[role="menu"]').exists()).toBe(false);
        menu.unmount();
    });
});
