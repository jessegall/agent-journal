// @vitest-environment happy-dom
import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import type { ChatData } from "@generated/types/chat";

const revealedProps = ref(new Set<string>());
const purgers: Array<() => void> = [];
const reads: Array<Record<string, unknown>> = [];

vi.mock("@inertiajs/vue3", () => ({
  usePage: () => ({ props: { currentUser: { id: "user-1" } } }),
  router: {
    on: vi.fn(),
    post: (_url: string, body: Record<string, unknown>) => reads.push(body),
  },
}));
vi.mock("@kit/notifications", () => ({
  LEASE_MILLISECONDS: 30_000,
  useNotifications: () => ({ markQuestionRead: async () => undefined }),
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
vi.mock("./composables/useConversationIntents", () => ({
  useConversationIntents: () => ({
    rows: (messages: unknown[]) =>
      messages.map((message) => ({ kind: "message", message })),
    settle: () => undefined,
    recoveryEntries: () => [],
    refusalOf: () => "",
    announcement: { value: "" },
  }),
}));
// The timeline reads its rows from the chat's events; here they come with the conversation, so the test watches only
// when the pane reads what it shows.
vi.mock("./composables/useChatTimeline", async () => {
  const { computed, ref } = await import("vue");

  return {
    useChatTimeline: (conversation: {
      value?: { messages?: { id: string; readByMe: boolean }[] };
    }) => ({
      messages: computed(() => conversation.value?.messages ?? []),
      unreadShown: computed(() =>
        (conversation.value?.messages ?? [])
          .filter((row) => !row.readByMe)
          .map((row) => row.id),
      ),
      lines: ref([]),
      hasOlder: ref(false),
      loadOlder: vi.fn(),
      catchUp: vi.fn(),
      accessEnded: ref(false),
    }),
  };
});
vi.mock("@kit/SlotSections", () => ({ default: { template: "<div />" } }));
vi.mock("./MessageList.vue", () => ({
  default: { name: "MessageList", template: '<ol aria-label="Messages" />' },
}));
vi.mock("./dock/DockStack.vue", () => ({ default: { template: "<div />" } }));
vi.mock("./Composer.vue", () => ({
  default: { name: "Composer", template: '<form aria-label="Composer" />' },
}));
vi.mock("./AgentPicker.vue", () => ({ default: { template: "<div />" } }));
vi.mock("./chats/ChatRoster.vue", () => ({ default: { template: "<div />" } }));
vi.mock("./chats/InboxSelector.vue", () => ({
  default: { template: "<div />" },
}));
vi.mock("./AgentSessionActions.vue", () => ({
  default: { template: "<div />" },
}));

const { default: ChatPane } = await import("./ChatPane.vue");

function chatWith(inboxId: string): ChatData {
  return {
    agents: [{ id: "agent-1", name: "Main agent" }],
    selectedAgentId: "agent-1",
    setupRequired: false,
    dockSections: [],
    chats: [],
    canCreateChats: false,
    conversation: {
      inboxId,
      agentId: "agent-1",
      viewer: "user:user-1",
      participants: [],
      capabilities: {
        add: false,
        remove: false,
        transfer: false,
        leave: true,
        close: false,
      },
      sessionId: null,
      sessionGeneration: 0,
      dock: { cards: [], more: null },
      messages: [
        {
          id: `${inboxId}-unread`,
          speaker: {
            actor: "agent:agent-1",
            label: "Main agent",
            driver: null,
          },
          readByMe: false,
          replyTo: null,
        },
      ],
    },
  } as unknown as ChatData;
}

function mountPane(inboxId = "conversation-1") {
  return mount(ChatPane, {
    props: {
      chat: chatWith(inboxId),
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
});
