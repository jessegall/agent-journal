import type { RequestPayload, VisitOptions } from '@inertiajs/core';
import { router } from '@inertiajs/vue3';
import type { RouteDefinition } from '@/wayfinder';
import { formSendingHooks } from '@kit/usePageChanges';

/**
 * The methods a page action changes something with.
 */
export type PageActionMethod = 'post' | 'put' | 'patch' | 'delete';

/**
 * What a page action may add to its visit: the props it changes, which reload alone (none reads the whole page
 * again), and its own hooks.
 */
export type PageActionOptions = Omit<
    VisitOptions,
    'method' | 'data' | 'preserveScroll' | 'preserveState' | 'only'
> & { only: string[] };

/**
 * Sends a change from a page and stays on it: the controller answers with a redirect back and its flash (a notice the
 * shell's toast region shows, or the id of what it made), Inertia maps a refusal to the page's errors, and only the
 * props named reload, with the scroll and the open state kept. A change that arrives meanwhile is read after.
 */
export function sendPageAction(
    route: RouteDefinition<PageActionMethod>,
    data: RequestPayload,
    options: PageActionOptions,
): void {
    const sending = formSendingHooks();

    router.visit(route.url, {
        ...options,
        method: route.method,
        data,
        preserveScroll: true,
        preserveState: true,
        onStart: (visit) => {
            sending.onStart();
            options.onStart?.(visit);
        },
        onFinish: (visit) => {
            sending.onFinish();
            options.onFinish?.(visit);
        },
    });
}
