import { xsrfToken } from '@kit/xsrfToken';
import { events as eventsRoute, rows as rowsRoute } from '@generated/routes/chat';
import type { ChatEventsPageData, ChatMessageData, ChatRowsPageData, ConversationData } from '@generated/types/chat';
import { onChatAccessEnded } from '@kit/chatAccess';
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue';
import type { ComputedRef, Ref } from 'vue';
import { chatTimeline } from './chatTimeline';
import type { ChatTimeline } from './chatTimeline';

/**
 * The most events one read of the server answers; a full page means more wait after it.
 */
const EVENT_PAGE_LIMIT = 50;

/**
 * The most row pages read back to find the rows a range of events named.
 */
const GAP_PAGE_LIMIT = 4;

/**
 * Why a timeline read failed: the cursor no longer fits this membership, or the answer never arrived.
 */
export class ChatTimelineReadFailed extends Error {
    constructor(public readonly refused: boolean) {
        super(refused ? 'The chat refused this cursor.' : 'The chat read did not arrive.');
    }
}

/**
 * The server reads the timeline makes; each answers its page or throws ChatTimelineReadFailed.
 */
export type ChatTimelineClient = {
    events(inboxId: string, cursor: string | null): Promise<ChatEventsPageData>;
    rows(inboxId: string, olderCursor: string | null): Promise<ChatRowsPageData>;
};

async function readJson<Page>(url: string): Promise<Page> {
    let response: Response;

    try {
        response = await fetch(url, {
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': xsrfToken(),
            },
        });
    } catch {
        throw new ChatTimelineReadFailed(false);
    }

    if (!response.ok) {
        throw new ChatTimelineReadFailed(response.status === 409);
    }

    return (await response.json()) as Page;
}

export const chatTimelineClient: ChatTimelineClient = {
    events: (inboxId, cursor) =>
        readJson(eventsRoute({ query: cursor === null ? { inboxId } : { inboxId, cursor } }).url),
    rows: (inboxId, olderCursor) =>
        readJson(rowsRoute({ query: olderCursor === null ? { inboxId } : { inboxId, olderCursor } }).url),
};

export type ChatTimelineView = {
    /** The rows this view shows, oldest first, each once. */
    messages: Ref<ChatMessageData[]>;
    /** The incoming rows shown that the viewer has not read: the only ones an acknowledgement names. */
    unreadShown: ComputedRef<string[]>;
    hasOlder: Ref<boolean>;
    loadOlder(): Promise<void>;
    /** Whether this view lost the chat: it was removed, left or the chat closed. */
    accessEnded: Ref<boolean>;
    /** Reads what happened after this view's cursor and merges it in. */
    catchUp(): Promise<void>;
};

/**
 * One chat view's own timeline (doc 102, ordered acceptance, reads and recovery): it keeps the last contiguous position
 * of its membership, holds rows past a gap, reads the missing range up to the server's watermark, merges by id, and
 * after a refused cursor starts again from a fresh snapshot. Each view keeps its own position, so two devices of one
 * user each receive every event, whoever acknowledged it first.
 */
export function useChatTimeline(
    conversation: Ref<ConversationData | undefined>,
    client: ChatTimelineClient = chatTimelineClient,
): ChatTimelineView {
    let timeline: ChatTimeline | null = null;
    let cursor: string | null = null;
    let reading: Promise<void> | null = null;
    const messages = shallowRef<ChatMessageData[]>([]);
    const hasOlder = ref(false);
    const accessEnded = ref(false);

    function changed(): void {
        messages.value = timeline?.shown() ?? [];
        hasOlder.value = (timeline?.olderCursor() ?? null) !== null;
    }

    /**
     * The view lost the chat: its rows, buffer and cursor go, and every read still under way for it is ignored.
     */
    function end(): void {
        timeline = null;
        cursor = null;
        reading = null;
        accessEnded.value = true;
        changed();
    }

    /**
     * Whether a read that started for this timeline may still change the view; a read for a lost or left chat may not.
     */
    function isCurrent(shown: ChatTimeline): boolean {
        return timeline === shown;
    }

    /**
     * Starts the view from a snapshot at the watermark: the newest page of rows, and the cursor after it.
     */
    async function restart(inboxId: string, shown: ChatTimeline): Promise<void> {
        const snapshot = await client.events(inboxId, null);

        if (!isCurrent(shown)) {
            return;
        }

        if (snapshot.accessEnded) {
            end();

            return;
        }

        const newest = await client.rows(inboxId, null);

        if (!isCurrent(shown)) {
            return;
        }

        cursor = snapshot.cursor;
        shown.restart(newest.messages, snapshot.watermark, newest.olderCursor);
        changed();
    }

    /**
     * Reads back row pages until every message these events named is held, a bounded number of pages.
     */
    async function fill(inboxId: string, shown: ChatTimeline, missing: string[]): Promise<void> {
        let wanted = new Set(missing);
        let older: string | null = null;

        for (let page = 0; page < GAP_PAGE_LIMIT && wanted.size > 0; page++) {
            const rows = await client.rows(inboxId, older);

            if (!isCurrent(shown)) {
                return;
            }

            shown.offerRows(rows.messages);
            wanted = new Set([...wanted].filter((id) => !rows.messages.some((row) => row.id === id)));
            older = rows.olderCursor;

            if (older === null) {
                return;
            }
        }
    }

    async function readAfterCursor(inboxId: string, shown: ChatTimeline): Promise<void> {
        if (cursor === null) {
            await restart(inboxId, shown);

            return;
        }

        for (;;) {
            const page = await client.events(inboxId, cursor);

            if (!isCurrent(shown)) {
                return;
            }

            if (page.accessEnded) {
                end();

                return;
            }

            await fill(inboxId, shown, shown.missingOf(page.events));

            if (!isCurrent(shown)) {
                return;
            }

            const last = page.events.length === 0 ? page.watermark : page.events[page.events.length - 1].sequence;
            const full = page.events.length >= EVENT_PAGE_LIMIT;
            shown.advance(full ? last : page.watermark);
            cursor = page.cursor;
            changed();

            if (!full) {
                return;
            }
        }
    }

    async function catchUp(): Promise<void> {
        const inboxId = conversation.value?.inboxId;
        const shown = timeline;

        if (inboxId === undefined || shown === null) {
            return;
        }

        if (reading !== null) {
            return reading;
        }

        const read = readAfterCursor(inboxId, shown)
            .catch(async (failure: unknown) => {
                if (failure instanceof ChatTimelineReadFailed && failure.refused && isCurrent(shown)) {
                    await restart(inboxId, shown);
                }
            })
            .finally(() => {
                if (reading === read) {
                    reading = null;
                }
            });
        reading = read;

        return read;
    }

    watch(
        () => conversation.value?.inboxId,
        (inboxId) => {
            const opened = conversation.value;
            cursor = null;
            reading = null;
            accessEnded.value = false;
            timeline = opened === undefined || inboxId === undefined
                ? null
                : chatTimeline(opened.messages, opened.latestSequence, opened.olderCursor);
            changed();
            void catchUp();
        },
        { immediate: true },
    );

    // A read of the window brings its newest page; it joins the view's rows when it meets them, else the gap is read.
    watch(
        () => conversation.value?.messages,
        (page) => {
            const opened = conversation.value;
            if (opened !== undefined && timeline === null && accessEnded.value) {
                // A rejoin shows the chat again: it starts from a fresh snapshot, never from the lost cursor.
                accessEnded.value = false;
                timeline = chatTimeline(opened.messages, opened.latestSequence, opened.olderCursor);
                changed();
                void catchUp();

                return;
            }

            const shown = timeline;

            if (opened === undefined || shown === null || page === undefined) {
                return;
            }

            shown.offerPage(page, opened.latestSequence, opened.olderCursor === null);
            changed();

            if (shown.hasGap()) {
                void catchUp();
            }
        },
    );

    async function loadOlder(): Promise<void> {
        const inboxId = conversation.value?.inboxId;
        const shown = timeline;
        const older = shown?.olderCursor() ?? null;

        if (inboxId === undefined || shown === null || older === null) {
            return;
        }

        const page = await client.rows(inboxId, older);

        if (!isCurrent(shown)) {
            return;
        }

        shown.offerOlder(page.messages, page.olderCursor);
        changed();
    }

    const unreadShown = computed(() =>
        messages.value
            .filter((row) => row.speaker.actor !== conversation.value?.viewer && !row.readByMe)
            .map((row) => row.id),
    );

    // The live notice that this tab lost a chat ends the view of it at once, before the page is read again.
    const stopListening = onChatAccessEnded((inboxId) => {
        if (conversation.value?.inboxId === inboxId) {
            end();
        }
    });
    onBeforeUnmount(stopListening);

    return { messages, unreadShown, hasOlder, loadOlder, catchUp, accessEnded };
}
