import { reactive } from 'vue';
import { keepStoredJson, readStoredJson } from '@kit/browserStorage';

/**
 * Unsent message text per user and agent, so browsing other agents, a switch to another driver or reloading the page
 * keeps what was typed. Each agent has its own draft. The drafts live in this tab's session storage; when the
 * browser refuses storage they still last for as long as the page stays open.
 */
const storageKey = 'journal.message-drafts';
const drafts = reactive(new Map<string, string>(storedDrafts()));

function storedDrafts(): [string, string][] {
    const stored = readStoredJson('session', storageKey, (decoded) =>
        Array.isArray(decoded) ? (decoded as [string, string][]) : null,
    );

    return stored ?? [];
}

function store(): void {
    keepStoredJson('session', storageKey, [...drafts]);
}

export function draftKey(userId: string, agentId: string): string {
    return `${userId}/${agentId}`;
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
