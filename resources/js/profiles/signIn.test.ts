import { describe, expect, it, vi } from 'vitest';

vi.mock('@generated/routes/accounts', () => ({
    challenge: ({ attempt }: { attempt: string }) => ({
        url: `/accounts/sign-ins/${attempt}/challenge`,
    }),
}));
vi.mock('@kit/xsrfToken', () => ({ xsrfToken: () => 'token' }));

const { attemptToRejoin, codeDirection, isLive } = await import('./signIn');

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
    it('asks a Claude Code sign-in for a code back and gives a Codex one a code to enter', () => {
        expect(codeDirection('claude-code')).toBe('paste-back');
        expect(codeDirection('codex')).toBe('outgoing');
    });
});

describe('attemptToRejoin', () => {
    it('rejoins the running sign-in of the same driver and account only', () => {
        const attempts = [
            attempt({ id: 'ended', state: 'failed' }),
            attempt({ id: 'other-account', accountId: 'acc-1' }),
            attempt({ id: 'running' }),
        ];

        expect(attemptToRejoin(attempts, 'claude-code', null)?.id).toBe(
            'running',
        );
        expect(attemptToRejoin(attempts, 'claude-code', 'acc-1')?.id).toBe(
            'other-account',
        );
        expect(attemptToRejoin(attempts, 'codex', null)).toBeUndefined();
        expect(isLive(attempt({ state: 'complete' }))).toBe(false);
    });
});
