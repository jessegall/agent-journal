// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import IconAction from './IconAction.vue';

describe('IconAction', () => {
    it('puts a click and disabled on its button, so a disabled action does not fire', async () => {
        const clicked = vi.fn();
        const view = mount(IconAction, {
            props: { icon: 'close', tip: 'Close', label: 'Close the window' },
            attrs: { disabled: true, onClick: clicked },
        });

        const button = view.get('button');
        await button.trigger('click');

        expect(button.attributes('disabled')).toBeDefined();
        expect(view.get('span').attributes('disabled')).toBeUndefined();
        expect(clicked).not.toHaveBeenCalled();
    });

    it('fires its click from the button when it is enabled', async () => {
        const clicked = vi.fn();
        const view = mount(IconAction, {
            props: { icon: 'close', tip: 'Close', label: 'Close the window' },
            attrs: { onClick: clicked },
        });

        await view.get('button').trigger('click');

        expect(clicked).toHaveBeenCalledOnce();
    });
});
