// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { DocumentCommentsPartData } from '@generated/types/documents';
import DocumentComments from './DocumentComments.vue';
import { draftFor } from '@kit/lineComments';

vi.mock('@/routes/comments', () => ({ post: { url: () => '/comments' } }));

function part(overrides: Partial<DocumentCommentsPartData> = {}): DocumentCommentsPartData {
    return {
        revision: '3',
        target: 'doc 7',
        blocks: [1, 2, 3, 4].map((line) => ({ line, text: `Line ${line}` })),
        threads: [],
        recipients: [],
        ...overrides,
    };
}

function mountPart(props: DocumentCommentsPartData) {
    return mount(DocumentComments, { props, attachTo: document.body });
}

describe('the document comments', () => {
    it('selects lines by their gutter and comments with the bar under the last selected line', async () => {
        const view = mountPart(part());

        await view.get('[data-line="2"] button').trigger('click');
        await view.get('[data-line="3"] button').trigger('click', { shiftKey: true });
        await view.get('[data-line="3"] button').trigger('keydown', { key: 'c' });

        const bar = view.get('[role="group"][aria-label="Comment on lines 2–3"]');
        expect(view.get('[data-line="3"]').element.nextElementSibling?.contains(bar.element)).toBe(true);
        view.unmount();
    });

    it('opens the same bar from the keyboard with the Comment key on a line', async () => {
        const view = mountPart(part());

        await view.get('[data-line="1"] button').trigger('keydown', { key: 'c' });

        expect(view.find('[aria-label="Your comment"]').exists()).toBe(true);
        view.unmount();
    });

    it('keeps a draft for its revision and range apart from every other', () => {
        const first = draftFor('doc 7', '3', 2, 3);
        first.text = 'kept';

        expect(draftFor('doc 7', '3', 2, 3).text).toBe('kept');
        expect(draftFor('doc 7', '4', 2, 3).text).toBe('');
        expect(draftFor('doc 7', '3', 2, 4).text).toBe('');
    });

    it('keeps the text of a failed send and offers Retry for the same revision and range', async () => {
        const send = vi.spyOn(router, 'post').mockImplementation((_url, _data, options) => {
            options?.onNetworkError?.(new Error('offline') as never);
        });
        const view = mountPart(part());

        await view.get('[data-line="2"] button').trigger('click');
        await view.get('[data-line="2"] button').trigger('keydown', { key: 'c' });
        await view.get('textarea').setValue('Why this?');
        const sendButton = view.findAll('button').find((button) => button.text() === 'Send');
        await sendButton?.trigger('click');

        expect(view.get('textarea').element.value).toBe('Why this?');
        expect(send.mock.calls[0][2]).toMatchObject({ only: ['page'], preserveState: true });
        const retry = view.findAll('button').find((button) => button.text() === 'Retry');
        expect(retry?.exists()).toBe(true);

        await retry?.trigger('click');
        expect(send).toHaveBeenCalledTimes(2);
        expect(send.mock.calls[1][1]).toMatchObject({ version: '3', first_line: 2, last_line: 2, body: 'Why this?' });
        expect(send.mock.calls[1][1]).toEqual(send.mock.calls[0][1]);
        send.mockRestore();
        view.unmount();
    });

    it('shows Read by only when a delivery receipt supplies it, and offers no Reply or chat', () => {
        const view = mountPart(
            part({
                threads: [
                    { id: 'a', firstLine: 1, lastLine: 1, author: 'user 1', text: 'One', recipient: 'Agent 1', readBy: 'Agent 1' },
                    { id: 'b', firstLine: 3, lastLine: 3, author: 'user 1', text: 'Two' },
                ],
            }),
        );
        const threads = view.findAll('[role="group"]');

        expect(threads[0].text()).toContain('Read by Agent 1');
        expect(threads[1].text()).not.toContain('Read by');
        expect(view.findAll('button').some((button) => button.text() === 'Reply')).toBe(false);
        view.unmount();
    });

    it('offers the recipient menu only where the server supplies recipients and a feedback address', async () => {
        const without = mountPart(part({ recipients: [{ id: 'r', name: 'Agent 1' }] }));
        await without.get('[data-line="1"] button').trigger('keydown', { key: 'c' });
        expect(without.find('[aria-haspopup="menu"]').exists()).toBe(false);
        without.unmount();

        const withFeedback = mountPart(part({ recipients: [{ id: 'r', name: 'Agent 1' }], feedbackAddress: '/feedback' }));
        await withFeedback.get('[data-line="1"] button').trigger('keydown', { key: 'c' });
        expect(withFeedback.find('[aria-haspopup="menu"]').exists()).toBe(true);
        withFeedback.unmount();
    });
});
