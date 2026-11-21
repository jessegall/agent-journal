import { pressedButtons, SPINNER_AFTER_MS } from './pressedButtons';
import { xsrfToken } from '@/echo';

/**
 * What a JSON request to the journal answered: its body when it succeeded, or the refusal's message.
 */
export type JsonReply<T> =
    | { ok: true; value: T }
    | { ok: false; message: string };

async function replyOf<T>(response: Response): Promise<JsonReply<T>> {
    if (response.ok) {
        return { ok: true, value: (await response.json()) as T };
    }

    return {
        ok: false,
        message: ((await response.json()) as { message: string }).message,
    };
}

/**
 * Reads a JSON answer from the journal.
 */
export async function getJson<T>(url: string): Promise<JsonReply<T>> {
    const hold = pressedButtons.hold(SPINNER_AFTER_MS);

    try {
        return await replyOf<T>(
            await fetch(url, { headers: { Accept: 'application/json' } }),
        );
    } finally {
        hold.release();
    }
}

/**
 * What a poll of the journal answered: something new, nothing new (204), or the refusal's message.
 */
export type PollReply<T> =
    | { type: 'value'; value: T }
    | { type: 'nothing' }
    | { type: 'refused'; message: string };

/**
 * Asks the journal for something new; a 204 answers that nothing changed.
 */
export async function pollJson<T>(url: string): Promise<PollReply<T>> {
    const response = await fetch(url, {
        headers: { Accept: 'application/json' },
    });
    if (response.status === 204) {
        return { type: 'nothing' };
    }

    const reply = await replyOf<T>(response);

    return reply.ok
        ? { type: 'value', value: reply.value }
        : { type: 'refused', message: reply.message };
}

type SentMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Sends a change to the journal with the session's XSRF token and an optional JSON body; keepalive lets the request
 * outlive a page that is being hidden.
 */
function send(
    method: SentMethod,
    url: string,
    body: Record<string, unknown>,
    sending: { keepalive?: boolean; headers?: Record<string, string>; signal?: AbortSignal } = {},
) {
    // The button that sent the change shows its spinner until the answer is read.
    const hold = pressedButtons.hold();
    const answered = fetch(url, {
        method,
        credentials: 'same-origin',
        keepalive: sending.keepalive ?? false,
        signal: sending.signal,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
            ...sending.headers,
        },
        body: JSON.stringify(body),
    });
    void answered.finally(() => hold.release());

    return answered;
}

/**
 * Posts to the journal and reads its JSON answer.
 */
export async function postJson<T>(
    url: string,
    body: Record<string, unknown> = {},
): Promise<JsonReply<T>> {
    return replyOf<T>(await send('POST', url, body));
}

/**
 * Puts a change to the journal and reads its JSON answer.
 */
export async function putJson<T>(
    url: string,
    body: Record<string, unknown> = {},
): Promise<JsonReply<T>> {
    return replyOf<T>(await send('PUT', url, body));
}

/**
 * Deletes in the journal without reading the answer, so it also goes out while the page is hidden.
 */
export async function deleteLeaving(url: string): Promise<void> {
    await send('DELETE', url, {}, { keepalive: true });
}

/**
 * A generated route: its URL and its method, as Wayfinder names them.
 */
export type JsonRoute = { url: string; method: 'post' | 'put' | 'patch' | 'delete' };

/**
 * The server's answer to a submitted change: accepted with its body, or refused with a stable code, its message and
 * the fields it names. A refusal is settled; nothing else is.
 */
export type SubmitResult<T> =
    | { kind: 'accepted'; body: T }
    | { kind: 'refused'; status: number; code: string; message: string; fields: Record<string, string> };

/**
 * The change may or may not have been made: the request never got an answer, was aborted, failed on the server or
 * answered with something that is not JSON. Only a later read can tell.
 */
export class UncertainOutcome extends Error {
    static of(reason: string): UncertainOutcome {
        return new UncertainOutcome(`The outcome is not known: ${reason}.`);
    }
}

/**
 * Submits a change to a generated route, with its request key as Idempotency-Key when given, and settles what the
 * server answered; an answer that settles nothing throws UncertainOutcome.
 */
export async function submitJson<T>(
    route: JsonRoute,
    body: Record<string, unknown>,
    options: { requestId?: string; headers?: Record<string, string>; signal?: AbortSignal } = {},
): Promise<SubmitResult<T>> {
    const headers = options.requestId === undefined
        ? { ...options.headers }
        : { ...options.headers, 'Idempotency-Key': options.requestId };
    const response = await send(route.method.toUpperCase() as SentMethod, route.url, body, {
        headers,
        signal: options.signal,
    }).catch((failure: unknown) => {
        throw UncertainOutcome.of(failure instanceof Error ? failure.message : 'the request failed');
    });

    if (response.ok) {
        return { kind: 'accepted', body: await acceptedBody<T>(response) };
    }

    if (response.status >= 400 && response.status < 500) {
        return { kind: 'refused', status: response.status, ...(await refusalOf(response)) };
    }

    throw UncertainOutcome.of(`the server answered ${response.status}`);
}

async function acceptedBody<T>(response: Response): Promise<T> {
    const text = await response.text();

    if (text === '') {
        return {} as T;
    }

    try {
        return JSON.parse(text) as T;
    } catch {
        throw UncertainOutcome.of('the answer was not JSON');
    }
}

/**
 * The refusal's code, message and fields; a body that is empty or not the refusal's shape refuses as unknown.
 */
async function refusalOf(response: Response): Promise<{ code: string; message: string; fields: Record<string, string> }> {
    const unknown = { code: 'unknown', message: 'The change was refused.', fields: {} };
    const text = await response.text();

    try {
        const refusal = JSON.parse(text) as { code?: unknown; message?: unknown; fields?: unknown };

        return {
            code: typeof refusal.code === 'string' ? refusal.code : unknown.code,
            message: typeof refusal.message === 'string' ? refusal.message : unknown.message,
            fields: isFieldMap(refusal.fields) ? refusal.fields : {},
        };
    } catch {
        return unknown;
    }
}

function isFieldMap(fields: unknown): fields is Record<string, string> {
    return typeof fields === 'object'
        && fields !== null
        && Object.values(fields).every((message) => typeof message === 'string');
}
