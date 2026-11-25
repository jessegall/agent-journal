import type {
    SignInAttemptData,
    SignInMethod,
    SignInReceiptData,
} from '@generated/types/accounts';
import type { SignInCodeDirection } from '@/types/generated';
import { challenge } from '@generated/routes/accounts';
import type { DriverLook } from '@kit/appContext';
import { accountsSignInReceipt, load } from '@kit/loaders';
import { xsrfToken } from '@kit/xsrfToken';

export type SignInChallenge = { address: string | null; code: string | null };

/**
 * What the wizard is opened for: a new account, a running sign-in it rejoins, or a saved account signed in again.
 */
export type WizardRequest =
    | { kind: 'new' }
    | { kind: 'resume'; attemptId: string }
    | { kind: 'again'; driver: string; accountId: string }
    // An agent's draft: the driver and the way to sign in chosen, and the name the new account takes.
    | { kind: 'drafted'; driver: string; method: SignInMethod; name: string };

const SIGN_IN_METHODS: readonly SignInMethod[] = ['oauth', 'provider_token', 'api_key'];

/**
 * A draft named a sign-in method the journal does not have.
 */
export class SignInMethodUnknown extends Error {
    static named(word: string): SignInMethodUnknown {
        return new SignInMethodUnknown(`No sign-in method is called ${word}.`);
    }
}

/**
 * The sign-in method a draft names; a word that is no method is a fault of the draft, never a default.
 */
export function signInMethodOf(word: string): SignInMethod {
    const method = SIGN_IN_METHODS.find((each) => each === word);

    if (method === undefined) {
        throw SignInMethodUnknown.named(word);
    }

    return method;
}

/**
 * Which way a sign-in's code travels, as the driver's family declares it: an address and the code its page gives
 * back, or a code the user enters on the provider's page; a driver no family declares has neither.
 */
export function codeDirection(shown: DriverLook): SignInCodeDirection | undefined {
    return shown.type === 'declared' ? shown.look.signInCode : undefined;
}

const liveStates = ['starting', 'waiting', 'checking'];

export function isLive(attempt: SignInAttemptData): boolean {
    return liveStates.includes(attempt.state);
}

/**
 * The running sign-in a reopened form rejoins: a new account's for the driver, or the given account's.
 */
export function rejoinableAttempt(
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
 * What a challenge read came to: the challenge, a refusal because the reader may no longer see the sign-in, or a
 * failure to reach the journal at all.
 */
export type ChallengeRead =
    | { status: 'read'; challenge: SignInChallenge }
    | { status: 'denied' }
    | { status: 'failed' };

/**
 * Reads the sign-in's challenge over its own no-store request; it is never part of the page, so no page prop and no
 * browser history entry ever holds it.
 */
export async function readChallenge(attemptId: string): Promise<ChallengeRead> {
    const response = await fetch(challenge({ attempt: attemptId }).url, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken(),
        },
    }).catch(() => null);

    if (response === null) {
        return { status: 'failed' };
    }

    if ([401, 403, 404, 419].includes(response.status)) {
        return { status: 'denied' };
    }

    if (!response.ok) {
        return { status: 'failed' };
    }

    return {
        status: 'read',
        challenge: (await response.json()) as SignInChallenge,
    };
}

/**
 * What a start's receipt is read for: a new account of a driver, or an account signed in again.
 */
export type ReceiptTarget = { driver: string } | { account: string };

/**
 * What became of a sign-in start under its request key; nothing when the read itself failed, so the caller asks
 * again.
 */
export async function readReceipt(key: string, target: ReceiptTarget): Promise<SignInReceiptData | null> {
    const answer = await load(accountsSignInReceipt, { key, ...target }).catch(() => null);

    return answer?.status === 'ok' ? answer.value : null;
}

/**
 * The words a finished sign-in ends with: a new account is added, a renewal says what it renewed by its method.
 */
export function completedTitle(attempt: SignInAttemptData): string {
    if (attempt.type === 'new_account') {
        return 'Account added';
    }

    return {
        oauth: 'Account reconnected',
        provider_token: 'Token replaced',
        api_key: 'Key replaced',
    }[attempt.method];
}

/**
 * The button that sends a token or key: Add account for a new account, Replace token or Replace key for a renewal.
 */
export function secretSubmitLabel(
    attempt: SignInAttemptData | undefined,
): string {
    if (attempt?.type !== 'sign_in_again') {
        return 'Add account';
    }

    return attempt.method === 'api_key' ? 'Replace key' : 'Replace token';
}
