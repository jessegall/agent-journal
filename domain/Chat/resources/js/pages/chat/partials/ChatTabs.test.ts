// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AgentOptionData } from "@generated/types/chat";

const visited: string[] = [];

vi.mock("@inertiajs/vue3", () => ({
  usePage: () => ({ url: "/", props: { drivers: [], viewer: { id: "user-tabs" } } }),
  router: { visit: (url: string) => visited.push(url) },
}));
vi.mock("./CreateChatForm.vue", () => ({
  default: { name: "CreateChatForm", template: "<div data-new-chat-form />", emits: ["created", "close"] },
}));

const { default: ChatTabs } = await import("./ChatTabs.vue");
const { useOpenChats } = await import("../../../composables/useOpenChats");
const { useHandOver } = await import("../../../composables/useHandOver");

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
      agentUrl: (agent: AgentOptionData) => `/?agent=${agent.id}`,
      newAgentUrl: (agentId: string) => `/?agent=${agentId}`,
    },
  });
}

describe("ChatTabs", () => {
  beforeEach(() => {
    visited.length = 0;
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

  it("switches to another chat by its tab and with the arrow keys", async () => {
    useOpenChats("user-tabs").open("agent-3");
    const tabs = tabsFor("agent-2");

    await tabs.get('[data-chat-tab="agent-3"]').trigger("click");
    await tabs.get('[data-chat-tab="agent-2"]').trigger("keydown", { key: "ArrowRight" });

    expect(visited).toEqual(["/?agent=agent-3", "/?agent=agent-3"]);
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

  it("opens a new chat as a tab and hands its first message to the new agent's chat", async () => {
    const tabs = tabsFor("agent-2");

    await tabs.get("[data-new-chat-tab]").trigger("click");
    tabs.findComponent({ name: "CreateChatForm" }).vm.$emit("created", "agent-4", "Write the tests");
    await flushPromises();

    expect(useOpenChats("user-tabs").chats.agentIds).toContain("agent-4");
    expect(useHandOver().takeFor("agent-4")).toEqual({ agentId: "agent-4", text: "Write the tests" });
    expect(visited).toEqual(["/?agent=agent-4"]);
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
