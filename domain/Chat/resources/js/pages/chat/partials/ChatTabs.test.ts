// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AgentOptionData } from "@generated/types/chat";

// The chats chosen, each as the agent its reload named and the props it read.
const visited: string[] = [];
const reloaded: string[][] = [];

const created: Array<{ url: string; body: Record<string, unknown> }> = [];

vi.mock("@inertiajs/vue3", () => ({
  usePage: () => ({ url: "/", props: { drivers: [{ family: "claude-code" }], viewer: { id: "user-tabs" } } }),
  router: {
    reload: (options: { only: string[]; data: { agent: string } }) => {
      visited.push(options.data.agent);
      reloaded.push(options.only);
    },
  },
}));
// The server makes the new chat's agent and flashes its id back.
vi.mock("@kit/keyedPost", () => ({
  keyedPost: (
    url: string,
    body: Record<string, unknown>,
    _key: string,
    outcome: { onAccepted: (flash: Record<string, unknown>) => void; onFinish?: () => void },
  ) => {
    created.push({ url, body });
    outcome.onAccepted({ createdAgentId: "agent-4" });
    outcome.onFinish?.();
  },
}));

const { default: ChatTabs } = await import("./ChatTabs.vue");
const { useOpenChats } = await import("../../../composables/useOpenChats");
const { onChatListRequest } = await import("../../../composables/useChatBarAsks");

function mainAgent(id: string, name: string, sessionState = "idle"): AgentOptionData {
  return {
    id,
    name,
    isMain: true,
    isRetired: false,
    sessionId: null,
    sessionDriver: "claude-code",
    unreadCount: id === "agent-3" ? 2 : 0,
    status: { sessionState, label: sessionState, actions: [] },
  } as unknown as AgentOptionData;
}

const agents = [mainAgent("agent-2", "Agent 2", "working"), mainAgent("agent-3", "Agent 3")];

function tabsFor(selectedAgentId: string, columnAgentIds: string[] = []) {
  return mount(ChatTabs, {
    props: {
      agents,
      selectedAgentId,
      columnAgentIds,
    },
  });
}

describe("ChatTabs", () => {
  beforeEach(() => {
    visited.length = 0;
    reloaded.length = 0;
    created.length = 0;
    const store = useOpenChats("user-tabs");
    store.chats.agentIds = [];
    store.chats.recent = [];
    store.show("one");
  });

  it("shows each open main agent as a tab, the chosen one selected, with its unread count", async () => {
    useOpenChats("user-tabs").open("agent-3");
    const tabs = tabsFor("agent-2");
    await flushPromises();

    expect(tabs.findAll("[data-chat-tab]").map((tab) => tab.attributes("data-chat-tab"))).toEqual([
      "agent-3",
      "agent-2",
    ]);
    expect(tabs.get('[data-chat-tab="agent-2"]').attributes("aria-selected")).toBe("true");
    expect(tabs.get('[data-chat-tab="agent-2"]').text()).toContain("Agent 2 · main");
    expect(tabs.get('[data-chat-tab="agent-3"]').find('[aria-label="2 unread"]').exists()).toBe(true);
  });

  it("switches to another chat by its tab and with the arrow keys, reading only that chat", async () => {
    useOpenChats("user-tabs").open("agent-3");
    const tabs = tabsFor("agent-2");

    await tabs.get('[data-chat-tab="agent-3"]').trigger("click");
    await tabs.get('[data-chat-tab="agent-2"]').trigger("keydown", { key: "ArrowRight" });

    expect(visited).toEqual(["agent-3", "agent-3"]);
    // Only the chat window and the bar are read again, never the whole page.
    expect(reloaded[0]).toEqual(["window_chat_conversation", "page"]);
  });

  it("closes only the tab, offers Undo, and Undo brings it back", async () => {
    useOpenChats("user-tabs").open("agent-3");
    const tabs = tabsFor("agent-2");

    await tabs.get('[data-close-tab="agent-3"]').trigger("click");
    expect(tabs.find('[data-chat-tab="agent-3"]').exists()).toBe(false);
    expect(tabs.text()).toContain("it keeps working");

    tabs.findComponent({ name: "Toast" }).vm.$emit("undo");
    await flushPromises();
    expect(tabs.find('[data-chat-tab="agent-3"]').exists()).toBe(true);
  });

  it("makes the new chat's agent at once on the last driver and opens its tab, where its chat asks what runs it", async () => {
    const tabs = tabsFor("agent-2");

    await tabs.get("[data-new-chat-tab]").trigger("click");
    await flushPromises();

    expect(created[0]?.body).toMatchObject({ driver: "claude-code", model: "default" });
    expect(useOpenChats("user-tabs").chats.agentIds).toContain("agent-4");
    expect(visited).toEqual(["agent-4"]);
    expect(tabs.find("[data-new-chat-form]").exists()).toBe(false);
  });

  it("carries a caret on the chosen tab alone, which asks for that chat's list", async () => {
    useOpenChats("user-tabs").open("agent-3");
    const asked: string[] = [];
    const tabs = mount({
      setup() {
        onChatListRequest(() => "agent-2", () => asked.push("agent-2"));

        return {};
      },
      template: "<div />",
    });
    const row = tabsFor("agent-2");

    expect(row.findAll("[data-tab-caret]").map((caret) => caret.attributes("data-tab-caret"))).toEqual(["agent-2"]);
    await row.get('[data-tab-caret="agent-2"]').trigger("click");
    await flushPromises();

    expect(asked).toEqual(["agent-2"]);
    tabs.unmount();
  });

  it("shows the open chats side by side, underlining the tabs that have a column", async () => {
    useOpenChats("user-tabs").open("agent-3");
    const tabs = tabsFor("agent-2", ["agent-2", "agent-3"]);

    await tabs.get('[data-segment="side"]').trigger("click");

    expect(useOpenChats("user-tabs").chats.mode).toBe("side");
    expect(useOpenChats("user-tabs").besideOf("agent-2")).toEqual(["agent-3"]);
    expect(tabs.get('[data-chat-tab="agent-3"]').classes()).toContain("underline");
  });
});
