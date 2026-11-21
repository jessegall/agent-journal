import type {
    SignInAttemptData,
    SignInReceiptData,
} from '@generated/types/accounts';
import { challenge, signInReceipt } from '@generated/routes/accounts';
import { xsrfToken } from '@kit/xsrfToken';

/**
 * Which way a sign-in's code travels: Claude Code shows an address and asks for the code the provider's page gives
 * back; Codex shows the user a code to enter on the provider's page and takes nothing back.
 */
export type CodeDirection = 'paste-back' | 'outgoing';

export type SignInChallenge = { address: string | null; code: string | null };

/**
 * What the wizard is opened for: a new account, a running sign-in it rejoins, or a saved account signed in again.
 */
export type WizardRequest =
    | { kind: 'new' }
    | { kind: 'resume'; attemptId: string }
    | { kind: 'again'; driver: string; accountId: string };

export function codeDirection(driver: string): CodeDirection {
    return driver === 'codex' ? 'outgoing' : 'paste-back';
}

const liveStates = ['starting', 'waiting', 'checking'];

export function isLive(attempt: SignInAttemptData): boolean {
    return liveStates.includes(attempt.state);
}

/**
 * The running sign-in a reopened form rejoins: a new account's for the driver, or the given account's.
 */
export function attemptToRejoin(
    attempts: SignInAttemptData[],
    driver: string,
    accountId: string | null,
): SignInAttemptData | undefined {
    return attempts.find(
        (attempt) =>
            isLive(attempt) &&
            attempt.driver === driver &&
            attempt.accountId === accountId,
    );
}

/**
 * The newest ended sign-in a form reports on: a new account's for the driver, or the given account's.
 */
export function lastEndedAttempt(
    attempts: SignInAttemptData[],
    driver: string,
    accountId: string | null,
): SignInAttemptData | undefined {
    return attempts
        .filter(
            (attempt) =>
                !isLive(attempt) &&
                attempt.driver === driver &&
                attempt.accountId === accountId,
        )
        .sort((first, second) =>
            second.expiresAt.localeCompare(first.expiresAt),
        )[0];
}

const endedMessages: Record<string, string> = {
    already_added: 'This account is already added.',
    unverified:
        'Could not verify this account. The saved login is unchanged; you can add it as a separate account.',
    different_account:
        'That sign-in was for a different account. The saved login is unchanged; you can add it as a new account.',
    failed: 'The sign-in did not finish.',
    expired: 'The sign-in took too long and was stopped.',
    interrupted:
        'The sign-in stopped before your answer reached it, so it was not used. Start a fresh sign-in.',
    cancelled: 'The sign-in was cancelled.',
};

/**
 * What a form says about a sign-in that ended without adding or renewing an account, with the provider's own reason
 * when it refused the proof; nothing for one that did.
 */
export function endedMessage(attempt: SignInAttemptData): string | null {
    if (
        (attempt.state === 'failed' || attempt.state === 'interrupted') &&
        attempt.refusal !== null
    ) {
        return attempt.refusal;
    }

    return endedMessages[attempt.state] ?? null;
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

/**
 * What became of a sign-in start under its request key, for a new account of the driver; nothing when the read itself
 * failed, so the caller asks again.
 */
export async function readReceipt(
    key: string,
    driver: string,
): Promise<SignInReceiptData | null> {
    const response = await fetch(
        signInReceipt({ query: { key, driver } }).url,
        {
            credentials: 'same-origin',
            cache: 'no-store',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
        },
    );

    return response.ok ? ((await response.json()) as SignInReceiptData) : null;
}
