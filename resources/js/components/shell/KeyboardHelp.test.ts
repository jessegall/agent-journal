// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import KeyboardHelp from './KeyboardHelp.vue';
import { shortcutGroups } from './shortcuts';
import { useShellOverlays } from '@/composables/useShellOverlays';

describe('the keyboard help', () => {
    it('lists every shortcut with its keys in a dialog, and closes on Escape', async () => {
        const { isHelpOpen } = useShellOverlays();
        isHelpOpen.value = true;
        const view = mount(KeyboardHelp, { attachTo: document.body });
        await view.vm.$nextTick();

        expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
        expect(document.body.querySelectorAll('kbd').length).toBeGreaterThanOrEqual(shortcutGroups.length);

        document.body.querySelector('[role="dialog"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await view.vm.$nextTick();

        expect(isHelpOpen.value).toBe(false);
        view.unmount();
    });
});
