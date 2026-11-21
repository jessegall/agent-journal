// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { postJson, submitJson, UncertainOutcome } from './jsonRequests';

vi.mock('@/echo', () => ({ xsrfToken: () => 'token' }));

const route = { url: '/chat/messages', method: 'post' as const };

function answer(status: number, body: string): void {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(body === '' ? null : body, { status })));
}

describe('submitJson', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('settles a 2xx as accepted with its body and sends the request key as Idempotency-Key', async () => {
        answer(201, JSON.stringify({ messageId: 'message-1' }));

        const result = await submitJson<{ messageId: string }>(route, { body: 'Hi' }, { requestId: 'request-1' });

        expect(result).toEqual({ kind: 'accepted', body: { messageId: 'message-1' } });
        const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
        expect(url).toBe('/chat/messages');
        expect(init.method).toBe('POST');
        expect((init.headers as Record<string, string>)['Idempotency-Key']).toBe('request-1');
    });

    it('settles a refusal with its code, message and fields', async () => {
        answer(422, JSON.stringify({ code: 'session-changed', message: 'The session changed.', fields: { body: 'Too long.' } }));

        expect(await submitJson(route, {})).toEqual({
            kind: 'refused',
            status: 422,
            code: 'session-changed',
            message: 'The session changed.',
            fields: { body: 'Too long.' },
        });
    });

    it('settles an empty 422 as an unknown refusal with its status', async () => {
        answer(422, '');

        expect(await submitJson(route, {})).toEqual({
            kind: 'refused',
            status: 422,
            code: 'unknown',
            message: 'The change was refused.',
            fields: {},
        });
    });

    it('throws an uncertain outcome for a 500, a network failure and an unparsable 2xx', async () => {
        answer(500, 'Server Error');
        await expect(submitJson(route, {})).rejects.toBeInstanceOf(UncertainOutcome);

        vi.stubGlobal('fetch', vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))));
        await expect(submitJson(route, {})).rejects.toBeInstanceOf(UncertainOutcome);

        answer(200, '<html>');
        await expect(submitJson(route, {})).rejects.toBeInstanceOf(UncertainOutcome);
    });

    it('leaves postJson answering as before', async () => {
        answer(422, JSON.stringify({ message: 'No.' }));

        expect(await postJson('/somewhere')).toEqual({ ok: false, message: 'No.' });
    });
});
