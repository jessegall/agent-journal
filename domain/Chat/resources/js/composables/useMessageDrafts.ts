import { reactive } from 'vue';
import { isStorageAvailable, keepStoredJson, readStoredJson } from '@kit/browserStorage';

/**
 * Unsent message text per user and chat inbox, so browsing other chats, a switch to another driver or reloading the
 * page keeps what was typed. Each chat has its own draft. The drafts live in this tab's session storage; when the
 * browser refuses storage they still last for as long as the page stays open.
 *
 * A send or reply the server refused, or whose answer never came, is kept as a recovery entry beside the drafts: its
 * text and reply target under its request key, for one day. It goes back into the composer only while the draft is
 * exactly as the send left it; otherwise it is offered on its own, so newer typing is never overwritten.
 */
const storageKey = 'journal.message-drafts';
const recoveryKey = 'journal.message-recovery';
const RECOVERY_LIFETIME_MS = 24 * 60 * 60 * 1000;

/**
 * One send or reply to recover: under its request key, in its draft's scope (user and chat inbox), the text and the
 * message it replied to, the draft generation it left behind when it cleared the draft, and when it was kept.
 */
export type RecoveryEntry = {
    intentKey: string;
    draftKey: string;
    text: string;
    replyToId: string | null;
    generation: number;
    keptAt: number;
};

const drafts = reactive(new Map<string, string>(storedDrafts()));
const recoveries = reactive(new Map<string, RecoveryEntry>(storedRecoveries()));

/**
 * How many times each draft changed in this tab; a recovery restores only into the generation it left behind.
 */
const generations = reactive(new Map<string, number>());

function storedDrafts(): [string, string][] {
    const stored = readStoredJson('session', storageKey, (decoded) =>
        Array.isArray(decoded) ? (decoded as [string, string][]) : null,
    );

    return stored ?? [];
}

function storedRecoveries(): [string, RecoveryEntry][] {
    const stored = readStoredJson('session', recoveryKey, (decoded) =>
        Array.isArray(decoded) ? (decoded as [string, RecoveryEntry][]) : null,
    );
    const cutoff = Date.now() - RECOVERY_LIFETIME_MS;

    return (stored ?? []).filter(([, entry]) => entry.keptAt >= cutoff);
}

function store(): void {
    keepStoredJson('session', storageKey, [...drafts]);
}

function storeRecoveries(): void {
    keepStoredJson('session', recoveryKey, [...recoveries]);
}

function generationOf(key: string): number {
    return generations.get(key) ?? 0;
}

/**
 * The scope of one draft: the viewer and the chat inbox it writes in.
 */
export function draftKey(userId: string, inboxId: string): string {
    return `${userId}/${inboxId}`;
}

export function useMessageDrafts() {
    function read(key: string): string {
        return drafts.get(key) ?? '';
    }

    function write(key: string, body: string): void {
        if ((drafts.get(key) ?? '') !== body) {
            generations.set(key, generationOf(key) + 1);
        }

        if (body === '') {
            drafts.delete(key);
        } else {
            drafts.set(key, body);
        }

        store();
    }

    /**
     * Forgets a sent draft, but only while it still holds the text that was sent: text typed after sending stays.
     */
    function clearSent(key: string, sentBody: string): void {
        if (drafts.get(key) === sentBody) {
            write(key, '');
        }
    }

    function editGeneration(key: string): number {
        return generationOf(key);
    }

    /**
     * Keeps a send before its draft is cleared, under the generation clearing the draft leads to.
     */
    function recordRecovery(intent: { intentKey: string; draftKey: string; text: string; replyToId: string | null }): void {
        const generation = generationOf(intent.draftKey) + ((drafts.get(intent.draftKey) ?? '') === '' ? 0 : 1);
        recoveries.set(intent.intentKey, { ...intent, generation, keptAt: Date.now() });
        storeRecoveries();
    }

    /**
     * Puts a refused send back into its composer when the draft is untouched since the send cleared it, and answers
     * restored; otherwise it stays to be offered on its own, and the answer is offered.
     */
    function restoreOrOffer(intentKey: string): 'restored' | 'offered' {
        const entry = recoveries.get(intentKey);

        if (entry === undefined || generationOf(entry.draftKey) !== entry.generation || read(entry.draftKey) !== '') {
            return 'offered';
        }

        write(entry.draftKey, entry.text);
        forget(intentKey);

        return 'restored';
    }

    function discard(intentKey: string): void {
        forget(intentKey);
    }

    /**
     * The send went through: nothing is left to recover.
     */
    function confirm(intentKey: string): void {
        forget(intentKey);
    }

    function forget(intentKey: string): void {
        recoveries.delete(intentKey);
        storeRecoveries();
    }

    /**
     * Removes the draft and the recovery entries of one user's conversation with an agent.
     */
    function purgeScope(userId: string, agentId: string): void {
        removeWhere((key) => key === draftKey(userId, agentId));
    }

    /**
     * Removes every draft and recovery entry of the user, on sign-out or a denial.
     */
    function purgeUser(userId: string): void {
        removeWhere((key) => key.startsWith(`${userId}/`));
    }

    function removeWhere(isPurged: (key: string) => boolean): void {
        [...drafts.keys()].filter(isPurged).forEach((key) => drafts.delete(key));
        [...recoveries.entries()]
            .filter(([, entry]) => isPurged(entry.draftKey))
            .forEach(([intentKey]) => recoveries.delete(intentKey));
        store();
        storeRecoveries();
    }

    /**
     * The sends still to recover in one conversation, oldest first.
     */
    function recoveryEntries(key: string): RecoveryEntry[] {
        return [...recoveries.values()]
            .filter((entry) => entry.draftKey === key)
            .sort((first, second) => first.keptAt - second.keptAt);
    }

    return {
        read,
        write,
        clearSent,
        editGeneration,
        recordRecovery,
        restoreOrOffer,
        discard,
        confirm,
        purgeScope,
        purgeUser,
        recoveryEntries,
        storageAvailable: isStorageAvailable('session'),
    };
}
