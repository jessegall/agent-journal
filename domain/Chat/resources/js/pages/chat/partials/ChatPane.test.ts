// @vitest-environment happy-dom
import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import type { ChatData } from "@generated/types/chat";
import { notifyRunningCommand, type RunningCommandData } from "@kit/runningCommands";

const revealedProps = ref(new Set<string>());
const purgers: Array<() => void> = [];
const reads: Array<Record<string, unknown>> = [];

vi.mock("@inertiajs/vue3", () => ({
  Link: { props: ["href"], template: '<a :href="href"><slot /></a>' },
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
vi.mock("./ConversationMenu.vue", () => ({ default: { template: "<div />" } }));
vi.mock("./AgentSessionActions.vue", () => ({
  default: { template: "<div />" },
}));
vi.mock("./VerifyingSessionCard.vue", () => ({
  default: { template: "<div />" },
}));

vi.mock("./StartPicker.vue", () => ({
  default: { props: ["agent", "isNew"], template: '<div data-start-picker :data-new="isNew" />' },
}));

const { default: ChatPane } = await import("./ChatPane.vue");

function chatWith(inboxId: string, runningCommand: RunningCommandData | null = null, hasEntries = true): ChatData {
  return {
    agents: [{ id: "agent-1", name: "Main agent", status: { sessionState: "working", label: "working", actions: [] } }],
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
      entries: hasEntries ? [
        {
          id: `${inboxId}-unread`,
          type: "message",
          author: "agent:agent-1",
          authorLabel: "Main agent",
          message: { id: `${inboxId}-unread`, isReadByViewer: false },
        },
      ] : [],
    },
  } as unknown as ChatData;
}

function mountPane(inboxId = "conversation-1", runningCommand: RunningCommandData | null = null) {
  return mount(ChatPane, {
    props: {
      chat: chatWith(inboxId, runningCommand),
      offersChoice: false,
      agentUrl: () => "/chat",
      questionUrl: () => "/chat?question=1",
      loadMore: () => undefined,
      protectedProp: "window_chat_conversation",
    },
  });
}

function runningLine(line: string, changedAt: string): RunningCommandData {
  return { agentId: "agent-1", line, isRunning: true, changedAt };
}

// The state the chat window sends while no account is signed in, as NoAccountsYet builds it.
function noAccountsYet(): LayoutPartData {
  const part = (fields: Partial<LayoutPartData> & Pick<LayoutPartData, "tag" | "key" | "style">): LayoutPartData => ({
    size: null,
    text: null,
    detail: null,
    rows: [],
    children: [],
    tabs: [],
    ...fields,
  });

  return part({
    tag: "box",
    key: "empty-page",
    style: "page-empty",
    children: [
      part({ tag: "text", key: "icon", style: "icon", text: "account" }),
      part({
        tag: "notice",
        key: "empty",
        style: "first",
        text: "No accounts yet",
        detail: "Agents run on an account. Add a Claude Code or Codex account so they can start work.",
      }),
      part({
        tag: "action",
        key: "add",
        style: "primary",
        text: "Add account",
        action: { query: {}, submits: false, appends: false, href: "/accounts?add=1" },
      }),
    ],
  });
}

// A pane left mounted would answer the next test's reveal too.
enableAutoUnmount(afterEach);

describe("ChatPane", () => {
  beforeEach(() => {
    revealedProps.value = new Set();
    reads.length = 0;
  });

  it("shows no members or add-someone button while group chats are hidden", async () => {
    const pane = mountPane();
    await flushPromises();

    expect(pane.find('[aria-label="Who is in this chat"]').exists()).toBe(false);
    expect(pane.find('[aria-label="Add someone to this chat"]').exists()).toBe(false);
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

  it("shows the agent's running command above the composer from the page's seed", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const pane = mountPane("conversation-1", runningLine("Bash npm test", "2026-11-28T10:00:00.000000Z"));
    await flushPromises();

    const line = pane.get("[data-running-line]");
    expect(line.text()).toBe("Bash npm test");
    expect(
      line.element.compareDocumentPosition(pane.get('[aria-label="Composer"]').element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("follows a pushed command with no read, and forgets it in another chat", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const pane = mountPane();
    await flushPromises();
    const readsBefore = reads.length;

    notifyRunningCommand(runningLine("Bash npm run build", "2026-11-28T10:00:05.000000Z"));
    await flushPromises();
    expect(pane.get("[data-running-line]").text()).toBe("Bash npm run build");
    expect(reads).toHaveLength(readsBefore);

    await pane.setProps({ chat: chatWith("conversation-2") });
    expect(pane.find("[data-running-line]").exists()).toBe(false);
  });

  it("shows the idle word when the agent has no command", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const pane = mountPane();
    await flushPromises();

    expect(pane.find("[data-running-line]").exists()).toBe(false);
    expect(pane.get("[data-running-idle]").text()).toBe("thinking");
  });
  it("shows No accounts yet with the account wizard in place of the conversation while no account is signed in", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const pane = mount(ChatPane, {
      props: {
        chat: { ...chatWith("conversation-1"), noAccounts: noAccountsYet() },
        offersChoice: false,
        agentUrl: () => "/chat",
        questionUrl: () => "/chat?question=1",
        loadMore: () => undefined,
        protectedProp: "window_chat_conversation",
      },
    });
    await flushPromises();

    const region = pane.get('[aria-label="No accounts yet"]');
    expect(region.text()).toContain("Agents run on an account.");
    expect(region.text()).toContain("Add account");
    expect(region.find('a[href="/accounts?add=1"]').exists()).toBe(true);
    expect(pane.find('[aria-label="Composer"]').exists()).toBe(false);
  });

  it("shows the conversation and no such state once an account is signed in", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const pane = mountPane();
    await flushPromises();

    expect(pane.find('[aria-label="No accounts yet"]').exists()).toBe(false);
    expect(pane.find('[aria-label="Composer"]').exists()).toBe(true);
  });

  it("shows only the start picker in a new chat: no composer and no empty-chat note", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const chat = chatWith("conversation-1", null, false);
    chat.agents[0] = { ...chat.agents[0], sessionId: null, isRetired: false } as (typeof chat.agents)[number];
    const pane = mount(ChatPane, {
      props: {
        chat,
        offersChoice: false,
        loadMore: () => undefined,
        protectedProp: "window_chat_conversation",
      },
    });
    await flushPromises();

    expect(pane.get("[data-start-picker]").attributes("data-new")).toBe("true");
    expect(pane.find('[aria-label="Composer"]').exists()).toBe(false);
    expect(pane.find('[aria-label="Messages"]').exists()).toBe(false);
  });

  it("keeps an ended chat's history and puts the start picker in the composer's place", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const chat = chatWith("conversation-1");
    chat.agents[0] = { ...chat.agents[0], sessionId: null, isRetired: false } as (typeof chat.agents)[number];
    const pane = mount(ChatPane, {
      props: {
        chat,
        offersChoice: false,
        loadMore: () => undefined,
        protectedProp: "window_chat_conversation",
      },
    });
    await flushPromises();

    expect(pane.find('[aria-label="Messages"]').exists()).toBe(true);
    expect(pane.get("[data-start-picker]").attributes("data-new")).toBe("false");
    expect(pane.find('[aria-label="Composer"]').exists()).toBe(false);
  });

  it("opens the agent's menu upward over the chat from above the composer, leaving the composer where it was", async () => {
    revealedProps.value = new Set(["window_chat_conversation"]);
    const pane = mountPane();
    await flushPromises();
    const composer = pane.get('[aria-label="Composer"]').element;

    await pane.get("[data-agent-row] [data-chat-list-trigger]").trigger("click");
    await flushPromises();

    expect(pane.find("[data-popover-above]").exists()).toBe(true);
    expect(pane.get('[aria-label="Composer"]').element).toBe(composer);
  });
});
