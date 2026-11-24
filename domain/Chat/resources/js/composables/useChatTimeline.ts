import type {
  ChatEventsPageData,
  ChatLineData,
  ChatMessageData,
  ChatRowsPageData,
  ConversationData,
} from "@generated/types/chat";
import { onChatAccessEnded } from "@kit/chatAccess";
import type { DockNode } from "@kit/dockCards";
import { readPage } from "@kit/pageReads";
import type { PropReadFailed } from "@kit/pageReads";
import { computed, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import type { ComputedRef, Ref } from "vue";
import { chatTimeline } from "./chatTimeline";
import type { ChatTimeline } from "./chatTimeline";

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
    super(
      refused
        ? "The chat refused this cursor."
        : "The chat read did not arrive.",
    );
  }
}

/**
 * The server reads the timeline makes; each answers its page or throws ChatTimelineReadFailed.
 */
export type ChatTimelineClient = {
  events(inboxId: string, cursor: string | null): Promise<ChatEventsPageData>;
  rows(inboxId: string, olderCursor: string | null): Promise<ChatRowsPageData>;
};

/** The timeline event of a plain line a domain posted, which carries no message. */
const LINE_EVENT = "line";

/** Whether a card's parts hold a time that has not ended, so what it shows still runs. */
export function isRunning(node: DockNode | null): boolean {
  if (node === null) {
    return false;
  }

  if (node.type === "duration") {
    return node.finishedAt === null;
  }

  return "children" in node && node.children.some((child) => isRunning(child));
}

/** A chat's timeline started from the page it opened with. */
function timelineOf(opened: ConversationData): ChatTimeline {
  return chatTimeline(
    opened.messages,
    opened.latestSequence,
    opened.olderCursor,
  );
}

/**
 * Reads one of the chat page's reads by a partial reload: a refused cursor (409) is refused, anything else did not
 * arrive.
 */
function readTimeline<Page>(
  routeName: string,
  query: Record<string, string>,
): Promise<Page> {
  return readPage<Page>(routeName, query).catch((failure: PropReadFailed) => {
    throw new ChatTimelineReadFailed(failure.status === 409);
  });
}

export const chatTimelineClient: ChatTimelineClient = {
  events: (inboxId, cursor) =>
    readTimeline(
      "chat.events",
      cursor === null ? { inboxId } : { inboxId, cursor },
    ),
  rows: (inboxId, olderCursor) =>
    readTimeline(
      "chat.rows",
      olderCursor === null ? { inboxId } : { inboxId, olderCursor },
    ),
};

export type ChatTimelineView = {
  /** The rows this view shows, oldest first, each once. */
  messages: Ref<ChatMessageData[]>;
  /** The plain lines among the messages, such as a sequence's steps, oldest first. */
  lines: Ref<ChatLineData[]>;
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
 * One chat view's own timeline: it keeps the last contiguous position
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
  const lines = shallowRef<ChatLineData[]>([]);

  // A line whose card shows a record still running is read again until it ends, so its state and time stay current.
  const RUNNING_CARD_READ_MS = 3000;
  const runningRead = setInterval(() => {
    const inboxId = conversation.value?.inboxId;

    if (
      inboxId !== undefined &&
      lines.value.some((line) => isRunning(line.card?.root ?? null))
    ) {
      void client.rows(inboxId, null).then((page) => keepLines(page.lines));
    }
  }, RUNNING_CARD_READ_MS);
  onBeforeUnmount(() => clearInterval(runningRead));

  // Pages overlap, so each plain line is kept once, by its position in the timeline.
  function keepLines(more: ChatLineData[]): void {
    const byPosition = new Map(
      lines.value.map((line) => [line.sequence, line]),
    );
    more.forEach((line) => byPosition.set(line.sequence, line));
    lines.value = [...byPosition.values()].sort(
      (one, other) => one.sequence - other.sequence,
    );
  }
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
    keepLines(newest.lines);
    changed();
  }

  /**
   * Reads back row pages until every message these events named is held, a bounded number of pages.
   */
  async function fill(
    inboxId: string,
    shown: ChatTimeline,
    missing: string[],
  ): Promise<void> {
    let wanted = new Set(missing);
    let older: string | null = null;

    for (let page = 0; page < GAP_PAGE_LIMIT && wanted.size > 0; page++) {
      const rows = await client.rows(inboxId, older);

      if (!isCurrent(shown)) {
        return;
      }

      shown.offerRows(rows.messages);
      keepLines(rows.lines);
      wanted = new Set(
        [...wanted].filter((id) => !rows.messages.some((row) => row.id === id)),
      );
      older = rows.olderCursor;

      if (older === null) {
        return;
      }
    }
  }

  async function readAfterCursor(
    inboxId: string,
    shown: ChatTimeline,
  ): Promise<void> {
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

      if (page.events.some((event) => event.type === LINE_EVENT)) {
        // A plain line names no message, so the newest rows page brings it, with the lines after its first row.
        keepLines((await client.rows(inboxId, null)).lines);
      }

      if (!isCurrent(shown)) {
        return;
      }

      const last =
        page.events.length === 0
          ? page.watermark
          : page.events[page.events.length - 1].sequence;
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
        if (
          failure instanceof ChatTimelineReadFailed &&
          failure.refused &&
          isCurrent(shown)
        ) {
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
      lines.value = opened?.lines ?? [];
      timeline =
        opened === undefined || inboxId === undefined
          ? null
          : timelineOf(opened);
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
        timeline = timelineOf(opened);
        changed();
        void catchUp();

        return;
      }

      const shown = timeline;

      if (opened === undefined || shown === null || page === undefined) {
        return;
      }

      shown.offerPage(page, opened.latestSequence, opened.olderCursor === null);
      keepLines(opened.lines);
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
    keepLines(page.lines);
    changed();
  }

  const unreadShown = computed(() =>
    messages.value
      .filter(
        (row) =>
          row.speaker.actor !== conversation.value?.viewer && !row.readByMe,
      )
      .map((row) => row.id),
  );

  // The live notice that this tab lost a chat ends the view of it at once, before the page is read again.
  const stopListening = onChatAccessEnded((inboxId) => {
    if (conversation.value?.inboxId === inboxId) {
      end();
    }
  });
  onBeforeUnmount(stopListening);

  return {
    messages,
    lines,
    unreadShown,
    hasOlder,
    loadOlder,
    catchUp,
    accessEnded,
  };
}
