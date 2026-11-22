import type { FormDataConvertible, VisitOptions } from '@inertiajs/core';
import { router } from '@inertiajs/vue3';

/**
 * Why reading a prop failed: the server answered with this status, or with null the answer never arrived.
 */
export class PropReadFailed extends Error {
    constructor(public readonly status: number | null) {
        super(status === null ? 'The read did not arrive.' : `The read was answered with ${status}.`);
    }
}

/**
 * The prop a page read declared on the server (ActionRoute::get) is sent as, by its route name, such as chat.events.
 */
export function pageReadProp(routeName: string): string {
    return `read_${routeName.replace(/[.-]/g, '_')}`;
}

/**
 * Runs one visit that reloads only the prop, without holding up or replacing anything else on the page, and settles
 * with what the server answered for it, or fails with PropReadFailed.
 */
export function reloadProp<T>(prop: string, visit: (options: VisitOptions) => void): Promise<T> {
    return new Promise((resolve, reject) => {
        visit({
            only: [prop],
            async: true,
            preserveState: true,
            preserveScroll: true,
            preserveUrl: true,
            onSuccess: (page) => resolve(page.props[prop] as T),
            onError: () => reject(new PropReadFailed(422)),
            onHttpException: (response) => {
                reject(new PropReadFailed(response.status));

                return false;
            },
            onNetworkError: () => {
                reject(new PropReadFailed(null));

                return false;
            },
            onCancel: () => reject(new PropReadFailed(null)),
        });
    });
}

/**
 * Reads a page read's answer for its own query by a partial reload of its prop alone.
 */
export function readPage<T>(routeName: string, query: Record<string, FormDataConvertible>): Promise<T> {
    const prop = pageReadProp(routeName);

    return reloadProp<T>(prop, (options) => router.reload({ ...options, data: { read: { [prop]: query } } }));
}
