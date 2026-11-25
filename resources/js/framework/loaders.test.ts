import type { VisitOptions } from '@inertiajs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const visits: VisitOptions[] = [];
const replaced: string[] = [];
const shown = { props: {} as Record<string, unknown> };

vi.mock('@inertiajs/vue3', () => ({
    router: {
        reload: (options: VisitOptions) => visits.push(options),
        replaceProp: (name: string) => replaced.push(name),
    },
    usePage: () => shown,
}));

const { load, loadAfter, LoaderCancelled, LoaderFailed } = await import('./loaders');

const rows = { key: 'chat.rows', prop: 'load_chat_rows' } as const;

function tokenOf(options: VisitOptions): string {
    const header = (options.headers as Record<string, string>)['X-Journal-Loader-Input'];
    const binary = atob(header.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

    return (JSON.parse(new TextDecoder().decode(bytes)) as { token: string }).token;
}

function answer(options: VisitOptions, props: Record<string, unknown>): void {
    options.onSuccess?.({ props } as never);
}

describe('a loader call', () => {
    beforeEach(() => {
        visits.length = 0;
        replaced.length = 0;
    });

    it('reloads only its prop and the failure, keeping the page, and sends its key and input', () => {
        void load(rows, { inboxId: 'i-1', note: 'crème' });

        expect(visits[0]).toMatchObject({
            only: ['load_chat_rows', 'loaderFailure'],
            async: true,
            preserveState: true,
            preserveScroll: true,
            preserveUrl: true,
            preserveErrors: true,
        });
        expect((visits[0].headers as Record<string, string>)['X-Journal-Loader']).toBe('chat.rows');
        expect(tokenOf(visits[0])).toMatch(/^[A-Za-z0-9_-]{1,64}$/);
    });

    it('settles each call with its own answer when answers come out of order, and drops both keys', async () => {
        const first = load(rows, { inboxId: 'i-1' });
        const second = load(rows, { inboxId: 'i-2' });

        answer(visits[1], { load_chat_rows: { token: tokenOf(visits[1]), status: 'ok', value: 'second' } });
        answer(visits[0], { load_chat_rows: { token: tokenOf(visits[0]), status: 'ok', value: 'first' } });

        expect(await first).toEqual({ status: 'ok', value: 'first' });
        expect(await second).toEqual({ status: 'ok', value: 'second' });
        expect(replaced).toEqual(['load_chat_rows', 'loaderFailure', 'load_chat_rows', 'loaderFailure']);
    });

    it('settles invalid with its field errors and unavailable alike for every reason', async () => {
        const invalid = load(rows, { inboxId: '' });
        const unavailable = load(rows, { inboxId: 'gone' });

        answer(visits[0], {
            loaderFailure: { token: tokenOf(visits[0]), status: 'invalid', errors: { inboxId: 'Required.' } },
        });
        answer(visits[1], { loaderFailure: { token: tokenOf(visits[1]), status: 'unavailable' } });

        expect(await invalid).toEqual({ status: 'invalid', errors: { inboxId: 'Required.' } });
        expect(await unavailable).toEqual({ status: 'unavailable' });
    });

    it('still reads its answer when the page keeps form errors', async () => {
        const call = load(rows, { inboxId: 'i-1' });
        shown.props = {
            errors: { body: 'Too long.' },
            load_chat_rows: { token: tokenOf(visits[0]), status: 'ok', value: 1 },
        };

        visits[0].onError?.({ body: 'Too long.' });

        expect(await call).toEqual({ status: 'ok', value: 1 });
    });

    it('rejects with LoaderFailed on a server error or no answer, and with LoaderCancelled on leaving', async () => {
        const broken = load(rows, { inboxId: 'i-1' });
        const lost = load(rows, { inboxId: 'i-2' });
        const left = load(rows, { inboxId: 'i-3' });

        visits[0].onHttpException?.({ status: 500 } as never);
        visits[1].onNetworkError?.({} as never);
        visits[2].onCancel?.();

        await expect(broken).rejects.toEqual(new LoaderFailed(500));
        await expect(lost).rejects.toEqual(new LoaderFailed(null));
        await expect(left).rejects.toBeInstanceOf(LoaderCancelled);
    });

    it('rides on a write and settles from the page its redirect lands on', async () => {
        const posted: VisitOptions[] = [];
        const call = loadAfter(rows, { inboxId: 'i-1' }, (options) => posted.push(options));

        answer(posted[0], { load_chat_rows: { token: tokenOf(posted[0]), status: 'ok', value: 'head' } });

        expect(await call).toEqual({ status: 'ok', value: 'head' });
        expect(visits).toEqual([]);
    });
});
