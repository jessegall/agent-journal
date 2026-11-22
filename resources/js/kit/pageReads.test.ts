import { describe, expect, it, vi } from 'vitest';

type Options = Record<string, unknown> & {
    onSuccess: (page: { props: Record<string, unknown> }) => void;
    onHttpException: (response: { status: number }) => boolean;
    onNetworkError: () => boolean;
};

const reloads: Options[] = [];

vi.mock('@inertiajs/vue3', () => ({ router: { reload: (options: Options) => reloads.push(options) } }));

const { pageReadProp, PropReadFailed, readPage } = await import('./pageReads');

describe('readPage', () => {
    it('reloads only the read prop with its own query and settles its answer, its status or a lost answer', async () => {
        const answered = readPage('chat.events', { inboxId: 'inbox-1' });
        reloads[0].onSuccess({ props: { read_chat_events: { cursor: 'c-1' } } });
        const refused = readPage('chat.rows', { inboxId: 'inbox-1' });
        const showsErrorPage = reloads[1].onHttpException({ status: 409 });
        const lost = readPage('chat.rows', { inboxId: 'inbox-1' });
        reloads[2].onNetworkError();

        await expect(answered).resolves.toEqual({ cursor: 'c-1' });
        expect(pageReadProp('web.terminal-frame')).toBe('read_web_terminal_frame');
        expect(reloads[0]).toMatchObject({
            only: ['read_chat_events'],
            async: true,
            preserveUrl: true,
            data: { read: { read_chat_events: { inboxId: 'inbox-1' } } },
        });
        await expect(refused).rejects.toEqual(new PropReadFailed(409));
        expect(showsErrorPage).toBe(false);
        await expect(lost).rejects.toEqual(new PropReadFailed(null));
    });
});
