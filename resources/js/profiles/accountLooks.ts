import type {
    AccountRowData,
    AccountStatus,
    CleanupProblem,
} from '@generated/types/accounts';

/**
 * How an account's state looks; keyed by the server's enum values, never by a translated label.
 */
export const accountStateLook: Record<
    AccountStatus,
    { label: string; tone: 'good' | 'warn' | 'danger' | 'busy' | 'quiet' }
> = {
    authenticated: { label: 'Signed in', tone: 'good' },
    unauthenticated: { label: 'Needs sign-in', tone: 'warn' },
    removing: { label: 'Removing', tone: 'busy' },
    removed: { label: 'Removed', tone: 'quiet' },
};

/**
 * How a saved account's state looks: Checking while a renewal that did not finish waits for the host's check,
 * Verification pending once that check could not tell, else its state.
 */
export function rowStateLook(
    account: AccountRowData,
): (typeof accountStateLook)[AccountStatus] {
    if (account.isCheckInconclusive) {
        return { label: 'Verification pending', tone: 'warn' };
    }

    return account.isHeldForCheck
        ? { label: 'Checking', tone: 'busy' }
        : accountStateLook[account.state];
}

/**
 * Why a cleanup has not finished, in words safe to show; the driver's own output is never shown.
 */
export const cleanupProblemText: Record<CleanupProblem, string> = {
    sign_in_not_verified: 'Unable to verify the sign-in was removed.',
    still_bound:
        'A running session still uses the old sign-in; it is removed when that session ends.',
    folder_not_deleted:
        'The sign-in was removed, but its folder could not be deleted.',
};

/**
 * The words on the button that brings back an account that must sign in again: a key is replaced, a sign-in redone.
 */
export function signInAgainLabel(account: {
    signIn: { method: string };
}): string {
    return account.signIn.method === 'api_key'
        ? 'Replace key'
        : 'Sign in again';
}
