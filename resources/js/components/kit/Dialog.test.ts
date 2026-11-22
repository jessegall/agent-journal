// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { h } from 'vue';
import Dialog from './Dialog.vue';

function dialog(props: Record<string, unknown> = {}) {
    return mount(Dialog, {
        attachTo: document.body,
        props: { open: true, title: 'New task', ...props },
        slots: {
            default: () => [h('input', { id: 'first' }), h('input', { id: 'second' })],
            footer: () => [h('button', { id: 'cancel' }, 'Cancel'), h('button', { id: 'save' }, 'Save')],
        },
    });
}

function shell(): HTMLElement {
    return document.body.querySelector('[role="dialog"]') as HTMLElement;
}

function press(key: string, init: KeyboardEventInit = {}): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });

    (document.activeElement ?? document.body).dispatchEvent(event);

    return event;
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('Dialog', () => {
    it('is a modal dialog named by its title, over a scrim', async () => {
        dialog();
        await Promise.resolve();

        const title = document.body.querySelector('h2') as HTMLElement;

        expect(shell().getAttribute('aria-modal')).toBe('true');
        expect(shell().getAttribute('aria-labelledby')).toBe(title.id);
        expect(title.textContent).toBe('New task');
        expect(document.body.querySelector('[aria-hidden="true"].bg-scrim')).not.toBeNull();
    });

    it('is sm 460, md 540 or lg 560 wide', () => {
        dialog({ size: 'sm' });
        expect(shell().className).toContain('max-w-115');

        document.body.innerHTML = '';
        dialog({ size: 'lg' });
        expect(shell().className).toContain('max-w-140');
    });

    it('draws nothing while it is closed', () => {
        dialog({ open: false });

        expect(shell()).toBeNull();
    });

    it('opens on its first field', async () => {
        dialog();
        await new Promise((resolve) => setTimeout(resolve));

        expect(document.activeElement?.id).toBe('first');
    });

    it('opens on the element its initialFocus names, and on the dialog itself when it has no field', async () => {
        dialog({ initialFocus: '#save' });
        await new Promise((resolve) => setTimeout(resolve));
        expect(document.activeElement?.id).toBe('save');

        document.body.innerHTML = '';
        mount(Dialog, { attachTo: document.body, props: { open: true, title: 'Keys' }, slots: { default: 'Text only' } });
        await new Promise((resolve) => setTimeout(resolve));
        expect(document.activeElement).toBe(shell());
    });

    it('keeps Tab and Shift+Tab inside, looping from the last control to the first and back', async () => {
        dialog();
        await new Promise((resolve) => setTimeout(resolve));
        const controls = [...shell().querySelectorAll<HTMLElement>('input, button')];
        const last = controls[controls.length - 1];

        last.focus();
        const forward = press('Tab');
        expect(forward.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(controls[0]);

        const backward = press('Tab', { shiftKey: true });
        expect(backward.defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(last);
    });

    it('asks to close on Escape and on a click on the scrim', async () => {
        const view = dialog();
        await new Promise((resolve) => setTimeout(resolve));

        press('Escape');
        (document.body.querySelector('.bg-scrim') as HTMLElement).click();

        expect(view.emitted('close')).toHaveLength(2);
    });

    it('gives the focus back to the opener when it closes', async () => {
        const opener = document.createElement('button');
        document.body.appendChild(opener);
        opener.focus();

        const view = dialog({ open: false });
        await view.setProps({ open: true });
        await new Promise((resolve) => setTimeout(resolve));
        expect(document.activeElement).not.toBe(opener);

        await view.setProps({ open: false });

        expect(document.activeElement).toBe(opener);
    });

    it('is named by aria-label when it has no header', () => {
        dialog({ header: false });

        expect(shell().getAttribute('aria-label')).toBe('New task');
        expect(shell().getAttribute('aria-labelledby')).toBeNull();
    });
});
