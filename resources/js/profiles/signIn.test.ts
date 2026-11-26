import { describe, expect, it, vi } from 'vitest';
import { declaredLooks } from '@kit/testing/driverLooks';

vi.mock('@generated/routes/accounts', () => ({
    challenge: ({ attempt }: { attempt: string }) => ({
        url: `/accounts/sign-ins/${attempt}/challenge`,
    }),
}));
vi.mock('@kit/xsrfToken', () => ({ xsrfToken: () => 'token' }));

const { rejoinableAttempt, codeDirection, isLive } = await import('./signIn');

function attempt(fields: Record<string, unknown>) {
    return {
        id: 'a',
        driver: 'claude-code',
        type: 'new_account',
        label: 'Work',
        accountId: null,
        state: 'waiting',
        expiresAt: '2026-11-19T16:00:00+00:00',
        ...fields,
    } as never;
}

describe('codeDirection', () => {
    it('travels the way the family declares, and a driver no family declares has none', () => {
        expect(codeDirection({ type: 'declared', look: declaredLooks[0] })).toBe('paste-back');
        expect(codeDirection({ type: 'declared', look: declaredLooks[1] })).toBe('outgoing');
        expect(codeDirection({ type: 'unknown', label: 'removed-driver' })).toBeUndefined();
    });
});

describe('rejoinableAttempt', () => {
    it('rejoins the running sign-in of the same driver and account only', () => {
        const attempts = [
            attempt({ id: 'ended', status: 'failed' }),
            attempt({ id: 'other-account', accountId: 'acc-1' }),
            attempt({ id: 'running' }),
        ];

        expect(rejoinableAttempt(attempts, 'claude-code', null)?.id).toBe(
            'running',
        );
        expect(rejoinableAttempt(attempts, 'claude-code', 'acc-1')?.id).toBe(
            'other-account',
        );
        expect(rejoinableAttempt(attempts, 'codex', null)).toBeUndefined();
        expect(isLive(attempt({ state: 'complete' }))).toBe(false);
    });
});
