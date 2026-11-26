import type { Page, VisitOptions } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/vue3';

/**
 * The header that names the loader a call reads; a visit that carries it is a loader call, never a page read.
 */
export const LOADER_HEADER = 'X-Journal-Loader';

/**
 * A loader the server declares: its key, which the call names in its header, and the prop its answer comes back
 * under; the input and answer types ride along for the type checker only.
 */
export type Loader<I, O> = { readonly key: string; readonly prop: string; readonly input?: I; readonly answer?: O };

/**
 * How one loader call was answered: its value, the message of each invalid field, or unavailable, the same whatever the
 * reason.
 */
export type LoaderAnswer<O> =
    | { status: 'ok'; value: O }
    | { status: 'invalid'; errors: Record<string, string> }
    | { status: 'unavailable' };

/**
 * A loader call that got no answer: the server answered with this status, or with null the answer never arrived.
 */
export class LoaderFailed extends Error {
    constructor(public readonly status: number | null) {
        super(status === null ? 'The loader answer did not arrive.' : `The loader was answered with ${status}.`);
    }
}

/**
 * A loader call cancelled before it was answered, such as by leaving the page; a component leaves it unshown.
 */
export class LoaderCancelled extends Error {
    constructor() {
        super('The loader call was cancelled.');
    }
}

const FAILURE = 'loaderFailure';

type Reply = {
    token: string;
    status: 'ok' | 'invalid' | 'unavailable';
    value?: unknown;
    errors?: Record<string, string>;
};

let callCount = 0;

/**
 * One loader call by a same-page partial reload of the loader's prop alone: nothing else on the page is held up,
 * replaced, scrolled or cleared, the form errors on the page included.
 */
export function load<I, O>(loader: Loader<I, O>, input: I): Promise<LoaderAnswer<O>> {
    return loadAfter(loader, input, (options) => router.reload(options));
}

/**
 * The same call riding on a write: send posts with the options, Inertia follows the write's redirect with the loader's
 * headers, and the answer settles from the page it lands on.
 */
export function loadAfter<I, O>(
    loader: Loader<I, O>,
    input: I,
    send: (options: VisitOptions) => void,
): Promise<LoaderAnswer<O>> {
    const token = nextToken();

    return new Promise((resolve, reject) => {
        const settle = (props: Page['props']) => {
            const answer = answerFor<O>(loader, token, props);
            router.replaceProp(loader.prop, undefined);
            router.replaceProp(FAILURE, undefined);

            if (answer === undefined) {
                reject(new LoaderFailed(null));
            } else {
                resolve(answer);
            }
        };

        send({
            only: [loader.prop, FAILURE],
            async: true,
            preserveState: true,
            preserveScroll: true,
            preserveUrl: true,
            preserveErrors: true,
            headers: { [LOADER_HEADER]: loader.key, 'X-Journal-Loader-Input': encodedCall(token, input) },
            onSuccess: (page) => settle(page.props),
            // The page's own form errors come back with the answer; the answer is read all the same.
            onError: () => settle(usePage().props),
            onHttpException: (response) => {
                reject(new LoaderFailed(response.status));

                return false;
            },
            onNetworkError: () => {
                reject(new LoaderFailed(null));

                return false;
            },
            onCancel: () => reject(new LoaderCancelled()),
        });
    });
}

/**
 * The answer a page carries for this call alone: under the loader's prop when it answered, under loaderFailure when it
 * did not; another call's answer, by its token, is none of this call's.
 */
function answerFor<O>(loader: Loader<unknown, O>, token: string, props: Page['props']): LoaderAnswer<O> | undefined {
    const answered = props[loader.prop] as Reply | undefined;
    const failed = props[FAILURE] as Reply | undefined;

    if (answered?.token === token) {
        return { status: 'ok', value: answered.value as O };
    }

    if (failed?.token !== token) {
        return undefined;
    }

    return failed.status === 'invalid' ? { status: 'invalid', errors: failed.errors ?? {} } : { status: 'unavailable' };
}

function nextToken(): string {
    callCount += 1;

    return `call-${callCount}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * The call's token and input as the server's LoaderInput reads them: base64url of their UTF-8 JSON.
 */
function encodedCall(token: string, input: unknown): string {
    const bytes = new TextEncoder().encode(JSON.stringify({ token, input }));
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
