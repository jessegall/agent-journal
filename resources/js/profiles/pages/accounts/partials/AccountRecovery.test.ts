// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { PendingAttemptCleanupData } from '@generated/types/accounts';

vi.mock('@inertiajs/vue3', () => ({
    useForm: () => ({ submit: vi.fn(), processing: false }),
}));
vi.mock('@generated/routes/accounts', () => ({
    retrySignInCleanup: ({ attempt }: { attempt: string }) => ({
        url: `/accounts/sign-ins/${attempt}/cleanup/retry`,
        method: 'post',
    }),
}));
vi.mock('@kit/usePageChanges', () => ({ formSendingHooks: () => ({}) }));

const { default: AccountRecovery } = await import('./AccountRecovery.vue');

function cleanup(
    fields: Partial<PendingAttemptCleanupData>,
): PendingAttemptCleanupData {
    return {
        attemptId: 'attempt-1',
        driver: 'claude-code',
        problem: null,
        lastTriedAt: null,
        awaitsRetry: false,
        ...fields,
    };
}

describe('AccountRecovery', () => {
    it('shows a displaced folder still in use without Retry, and Retry only once the tries ran out', () => {
        const bound = mount(AccountRecovery, {
            props: { cleanups: [cleanup({ problem: 'still_bound' })] },
        });
        expect(bound.text()).toContain('Unfinished sign-ins');
        expect(bound.text()).toContain(
            'A running session still uses the old sign-in',
        );
        expect(bound.text()).not.toContain('Retry cleanup');

        const stuck = mount(AccountRecovery, {
            props: {
                cleanups: [
                    cleanup({
                        problem: 'folder_not_deleted',
                        awaitsRetry: true,
                    }),
                ],
            },
        });
        expect(stuck.text()).toContain('Retry cleanup');

        const done = mount(AccountRecovery, { props: { cleanups: [] } });
        expect(done.text()).not.toContain('Unfinished sign-ins');
    });
});
