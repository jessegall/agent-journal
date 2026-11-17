import { reactive } from 'vue';

/**
 * Unsent message text per viewer and conversation, so leaving and coming back to a conversation, or reloading the page,
 * keeps what was typed. Each conversation has its own draft. The drafts live in this tab's session storage; when the
 * browser refuses storage they still last for as long as the page stays open.
 */
const storageKey = 'journal.message-drafts';
const drafts = reactive(new Map<string, string>(storedDrafts()));

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

export function draftKey(viewerId: string, conversationId: string): string {
    return `${viewerId}/${conversationId}`;
}

export function useMessageDrafts() {
    function read(key: string): string {
        return drafts.get(key) ?? '';
    }

    function write(key: string, body: string): void {
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
            drafts.delete(key);
            store();
        }
    }

    return { read, write, clearSent };
}
