// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { AgentOptionData, ChatData } from "@generated/types/chat";

vi.mock("@inertiajs/vue3", () => ({
  usePage: () => ({ url: "/", props: { drivers: [], viewer: { id: "user-1" } } }),
  router: { visit: () => undefined },
}));
vi.mock("./partials/AgentSessionActions.vue", () => ({ default: { template: "<div />" } }));

const { default: ChosenAgent } = await import("./ChosenAgent.vue");

function chatWith(agent: Partial<AgentOptionData>): ChatData {
  return {
    agents: [
      {
        id: "agent-1",
        name: "Main agent",
        profileKey: "main-agent",
        sessionDriver: null,
        sessionDriverLabel: null,
        sessionModel: null,
        status: { sessionState: "idle", label: "Idle", actions: [] },
        isMain: false,
        isRetired: false,
        waitsOnYou: false,
        unreadCount: 0,
        lastActiveAt: null,
        ...agent,
      },
    ],
    selectedAgentId: "agent-1",
    mainAgentId: "agent-1",
    isSetupRequired: false,
  } as unknown as ChatData;
}

describe("ChosenAgent", () => {
  it("names the profile an agent starts from while it rests", () => {
    const bar = mount(ChosenAgent, { props: { data: chatWith({}) } });

    expect(bar.find("small").text()).toBe("main-agent");
  });

  it("names the driver and model of a running session", () => {
    const bar = mount(ChosenAgent, {
      props: { data: chatWith({ sessionDriverLabel: "Claude Code", sessionModel: "opus" }) },
    });

    expect(bar.find("small").text()).toBe("Claude Code · opus");
  });

  it("names an agent whose role is main as main, and any other by its name alone", () => {
    const main = mount(ChosenAgent, { props: { data: chatWith({ isMain: true }) } });
    const helper = mount(ChosenAgent, { props: { data: chatWith({ name: "Reviewer" }) } });

    expect(main.text()).toContain("Main agent · main");
    expect(helper.text()).toContain("Reviewer");
    expect(helper.text()).not.toContain("· main");
  });

  it("opens the one chat list from the agent's name, with no members or add-someone button", () => {
    const bar = mount(ChosenAgent, { props: { data: chatWith({}) } });

    expect(bar.findAll("[data-chat-list-trigger]")).toHaveLength(1);
    expect(bar.find("#agent-bar-members").exists()).toBe(false);
  });
});
