// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';

vi.mock('@inertiajs/vue3', () => ({
    Link: { template: '<a><slot /></a>' },
}));

const { default: SplitButton } = await import('./SplitButton.vue');
const { default: MenuItem } = await import('./MenuItem.vue');

function splitButton(props: Record<string, unknown> = {}) {
    return mount(SplitButton, {
        attachTo: document.body,
        props: { label: 'New task', icon: 'plus', hint: 'Create a task with a form', noun: 'task', ...props },
        slots: { default: () => [h(MenuItem, () => 'With an agent')] },
    });
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('SplitButton', () => {
    it('shows the main half with its label and runs create when it is pressed', async () => {
        const view = splitButton();
        const main = view.findAll('button')[0];

        await main.trigger('click');

        expect(main.text()).toContain('New task');
        expect(view.emitted('create')).toHaveLength(1);
    });

    it('rounds the main half on its left only and the chevron on its right only, without a left border', () => {
        const view = splitButton();
        const [main, chevron] = view.findAll('button');

        expect(main.classes()).toContain('rounded-r-none');
        expect(chevron.classes()).toEqual(expect.arrayContaining(['rounded-l-none', 'rounded-r-button', 'border-l-0', 'px-1.5']));
    });

    it('names the chevron by the noun, with aria-haspopup menu', () => {
        const chevron = splitButton().findAll('button')[1];

        expect(chevron.attributes('aria-label')).toBe('More ways to create a task');
        expect(chevron.attributes('aria-haspopup')).toBe('menu');
    });

    it('opens its menu from the chevron on the first item, and Down opens it from the keyboard', async () => {
        const view = splitButton();
        const chevron = view.findAll('button')[1];

        await chevron.trigger('keydown', { key: 'ArrowDown' });
        await new Promise((resolve) => setTimeout(resolve));

        expect(chevron.attributes('aria-expanded')).toBe('true');
        expect(document.activeElement?.textContent).toBe('With an agent');
    });

    it('disables both halves together', async () => {
        const view = splitButton({ disabled: true });
        const [main, chevron] = view.findAll('button');

        await main.trigger('click');

        expect(main.attributes('disabled')).toBeDefined();
        expect(chevron.attributes('disabled')).toBeDefined();
        expect(view.emitted('create')).toBeUndefined();
    });
});
