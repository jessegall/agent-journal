import type { ChatEventData, ChatMessageData } from '@generated/types/chat';

/**
 * One view's own copy of a chat's rows: every row it was given, merged by message id, and the last timeline position
 * it holds without a gap. A row past that position waits until the range before it arrives, so a view that receives
 * 12 before 11 shows 11 and then 12, each once. Older pages merge in by id, so paging back past the first page shows
 * every row once.
 */
export type ChatTimeline = {
    /** The rows shown, oldest first: those at or before the contiguous position. */
    shown(): ChatMessageData[];
    /** The last timeline position this view holds without a gap. */
    through(): number;
    /** Whether rows wait past a gap. */
    hasGap(): boolean;
    /** The cursor of the page before the oldest row held, or null at the start of the chat. */
    olderCursor(): string | null;
    /** Takes a page that covers every visible row from its first row up to the given position. */
    offerPage(rows: ChatMessageData[], through: number, reachesStart: boolean): void;
    /** The message ids among these events whose rows this view does not hold yet. */
    missingOf(events: ChatEventData[]): string[];
    /** Moves the contiguous position to the end of a verified range whose rows are all held. */
    advance(through: number): void;
    /** Merges rows read to fill a gap, without moving the contiguous position. */
    offerRows(rows: ChatMessageData[]): void;
    /** Merges an older page and keeps its cursor. */
    offerOlder(rows: ChatMessageData[], olderCursor: string | null): void;
    /** Starts again from a fresh snapshot at its watermark. */
    restart(rows: ChatMessageData[], through: number, olderCursor: string | null): void;
};

export function chatTimeline(rows: ChatMessageData[], through: number, olderCursor: string | null): ChatTimeline {
    const held = new Map<string, ChatMessageData>();
    let contiguous = 0;
    let cursor = olderCursor;

    function merge(incoming: ChatMessageData[]): void {
        incoming.forEach((row) => {
            const known = held.get(row.id);

            if (known === undefined || known.stateVersion <= row.stateVersion) {
                held.set(row.id, row);
            }
        });
    }

    function ordered(): ChatMessageData[] {
        return [...held.values()].sort((first, second) => first.sequence - second.sequence);
    }

    function restart(fresh: ChatMessageData[], freshThrough: number, freshCursor: string | null): void {
        held.clear();
        merge(fresh);
        contiguous = freshThrough;
        cursor = freshCursor;
    }

    restart(rows, through, olderCursor);

    return {
        shown: () => ordered().filter((row) => row.sequence <= contiguous),
        through: () => contiguous,
        hasGap: () => ordered().some((row) => row.sequence > contiguous),
        olderCursor: () => cursor,
        offerPage(page, pageThrough, reachesStart) {
            merge(page);
            const first = page.length === 0 ? pageThrough : page[0].sequence;
            const joins = reachesStart || first <= contiguous + 1;

            if (joins) {
                contiguous = Math.max(contiguous, pageThrough);
            }
        },
        missingOf: (events) =>
            events.flatMap((event) => (event.messageId === null || held.has(event.messageId) ? [] : [event.messageId])),
        advance(verifiedThrough) {
            contiguous = Math.max(contiguous, verifiedThrough);
        },
        offerRows: merge,
        offerOlder(older, olderPageCursor) {
            merge(older);
            cursor = olderPageCursor;
        },
        restart,
    };
}
