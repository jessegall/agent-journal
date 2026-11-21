import type { RequestPayload } from '@inertiajs/core';
import { router } from '@inertiajs/vue3';

/**
 * What became of a keyed post: the server took it, refused it with a reason, or never answered, so only a later read
 * of the page can tell.
 */
export type KeyedPostOutcome = {
    // The values the server flashed with its answer, such as the id of what it made.
    onAccepted: (flash: Record<string, unknown>) => void;
    onRefused: (reason: string | null) => void;
    onUncertain: () => void;
    onFinish?: () => void;
};

/**
 * Posts a change through Inertia once under its request key (sent as Idempotency-Key, so a repeat answers the first
 * time again), without an optimistic update and without holding the page's reads back, so changes other tabs make
 * keep arriving while it is out. A refusal comes back as the redirect's errors; a server failure or a lost answer is
 * uncertain, never sent again.
 */
export function keyedPost(
    url: string,
    data: RequestPayload,
    key: string,
    outcome: KeyedPostOutcome,
    only: string[] = [],
): void {
    router.post(url, data, {
        async: true,
        only,
        preserveState: true,
        preserveScroll: true,
        headers: { 'Idempotency-Key': key },
        onSuccess: (page) => outcome.onAccepted(page.flash),
        onError: (errors) => outcome.onRefused(Object.values(errors)[0] ?? null),
        onHttpException: () => {
            outcome.onUncertain();

            return false;
        },
        onNetworkError: () => {
            outcome.onUncertain();

            return false;
        },
        onFinish: () => outcome.onFinish?.(),
    });
}
