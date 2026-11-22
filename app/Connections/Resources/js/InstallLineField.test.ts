// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import InstallLineField from './InstallLineField.vue';

const props = { line: 'curl https://journal.example/i/abc | sh', expiresAt: '2026-11-22T10:10:00Z' };

describe('the install line field', () => {
    it('masks the line until Show and masks it again on Hide', async () => {
        const view = mount(InstallLineField, { props });
        const input = () => view.get('input');
        const toggle = () => view.findAll('button').find((button) => ['Show', 'Hide'].includes(button.text()));

        expect(input().attributes('type')).toBe('password');

        await toggle()?.trigger('click');
        expect(input().attributes('type')).toBe('text');
        expect(toggle()?.text()).toBe('Hide');

        await toggle()?.trigger('click');
        expect(input().attributes('type')).toBe('password');
    });

    it('shows the line for a manual copy when the clipboard refuses it', async () => {
        Object.assign(navigator, { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('refused')) } });
        const view = mount(InstallLineField, { props });

        await view.findAll('button').find((button) => button.text() === 'Copy')?.trigger('click');
        await flushPromises();

        expect(view.get('input').attributes('type')).toBe('text');
        expect(view.find('p.text-danger').exists()).toBe(true);
    });

    it('copies the line and says so, and holds the copy back while the journal cannot be reached', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator, { clipboard: { writeText } });
        const view = mount(InstallLineField, { props });

        await view.findAll('button').find((button) => button.text() === 'Copy')?.trigger('click');
        await flushPromises();

        expect(writeText).toHaveBeenCalledWith(props.line);
        expect(view.findAll('button').some((button) => button.text() === 'Copied')).toBe(true);

        await view.setProps({ isFresh: false });
        expect(view.findAll('button').find((button) => button.text() === 'Copied')?.attributes('disabled')).toBeDefined();
    });
});
