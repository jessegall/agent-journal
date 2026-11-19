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
 * Posts to the journal with the session's XSRF token and reads its JSON answer.
 */
export async function postJson<T>(url: string): Promise<JsonReply<T>> {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
        },
    });

    return replyOf<T>(response);
}
