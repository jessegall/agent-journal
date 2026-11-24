// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { AgentOptionData, ChatData } from "@generated/types/chat";

vi.mock("@inertiajs/vue3", () => ({ usePage: () => ({ url: "/" }) }));
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
        status: undefined,
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

  it("keeps a place right after the agent for the chat's members", () => {
    const bar = mount(ChosenAgent, { props: { data: chatWith({}) } });

    expect(bar.find("#agent-bar-members").exists()).toBe(true);
  });
});
