// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Modal from './Modal.vue';

function openModal(step = 2) {
    return mount(Modal, {
        attachTo: document.body,
        props: { isOpen: true, title: 'Add an account', stepCount: 3, step },
        slots: {
            default: '<button data-first>First</button><input data-field />',
            footer: '<button data-last>Continue</button>',
        },
    });
}

describe('Modal', () => {
    it('opens as a dialog with its title and a blue bar for each step up to the one shown', async () => {
        const modal = openModal(2);
        await modal.vm.$nextTick();

        expect(modal.find('dialog').element.open).toBe(true);
        expect(modal.find('h3').text()).toBe('Add an account');
        expect(
            modal
                .findAll('[data-step-bar]')
                .map((bar) => bar.attributes('data-done')),
        ).toEqual(['true', 'true', 'false']);
        modal.unmount();
    });

    it('keeps the same header, body and footer sizes on every step, within a narrow screen', () => {
        const modal = openModal(1);

        expect(modal.find('dialog').classes()).toContain('w-[min(480px,calc(100vw-32px))]');
        expect(modal.find('header').classes()).toContain('h-[52px]');
        expect(modal.find('footer').classes()).toContain('min-h-[52px]');
        expect(modal.find('header + div').classes()).toContain('h-[min(420px,calc(100dvh-136px))]');
        modal.unmount();
    });

    it('asks its owner to close on Escape and on the close button, and stays open until told', async () => {
        const modal = openModal();
        await modal.vm.$nextTick();

        await modal.find('dialog').trigger('cancel');
        await modal.find('button[aria-label="Close"]').trigger('click');

        expect(modal.emitted('close')).toHaveLength(2);
        expect(modal.find('dialog').element.open).toBe(true);

        await modal.setProps({ isOpen: false });
        await modal.vm.$nextTick();
        expect(modal.find('dialog').element.open).toBe(false);
        modal.unmount();
    });

    it('keeps the Tab key inside the window', async () => {
        const modal = openModal();
        await modal.vm.$nextTick();
        const close = modal.find('button[aria-label="Close"]')
            .element as HTMLElement;
        const last = modal.find('[data-last]').element as HTMLElement;

        last.focus();
        await modal.find('dialog').trigger('keydown', { key: 'Tab' });
        expect(document.activeElement).toBe(close);

        close.focus();
        await modal
            .find('dialog')
            .trigger('keydown', { key: 'Tab', shiftKey: true });
        expect(document.activeElement).toBe(last);
        modal.unmount();
    });
});
