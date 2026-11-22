// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import MenuItemSub from './MenuItemSub.vue';

describe('MenuItemSub', () => {
    it('shows its slot as one line in the badge size and the third text colour', () => {
        const view = mount(MenuItemSub, { slots: { default: 'Only you can see it' } });

        expect(view.text()).toBe('Only you can see it');
        expect(view.classes()).toEqual(expect.arrayContaining(['block', 'truncate', 'min-w-0', 'text-badge', 'text-text-3']));
    });

    it('has no role and no tab stop, so the menu item holds the keyboard and the reading', async () => {
        const view = mount(MenuItemSub, { slots: { default: 'Sub' } });

        await view.trigger('keydown', { key: 'Enter' });

        expect(view.attributes('role')).toBeUndefined();
        expect(view.attributes('tabindex')).toBeUndefined();
    });

    it('passes an id through, so an item can describe itself from it with aria-describedby', () => {
        const view = mount(MenuItemSub, { attrs: { id: 'sub-1' }, slots: { default: 'Sub' } });

        expect(view.attributes('id')).toBe('sub-1');
    });
});
