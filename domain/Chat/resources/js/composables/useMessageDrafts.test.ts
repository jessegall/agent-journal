// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The drafts module as a fresh page load reads it, from what this tab's session storage holds now.
 */
async function freshLoad() {
    vi.resetModules();
    const { draftKey, useMessageDrafts } = await import('./useMessageDrafts');

    return { key: draftKey('user-1', 'agent-1'), drafts: useMessageDrafts() };
}

/**
 * Sends the draft as the composer does: keep its recovery entry, then clear the draft.
 */
function send(drafts: Awaited<ReturnType<typeof freshLoad>>['drafts'], key: string, intentKey: string): void {
    const text = drafts.read(key);
    drafts.recordRecovery({ intentKey, draftKey: key, text, replyToId: null });
    drafts.clearSent(key, text);
}

describe('useMessageDrafts recovery', () => {
    beforeEach(() => window.sessionStorage.clear());

    it('puts a refused send back only while the draft is untouched since it was sent', async () => {
        const { key, drafts } = await freshLoad();
        drafts.write(key, 'First words');
        send(drafts, key, 'intent-1');

        expect(drafts.restoreOrOffer('intent-1')).toBe('restored');
        expect(drafts.read(key)).toBe('First words');

        send(drafts, key, 'intent-2');
        drafts.write(key, 'Newer words');
        expect(drafts.restoreOrOffer('intent-2')).toBe('offered');
        expect(drafts.read(key)).toBe('Newer words');
    });

    it('offers two refusals answered in reverse order separately and keeps the current draft', async () => {
        const { key, drafts } = await freshLoad();
        drafts.write(key, 'One');
        send(drafts, key, 'intent-1');
        drafts.write(key, 'Two');
        send(drafts, key, 'intent-2');
        drafts.write(key, 'Now typing');

        expect(drafts.restoreOrOffer('intent-2')).toBe('offered');
        expect(drafts.restoreOrOffer('intent-1')).toBe('offered');
        expect(drafts.recoveryEntries(key).map((entry) => entry.text)).toEqual(['One', 'Two']);
        expect(drafts.read(key)).toBe('Now typing');
    });

    it('forgets an entry older than a day on load, and a discard stays discarded across a reload', async () => {
        const first = await freshLoad();
        first.drafts.write(first.key, 'Kept');
        send(first.drafts, first.key, 'intent-kept');
        first.drafts.write(first.key, 'Discarded');
        send(first.drafts, first.key, 'intent-discarded');
        first.drafts.discard('intent-discarded');
        const stored = JSON.parse(window.sessionStorage.getItem('journal.message-recovery') ?? '[]') as [string, { keptAt: number }][];
        stored.push(['intent-old', { ...stored[0][1], keptAt: Date.now() - 25 * 60 * 60 * 1000 }]);
        window.sessionStorage.setItem('journal.message-recovery', JSON.stringify(stored));

        const reloaded = await freshLoad();

        expect(reloaded.drafts.recoveryEntries(reloaded.key).map((entry) => entry.intentKey)).toEqual(['intent-kept']);
    });

    it('shows none of the previous user drafts after they are purged on a user change', async () => {
        const { key, drafts } = await freshLoad();
        drafts.write(key, 'Private draft');
        send(drafts, key, 'intent-1');
        drafts.write(key, 'Still typing');

        drafts.purgeUser('user-1');
        const reloaded = await freshLoad();

        expect(reloaded.drafts.read(key)).toBe('');
        expect(reloaded.drafts.recoveryEntries(key)).toEqual([]);
    });
});
