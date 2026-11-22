import { xsrfToken } from '@/echo';

/**
 * Why a JSON request failed: the server refused it with a code and message, or no answer came, so nothing is known.
 */
export class JsonRequestFailed extends Error {
    constructor(
        readonly kind: 'refused' | 'lost',
        readonly status: number,
        readonly code: string,
        message: string,
    ) {
        super(message);
    }
}

/**
 * Reads JSON from a route of the journal, with the session's cookies; an abort signal cancels it.
 */
export async function getJson<Answer>(url: string, signal?: AbortSignal): Promise<Answer> {
    return (await requestJson(url, { method: 'GET', signal })) as Answer;
}

/**
 * Posts JSON to a route of the journal and reads its answer; an answer with no content reads as null.
 */
export async function postJson<Answer>(url: string, body: object, signal?: AbortSignal): Promise<Answer | null> {
    return (await requestJson(url, { method: 'POST', body: JSON.stringify(body), signal })) as Answer | null;
}

async function requestJson(url: string, init: RequestInit): Promise<unknown> {
    let response: Response;

    try {
        response = await fetch(url, {
            credentials: 'same-origin',
            ...init,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': xsrfToken(),
            },
        });
    } catch (failure) {
        if (failure instanceof DOMException && failure.name === 'AbortError') {
            throw failure;
        }

        throw new JsonRequestFailed('lost', 0, '', 'No answer came from the journal.');
    }

    if (response.status >= 500) {
        throw new JsonRequestFailed('lost', response.status, '', 'The journal could not answer.');
    }

    if (!response.ok) {
        const refusal = (await response.json().catch(() => ({}))) as { code?: string; message?: string };

        throw new JsonRequestFailed(
            'refused',
            response.status,
            refusal.code ?? '',
            refusal.message ?? 'The journal refused the request.',
        );
    }

    if (response.status === 204) {
        return null;
    }

    return await response.json();
}
