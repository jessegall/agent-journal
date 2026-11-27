import type {
  ChatEntryData,
  ChatRowsPageData,
  ConversationData,
} from "@generated/types/chat";
import { onChatAccessEnded } from "@kit/chatAccess";
import type { DockNode } from "@kit/dockCards";
import { chatRows, load } from "@kit/loaders";
import { computed, onBeforeUnmount, ref, shallowRef, watch } from "vue";
import type { ComputedRef, Ref } from "vue";

/**
 * How often an event whose card shows a record still running is read again, so its state and time stay current.
 */
const RUNNING_CARD_READ_MS = 3000;

/**
 * The server read the timeline makes: the page of entries before the one named, or the newest page.
 */
export type ChatTimelineClient = {
  rows(inboxId: string, beforeId: string | null): Promise<ChatRowsPageData>;
};

/**
 * The chat's rows could not be read for this viewer: the chat is gone or no longer visible to them.
 */
export class ChatRowsUnavailable extends Error {
  /** The rows of the chat could not be read, even from its newest page. */
  static unreadable(): ChatRowsUnavailable {
    return new ChatRowsUnavailable("The chat's rows are unavailable.");
  }
}

export const chatTimelineClient: ChatTimelineClient = {
  rows: async (inboxId, beforeId) => {
    const answer = await load(chatRows, { inboxId, beforeId });

    if (answer.status === "ok") {
      return answer.value;
    }

    // A cursor the server no longer reads starts again from the newest page, which merges in by id.
    if (beforeId !== null) {
      return chatTimelineClient.rows(inboxId, null);
    }

    throw ChatRowsUnavailable.unreadable();
  },
};

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

/** Entries in the order the chat shows them: by when they were made, then by id. */
function ordered(entries: Iterable<ChatEntryData>): ChatEntryData[] {
  return [...entries].sort((one, other) =>
    one.createdAt === other.createdAt
      ? one.id.localeCompare(other.id)
      : one.createdAt.localeCompare(other.createdAt),
  );
}

export type ChatTimelineView = {
  /** The entries this view shows, oldest first, each once. */
  entries: Ref<ChatEntryData[]>;
  /** The ids of the messages by others shown that the viewer has not read: the only ones a read names. */
  unreadShown: ComputedRef<string[]>;
  hasOlder: Ref<boolean>;
  loadOlder(): Promise<void>;
  /** Whether this view lost the chat: it was removed, left or the chat closed. */
  accessEnded: Ref<boolean>;
};

/**
 * One chat view's entries: the newest page it opened with, every newer read of the window merged in by id, and the
 * older pages read on request. A changed entry, such as an answered question, replaces the one held under its id.
 */
export function useChatTimeline(
  conversation: Ref<ConversationData | undefined>,
  client: ChatTimelineClient = chatTimelineClient,
): ChatTimelineView {
  const held = new Map<string, ChatEntryData>();
  const entries = shallowRef<ChatEntryData[]>([]);
  const hasOlder = ref(false);
  const accessEnded = ref(false);
  let shownInboxId: string | undefined;

  function merge(incoming: ChatEntryData[]): void {
    incoming.forEach((entry) => held.set(entry.id, entry));
    entries.value = ordered(held.values());
  }

  function restart(opened: ConversationData | undefined): void {
    held.clear();
    shownInboxId = opened?.inboxId;
    accessEnded.value = false;
    hasOlder.value = opened?.hasOlder ?? false;
    merge(opened?.entries ?? []);
  }

  /** The view lost the chat: its entries go, and every read still under way for it is ignored. */
  function end(): void {
    held.clear();
    shownInboxId = undefined;
    entries.value = [];
    hasOlder.value = false;
    accessEnded.value = true;
  }

  watch(
    () => conversation.value?.inboxId,
    () => restart(conversation.value),
    { immediate: true },
  );

  // A read of the window brings its newest page; each entry joins or replaces the one held under its id.
  watch(
    () => conversation.value?.entries,
    (page) => {
      const opened = conversation.value;

      if (opened === undefined || page === undefined) {
        return;
      }

      if (shownInboxId !== opened.inboxId) {
        restart(opened);

        return;
      }

      merge(page);
    },
  );

  async function loadOlder(): Promise<void> {
    const inboxId = shownInboxId;
    const oldest = entries.value[0];

    if (inboxId === undefined || oldest === undefined || !hasOlder.value) {
      return;
    }

    const page = await client.rows(inboxId, oldest.id);

    if (shownInboxId !== inboxId) {
      return;
    }

    hasOlder.value = page.hasOlder;
    merge(page.entries);
  }

  const runningRead = setInterval(() => {
    const inboxId = shownInboxId;

    if (
      inboxId !== undefined &&
      entries.value.some((entry) => isRunning(entry.event?.root ?? null))
    ) {
      void client.rows(inboxId, null).then((page) => {
        if (shownInboxId === inboxId) {
          merge(page.entries);
        }
      });
    }
  }, RUNNING_CARD_READ_MS);
  onBeforeUnmount(() => clearInterval(runningRead));

  const unreadShown = computed(() =>
    entries.value.flatMap((entry) =>
      entry.message !== undefined &&
      entry.author !== conversation.value?.viewer &&
      !entry.message.isReadByViewer
        ? [entry.message.id]
        : [],
    ),
  );

  // The live notice that this tab lost a chat ends the view of it at once, before the page is read again.
  const stopListening = onChatAccessEnded((inboxId) => {
    if (shownInboxId === inboxId) {
      end();
    }
  });
  onBeforeUnmount(stopListening);

  return { entries, unreadShown, hasOlder, loadOlder, accessEnded };
}
