// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MenuItemLabel from './MenuItemLabel.vue';

describe('MenuItemLabel', () => {
    it('shows its slot as one truncating line in the small text size', () => {
        const view = mount(MenuItemLabel, { slots: { default: 'Rename conversation' } });

        expect(view.text()).toBe('Rename conversation');
        expect(view.element.tagName).toBe('SPAN');
        expect(view.classes()).toEqual(expect.arrayContaining(['truncate', 'min-w-0', 'flex-1', 'text-small']));
    });

    it('sets no colour of its own, so the item decides it on hover, active and disabled', () => {
        const view = mount(MenuItemLabel, { slots: { default: 'Copy' } });

        expect(view.classes().filter((name) => name.startsWith('text-text') || name.startsWith('opacity'))).toEqual([]);
    });

    it('has no role and no tab stop, so a menu item is named by its text and is the one that takes the keys', async () => {
        const view = mount(MenuItemLabel, { slots: { default: 'Copy' } });

        await view.trigger('keydown', { key: 'Enter' });

        expect(view.attributes('role')).toBeUndefined();
        expect(view.attributes('tabindex')).toBeUndefined();
    });

    it('passes an id through, so an item can name itself from it with aria-labelledby', () => {
        const view = mount(MenuItemLabel, { attrs: { id: 'label-1' }, slots: { default: 'Copy' } });

        expect(view.attributes('id')).toBe('label-1');
    });
});
