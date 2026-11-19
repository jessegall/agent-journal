import { xsrfToken } from '@kit/xsrfToken';

/**
 * What a JSON request to the journal answered: its body when it succeeded, or the refusal's message.
 */
export type JsonReply<T> = { ok: true; value: T } | { ok: false; message: string };

async function replyOf<T>(response: Response): Promise<JsonReply<T>> {
    if (response.ok) {
        return { ok: true, value: (await response.json()) as T };
    }

    return { ok: false, message: ((await response.json()) as { message: string }).message };
}

/**
 * Reads a JSON answer from the journal.
 */
export async function getJson<T>(url: string): Promise<JsonReply<T>> {
    return replyOf<T>(await fetch(url, { headers: { Accept: 'application/json' } }));
}

/**
 * What a poll of the journal answered: something new, nothing new (204), or the refusal's message.
 */
export type PollReply<T> = { type: 'value'; value: T } | { type: 'nothing' } | { type: 'refused'; message: string };

/**
 * Asks the journal for something new; a 204 answers that nothing changed.
 */
export async function pollJson<T>(url: string): Promise<PollReply<T>> {
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (response.status === 204) {
        return { type: 'nothing' };
    }

    const reply = await replyOf<T>(response);

    return reply.ok ? { type: 'value', value: reply.value } : { type: 'refused', message: reply.message };
}

/**
 * Sends a change to the journal with the session's XSRF token and an optional JSON body; keepalive lets the request
 * outlive a page that is being hidden.
 */
function send(method: 'POST' | 'PUT' | 'DELETE', url: string, body: Record<string, unknown>, keepalive = false) {
    return fetch(url, {
        method,
        credentials: 'same-origin',
        keepalive,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
        },
        body: JSON.stringify(body),
    });
}

/**
 * Posts to the journal and reads its JSON answer.
 */
export async function postJson<T>(url: string, body: Record<string, unknown> = {}): Promise<JsonReply<T>> {
    return replyOf<T>(await send('POST', url, body));
}

/**
 * Puts a change to the journal and reads its JSON answer.
 */
export async function putJson<T>(url: string, body: Record<string, unknown> = {}): Promise<JsonReply<T>> {
    return replyOf<T>(await send('PUT', url, body));
}

/**
 * Deletes in the journal without reading the answer, so it also goes out while the page is hidden.
 */
export async function deleteLeaving(url: string): Promise<void> {
    await send('DELETE', url, {}, true);
}
