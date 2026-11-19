import { router } from '@inertiajs/vue3';

/**
 * Asks the owner why, then posts one recovery action of the runtime status page; nothing is sent without a reason.
 * The page shows the refusal or the new state when the server answers.
 */
export function recover(path: string, body: Record<string, unknown>, question: string): void {
    const reason = window.prompt(question)?.trim();

    if (!reason) {
        return;
    }

    router.post(`/web/runtimes/${path}`, { ...body, reason }, {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        preserveScroll: true,
    });
}
