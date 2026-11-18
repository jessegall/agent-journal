import { reactive } from 'vue';

/**
 * Unsent message text per user and conversation, so leaving and coming back to a conversation, or reloading the page,
 * keeps what was typed. Each conversation has its own draft. The drafts live in this tab's session storage; when the
 * browser refuses storage they still last for as long as the page stays open.
 */
const storageKey = 'journal.message-drafts';
const drafts = reactive(new Map<string, string>(storedDrafts()));

// One submission key per draft: the same key while the draft is unchanged, so a resend after a lost answer is the
// same message; a new key once a sent draft is cleared.
const submissionKeys = new Map<string, string>();

function storedDrafts(): [string, string][] {
    try {
        const stored: unknown = JSON.parse(
            sessionStorage.getItem(storageKey) ?? '[]',
        );

        return Array.isArray(stored) ? (stored as [string, string][]) : [];
    } catch {
        return [];
    }
}

function store(): void {
    try {
        sessionStorage.setItem(storageKey, JSON.stringify([...drafts]));
    } catch {
        // Without storage the drafts stay in memory only.
    }
}

export function draftKey(userId: string, conversationId: string): string {
    return `${userId}/${conversationId}`;
}

export function useMessageDrafts() {
    function read(key: string): string {
        return drafts.get(key) ?? '';
    }

    function write(key: string, body: string): void {
        // Changed text is a different message, so it gets a new key when it is sent.
        if (drafts.get(key) !== body) {
            submissionKeys.delete(key);
        }

        if (body === '') {
            drafts.delete(key);
        } else {
            drafts.set(key, body);
        }

        store();
    }

    function submissionKey(key: string): string {
        let submission = submissionKeys.get(key);

        if (submission === undefined) {
            submission = crypto.randomUUID();
            submissionKeys.set(key, submission);
        }

        return submission;
    }

    /**
     * Forgets a sent draft, but only while it still holds the text that was sent: text typed after sending stays.
     */
    function clearSent(key: string, sentBody: string): void {
        if (drafts.get(key) === sentBody) {
            drafts.delete(key);
            submissionKeys.delete(key);
            store();
        }
    }

    return { read, write, submissionKey, clearSent };
}
