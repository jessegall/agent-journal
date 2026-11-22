import { keepStoredJson, readStoredJson } from './browserStorage';

/**
 * How long a tab's claim to present new outcomes holds without being renewed.
 */
const LEASE_MILLISECONDS = 10_000;

type Lease = { tabId: string; expiresAt: number };

const tabId = Math.random().toString(36).slice(2);

function keyOf(userId: string): string {
    return `notifications-presenter:${userId}`;
}

function readLease(userId: string): Lease | null {
    return readStoredJson('local', keyOf(userId), (decoded) => {
        const lease = decoded as Partial<Lease> | null;

        return typeof lease?.tabId === 'string' && typeof lease.expiresAt === 'number'
            ? { tabId: lease.tabId, expiresAt: lease.expiresAt }
            : null;
    });
}

/**
 * Whether this tab may present new outcomes for the user now: a focused, visible tab takes or renews the shared
 * claim, and every other tab defers to a claim still held. Only the claim's tab id and expiry are shared, never rows.
 */
export function holdsPresentation(userId: string, now: number = Date.now()): boolean {
    const held = readLease(userId);
    const isForeground = document.visibilityState === 'visible' && document.hasFocus();

    if (isForeground) {
        keepStoredJson('local', keyOf(userId), { tabId, expiresAt: now + LEASE_MILLISECONDS });

        return true;
    }

    return held?.tabId === tabId && held.expiresAt > now;
}
