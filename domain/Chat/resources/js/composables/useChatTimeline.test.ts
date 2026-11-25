// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import type { ChatEntryData, ChatRowsPageData, ConversationData } from "@generated/types/chat";
import { notifyChatAccessEnded } from "@kit/chatAccess";
import { useChatTimeline } from "./useChatTimeline";
import type { ChatTimelineClient, ChatTimelineView } from "./useChatTimeline";

function entry(number: number, body = `message ${number}`): ChatEntryData {
  return {
    id: `m${number}`,
    type: "message",
    groupNumber: number,
    author: "user:ada",
    authorLabel: "Ada",
    createdAt: `2026-11-25T10:00:${String(number).padStart(2, "0")}Z`,
    message: {
      id: `m${number}`,
      number,
      body,
      targetMessageId: null,
      targetNumber: null,
      isReadByViewer: false,
    },
  } as ChatEntryData;
}

function conversationOf(entries: ChatEntryData[], hasOlder = false): ConversationData {
  return {
    inboxId: "design",
    viewer: "user:bea",
    participants: [],
    hasOlder,
    entries,
  } as unknown as ConversationData;
}

/**
 * A server whose reads of older entries wait until the test releases them, so a read can still be out when the
 * chat is lost.
 */
function heldClient() {
  const releases: (() => void)[] = [];
  const client: ChatTimelineClient = {
    rows: () =>
      new Promise<ChatRowsPageData>((resolve) =>
        releases.push(() => resolve({ entries: [entry(1), entry(2)], hasOlder: false } as ChatRowsPageData)),
      ),
  };

  return {
    client,
    releaseAll: () => releases.splice(0).forEach((release) => release()),
  };
}

function mountTimeline(
  conversation: ReturnType<typeof ref<ConversationData | undefined>>,
  client: ChatTimelineClient,
) {
  let view: ChatTimelineView | undefined;
  mount(
    defineComponent({
      setup() {
        view = useChatTimeline(conversation as never, client);

        return () => null;
      },
    }),
  );

  return view as ChatTimelineView;
}

function shownIds(view: ChatTimelineView): string[] {
  return view.entries.value.map((shown) => shown.id);
}

describe("useChatTimeline", () => {
  it("merges a newer page by id, so a changed entry replaces the one it held", async () => {
    const conversation = ref<ConversationData | undefined>(conversationOf([entry(10)]));
    const view = mountTimeline(conversation, heldClient().client);
    await nextTick();

    conversation.value = conversationOf([entry(10, "edited"), entry(11)]);
    await nextTick();

    expect(shownIds(view)).toEqual(["m10", "m11"]);
    expect(view.entries.value[0].message?.body).toBe("edited");
    expect(view.unreadShown.value).toEqual(["m10", "m11"]);
  });

  it("clears a lost chat, ignores the older read still out, and a rejoin starts from the fresh page", async () => {
    const conversation = ref<ConversationData | undefined>(conversationOf([entry(10)], true));
    const server = heldClient();
    const view = mountTimeline(conversation, server.client);
    await nextTick();

    const olderRead = view.loadOlder();
    notifyChatAccessEnded("design");
    server.releaseAll();
    await olderRead;

    expect(view.accessEnded.value).toBe(true);
    expect(view.entries.value).toEqual([]);

    conversation.value = conversationOf([entry(10), entry(11), entry(12)]);
    await nextTick();

    expect(view.accessEnded.value).toBe(false);
    expect(shownIds(view)).toEqual(["m10", "m11", "m12"]);
  });
});
