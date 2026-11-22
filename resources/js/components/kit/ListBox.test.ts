// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

vi.mock('@inertiajs/vue3', () => ({
    Link: { template: '<a><slot /></a>' },
}));

const { default: ListBox } = await import('./ListBox.vue');
const { default: MenuItem } = await import('./MenuItem.vue');
const { default: MenuGroup } = await import('./MenuGroup.vue');

function listBox(props: Record<string, unknown> = {}) {
    return mount(ListBox, {
        attachTo: document.body,
        props: { label: 'Add a window', ...props },
        slots: {
            default: () => [
                h(MenuGroup, { label: 'Windows' }, () => [
                    h(MenuItem, { id: 'o-tasks', option: true }, () => 'Tasks'),
                    h(MenuItem, { id: 'o-plans', option: true, disabled: true }, () => 'Plans'),
                    h(MenuItem, { id: 'o-docs', option: true }, () => 'Documents'),
                ]),
            ],
        },
    });
}

function press(view: ReturnType<typeof listBox>, key: string) {
    const event = new KeyboardEvent('keydown', { key, cancelable: true });

    view.vm.controlKeys(event);

    return event;
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('ListBox', () => {
    it('is a labelled listbox of options that are selected only while active', async () => {
        const view = listBox();
        await nextTick();

        const options = view.findAll('[role="option"]');

        expect(view.get('[role="listbox"]').attributes('aria-label')).toBe('Add a window');
        expect(options).toHaveLength(3);
        expect(options[0].attributes('aria-selected')).toBe('true');
        expect(options[2].attributes('aria-selected')).toBe('false');
    });

    it('makes the first option active and draws it with the active look', async () => {
        const view = listBox();
        await nextTick();

        expect(view.emitted('update:activeId')?.[0]).toEqual(['o-tasks']);
        expect(view.get('#o-tasks').classes()).toEqual(expect.arrayContaining(['bg-sel', 'ring-2', 'ring-focus']));
    });

    it('moves the active option with Down and Up, skips a disabled one and wraps', async () => {
        const view = listBox({ activeId: 'o-tasks' });

        press(view, 'ArrowDown');
        expect(view.emitted('update:activeId')?.at(-1)).toEqual(['o-docs']);

        await view.setProps({ activeId: 'o-docs' });
        press(view, 'ArrowDown');
        expect(view.emitted('update:activeId')?.at(-1)).toEqual(['o-tasks']);

        press(view, 'ArrowUp');
        expect(view.emitted('update:activeId')?.at(-1)).toEqual(['o-docs']);
    });

    it('jumps with Home and End and chooses the active option with Enter', async () => {
        const view = listBox({ activeId: 'o-docs' });
        const chosen = vi.fn();
        view.get('#o-docs').element.addEventListener('click', chosen);

        press(view, 'Home');
        expect(view.emitted('update:activeId')?.at(-1)).toEqual(['o-tasks']);

        press(view, 'End');
        expect(view.emitted('update:activeId')?.at(-1)).toEqual(['o-docs']);

        const event = press(view, 'Enter');

        expect(chosen).toHaveBeenCalledOnce();
        expect(event.defaultPrevented).toBe(true);
    });

    it('does nothing on an empty list and leaves the keys to the field', () => {
        const view = mount(ListBox, { props: { label: 'Empty' } });
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });

        view.vm.controlKeys(event);

        expect(event.defaultPrevented).toBe(false);
        expect(view.emitted('update:activeId')).toBeUndefined();
    });

    it('is 340 high as a popover and 420 high as a palette', () => {
        expect(listBox().get('[role="listbox"]').classes()).toContain('max-h-85');
        expect(listBox({ size: 'palette' }).get('[role="listbox"]').classes()).toContain('max-h-105');
    });
});
