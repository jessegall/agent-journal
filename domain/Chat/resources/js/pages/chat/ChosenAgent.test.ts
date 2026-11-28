// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { AgentOptionData, ChatData } from "@generated/types/chat";

vi.mock("@inertiajs/vue3", () => ({
  usePage: () => ({ url: "/", props: { drivers: [], viewer: { id: "user-1" } } }),
  router: { reload: () => undefined },
}));
vi.mock("./partials/ChatTabs.vue", () => ({ default: { name: "ChatTabs", template: "<div data-chat-tabs />" } }));

const { default: ChosenAgent } = await import("./ChosenAgent.vue");

function chatWith(agent: Partial<AgentOptionData>, isSetupRequired = false): ChatData {
  return {
    agents: [
      {
        id: "agent-1",
        name: "Main agent",
        status: { sessionState: "idle", label: "Idle", actions: [] },
        ...agent,
      },
    ],
    selectedAgentId: "agent-1",
    mainAgentId: "agent-1",
    isSetupRequired,
  } as unknown as ChatData;
}

describe("ChosenAgent", () => {
  it("is the chat bar's tabs alone: no agent picker, status or session actions of its own", () => {
    const bar = mount(ChosenAgent, { props: { data: chatWith({}) } });

    expect(bar.find("[data-chat-tabs]").exists()).toBe(true);
    expect(bar.find("[data-chat-list-trigger]").exists()).toBe(false);
    expect(bar.text()).not.toContain("Main agent");
    expect(bar.text()).not.toContain("Idle");
  });

  it("says when the installation has no main agent yet", () => {
    const bar = mount(ChosenAgent, { props: { data: chatWith({}, true) } });

    expect(bar.text()).toContain("No main agent yet");
  });
});
