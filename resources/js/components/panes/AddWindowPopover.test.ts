// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import AddWindowPopover from './AddWindowPopover.vue';
import type { PaneWindow } from './paneLayout';

const windows: PaneWindow[] = [
    { key: 'tasks', title: 'Tasks', icon: 'tasks' },
    { key: 'plans', title: 'Plans', icon: 'plan' },
    { key: 'documents', title: 'Documents', icon: 'docs' },
] as PaneWindow[];

function mountOpen(list: PaneWindow[] = windows) {
    const anchor = document.createElement('button');
    document.body.append(anchor);

    return {
        anchor,
        view: mount(AddWindowPopover, { props: { windows: list, anchor, open: true }, attachTo: document.body }),
    };
}

describe('the add window popover', () => {
    it('filters the windows by what is typed and names the active one for a screen reader', async () => {
        const { view } = mountOpen();
        const input = view.get('input');

        expect(view.findAll('[role="option"]')).toHaveLength(3);
        await input.setValue('pl');
        expect(view.findAll('[role="option"]').map((option) => option.text())).toEqual(['Plans']);
        expect(input.attributes('aria-controls')).toBe(view.get('[id^="add-window-"]').attributes('id'));
        expect(input.attributes('aria-activedescendant')).toBe(view.get('[role="option"]').attributes('id'));
        view.unmount();
    });

    it('adds the active window on Enter and closes', async () => {
        const { view } = mountOpen();
        await nextTick();

        await view.get('input').trigger('keydown', { key: 'ArrowDown' });
        await view.get('input').trigger('keydown', { key: 'Enter' });

        expect(view.emitted('add')).toEqual([['plans']]);
        expect(view.emitted('update:open')?.at(-1)).toEqual([false]);
        view.unmount();
    });

    it('says no window matches and leaves the arrows and Enter doing nothing', async () => {
        const { view } = mountOpen();
        const input = view.get('input');

        await input.setValue('zzz');
        await input.trigger('keydown', { key: 'ArrowDown' });
        await input.trigger('keydown', { key: 'Enter' });

        expect(view.findAll('[role="option"]')).toHaveLength(0);
        expect(view.get('[role="status"]').text()).toBe('No window matches');
        expect(view.emitted('add')).toBeUndefined();
        view.unmount();
    });

    it('closes on Escape and gives the focus back to the button', async () => {
        const { view, anchor } = mountOpen();

        await view.get('input').trigger('keydown', { key: 'Escape' });

        expect(view.emitted('update:open')?.at(-1)).toEqual([false]);
        expect(document.activeElement).toBe(anchor);
        view.unmount();
    });
});
