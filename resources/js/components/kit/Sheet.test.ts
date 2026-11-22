// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Sheet from './Sheet.vue';

describe('Sheet', () => {
    it('is titled by its heading and asks to close on Close', async () => {
        const sheet = mount(Sheet, { props: { isOpen: false, title: 'Notifications' }, slots: { default: '<p>Rows</p>' } });

        expect(sheet.find('#sheet-title').text()).toBe('Notifications');
        expect(sheet.find('dialog').attributes('aria-labelledby')).toBe('sheet-title');

        await sheet.find('button[aria-label="Close"]').trigger('click');

        expect(sheet.emitted('close')).toHaveLength(1);
    });
});
