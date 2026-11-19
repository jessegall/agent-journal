import type { AccountState, CleanupProblem } from '@generated/types/accounts';

/**
 * How an account's state looks; keyed by the server's enum values, never by a translated label.
 */
export const accountStateLook: Record<
    AccountState,
    { label: string; tone: 'good' | 'warn' | 'danger' | 'busy' | 'quiet' }
> = {
    signed_in: { label: 'Signed in', tone: 'good' },
    needs_sign_in: { label: 'Needs sign-in', tone: 'warn' },
    removing: { label: 'Removing', tone: 'busy' },
    removed: { label: 'Removed', tone: 'quiet' },
};

/**
 * The name a program goes by on the page.
 */
export function programName(program: string): string {
    return { 'claude-code': 'Claude Code', codex: 'Codex' }[program] ?? program;
}

/**
 * Why a cleanup has not finished, in words safe to show; the program's own output is never shown.
 */
export const cleanupProblemText: Record<CleanupProblem, string> = {
    sign_in_not_verified: 'Unable to verify the sign-in was removed.',
    folder_not_deleted: 'The sign-in was removed, but its folder could not be deleted.',
};
