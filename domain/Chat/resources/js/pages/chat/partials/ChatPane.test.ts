// @vitest-environment happy-dom
import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import type { ChatData } from "@generated/types/chat";

const revealedProps = ref(new Set<string>());
const purgers: Array<() => void> = [];
const reads: Array<Record<string, unknown>> = [];

vi.mock("@inertiajs/vue3", () => ({
  usePage: () => ({ props: { viewer: { type: "owner", id: "user-1", canShare: true }, drivers: [] } }),
  router: {
    on: vi.fn(),
    post: (_url: string, body: Record<string, unknown>) => reads.push(body),
  },
}));
vi.mock("@kit/notifications", () => ({
  LEASE_MILLISECONDS: 30_000,
  useNotifications: () => ({}),
}));
vi.mock("@kit/protectedView", () => ({
  isRevealed: (prop: string) => revealedProps.value.has(prop),
  onPurge: (purger: () => void) => {
    purgers.push(purger);

    return () => undefined;
  },
}));
vi.mock("@generated/routes/chat", () => ({
  read: () => ({ url: "/chat/messages/read" }),
}));
vi.mock("../../../composables/useConversationIntents", () => ({
  useConversationIntents: () => ({
    rows: (entries: unknown[]) =>
      entries.map((entry) => ({ kind: "entry", entry })),
    settle: () => undefined,
    recoveryEntries: () => [],
    refusalOf: () => "",
    announcement: { value: "" },
  }),
}));
// The timeline's entries come with the conversation here, so the test watches only when the pane reads what it shows.
vi.mock("../../../composables/useChatTimeline", async () => {
  const { computed, ref } = await import("vue");

  return {
    useChatTimeline: (conversation: {
      value?: { entries?: { message: { id: string; isReadByViewer: boolean } }[] };
    }) => ({
      entries: computed(() => conversation.value?.entries ?? []),
      unreadShown: computed(() =>
        (conversation.value?.entries ?? [])
          .filter((entry) => !entry.message.isReadByViewer)
          .map((entry) => entry.message.id),
      ),
      hasOlder: ref(false),
      loadOlder: vi.fn(),
      accessEnded: ref(false),
    }),
  };
});
vi.mock("@kit/SlotSections", () => ({ default: { template: "<div />" } }));
vi.mock("./MessageList.vue", () => ({
  default: { name: "MessageList", template: '<ol aria-label="Messages" />' },
}));
vi.mock("./DockStack.vue", () => ({ default: { template: "<div />" } }));
vi.mock("./Composer.vue", () => ({
  default: { name: "Composer", template: '<form aria-label="Composer" />' },
}));
vi.mock("./AgentPicker.vue", () => ({ default: { template: "<div />" } }));
vi.mock("./ChatRoster.vue", () => ({ default: { template: "<div />" } }));
vi.mock("./InboxSelector.vue", () => ({
  default: { template: "<div />" },
}));
vi.mock("./AgentSessionActions.vue", () => ({
  default: { template: "<div />" },
}));
vi.mock("./VerifyingSessionCard.vue", () => ({
  default: { template: "<div />" },
}));

const { default: ChatPane } = await import("./ChatPane.vue");

function chatWith(inboxId: string, runningCommand: string | null = null): ChatData {
  return {
    agents: [{ id: "agent-1", name: "Main agent", status: { sessionState: "working" } }],
    selectedAgentId: "agent-1",
    isSetupRequired: false,
    dockSections: [],
    chats: [],
    canCreateChats: false,
    conversation: {
      inboxId,
      agentId: "agent-1",
      viewer: "user:user-1",
      participants: [],
      capabilities: {
        canAdd: false,
        canRemove: false,
        canTransfer: false,
        canLeave: true,
        canClose: false,
      },
      sessionId: null,
      sessionGeneration: 0,
      runningCommand,
      dock: { cards: [], hasMore: null },
      entries: [
        {
          id: `${inboxId}-unread`,
          type: "message",
          author: "agent:agent-1",
          authorLabel: "Main agent",
          message: { id: `${inboxId}-unread`, isReadByViewer: false },
        },
      ],
    },
  } as unknown as ChatData;
}

function mountPane(inboxId = "conversation-1", runningCommand: string | null = null) {
  return mount(ChatPane, {
    props: {
      chat: chatWith(inboxId, runningCommand),
      offersChoice: false,
      agentUrl: () => "/chat",
      chatUrl: () => "/chat",
      questionUrl: () => "/chat?question=1",
      loadMore: () => undefined,
      protectedProp: "window_chat_conversation",
    },
  });
}

// A pane left mounted would answer the next test's reveal too.
enableAutoUnmount(afterEach);

describe("ChatPane", () => {
  beforeEach(() => {
    revealedProps.value = new Set();
    reads.length = 0;
  });

  it("shows who is in the chat in the agent bar while the bar is there, and above the chat without it", async () => {
    const bar = document.createElement("span");
    bar.id = "agent-bar-members";
    document.body.appendChild(bar);

    mountPane();
    await flushPromises();

    expect(bar.querySelector('[aria-label="Who is in this chat"]')).not.toBeNull();
    bar.remove();

    const pane = mountPane();
    await flushPromises();

    expect(pane.find('[aria-label="Who is in this chat"]').exists()).toBe(true);
  });

  it("keeps the conversation hidden and reads nothing until a read that included its prop answered", async () => {
    const pane = mountPane();

    expect(pane.text()).toContain("Loading the conversation…");
    expect(pane.find('[aria-label="Messages"]').exists()).toBe(false);
    expect(pane.find('[aria-label="Composer"]').exists()).toBe(false);
    revealedProps.value = new Set(["navigationCounts"]);
    await flushPromises();
    expect(pane.find('[aria-label="Messages"]').exists()).toBe(false);
    expect(reads).toEqual([]);
  });

  it("reads what it shows once when first revealed, and not again when the same conversation returns", async () => {
    const pane = mountPane();

    revealedProps.value = new Set(["window_chat_conversation"]);
    await flushPromises();
    expect(pane.find('[aria-label="Messages"]').exists()).toBe(true);
    expect(reads).toHaveLength(1);

    revealedProps.value = new Set();
    await flushPromises();
    revealedProps.value = new Set(["window_chat_conversation"]);
    await flushPromises();

    expect(reads).toHaveLength(1);
  });

  it("reads again when the user opens another conversation", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const pane = mountPane();
    await flushPromises();

    await pane.setProps({ chat: chatWith("conversation-2") });

    expect(reads.map((read) => read.messageIds)).toEqual([
      ["conversation-1-unread"],
      ["conversation-2-unread"],
    ]);
  });

  it("shows the agent's running command above the composer, and changes it when the chat is read again", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const pane = mountPane("conversation-1", "Ran npm test");
    await flushPromises();

    const line = pane.get("[data-running-command]");
    expect(line.text()).toBe("Ran npm test");
    expect(
      line.element.compareDocumentPosition(pane.get('[aria-label="Composer"]').element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    await pane.setProps({ chat: chatWith("conversation-1", "Edited src/b.php") });

    expect(pane.get("[data-running-command]").text()).toBe("Edited src/b.php");
  });

  it("shows no running command when the agent has done nothing since its last message", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const pane = mountPane();
    await flushPromises();

    expect(pane.find("[data-running-command]").exists()).toBe(false);
  });
});
