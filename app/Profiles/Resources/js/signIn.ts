import type { SignInAttemptData } from '@generated/types/accounts';
import { challenge } from '@generated/routes/accounts';
import { xsrfToken } from '@kit/xsrfToken';

/**
 * Which way a sign-in's code travels: Claude Code shows an address and asks for the code the provider's page gives
 * back; Codex shows the user a code to enter on the provider's page and takes nothing back.
 */
export type CodeDirection = 'paste-back' | 'outgoing';

export type SignInChallenge = { address: string | null; code: string | null };

export function codeDirection(program: string): CodeDirection {
    return program === 'codex' ? 'outgoing' : 'paste-back';
}

const liveStates = ['starting', 'waiting', 'checking'];

export function isLive(attempt: SignInAttemptData): boolean {
    return liveStates.includes(attempt.state);
}

/**
 * The running sign-in a reopened form rejoins: a new account's for the program, or the given account's.
 */
export function attemptToRejoin(
    attempts: SignInAttemptData[],
    program: string,
    accountId: string | null,
): SignInAttemptData | undefined {
    return attempts.find(
        (attempt) =>
            isLive(attempt) &&
            attempt.program === program &&
            attempt.accountId === accountId,
    );
}

/**
 * Reads the sign-in's challenge over its own no-store request; it is never part of the page.
 */
export async function readChallenge(
    attemptId: string,
): Promise<SignInChallenge> {
    const response = await fetch(challenge({ attempt: attemptId }).url, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
        },
    });

    if (!response.ok) {
        return { address: null, code: null };
    }

    return (await response.json()) as SignInChallenge;
}
