// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { AgentOptionData } from "@generated/types/chat";

vi.mock("@inertiajs/vue3", () => ({
  usePage: () => ({ url: "/", props: { drivers: [], viewer: { id: "user-row" } } }),
  router: { reload: () => undefined },
}));
vi.mock("./AgentSessionActions.vue", () => ({ default: { template: "<div data-session-actions />" } }));
vi.mock("./RunningCommand.vue", () => ({ default: { template: "<p data-running-strip>thinking</p>" } }));

const { default: AgentRow } = await import("./AgentRow.vue");

function agentWith(facts: Partial<AgentOptionData> = {}): AgentOptionData {
  return {
    id: "agent-1",
    name: "Agent 1",
    isMain: true,
    isRetired: false,
    sessionId: "session-1",
    sessionGeneration: 1,
    sessionDriver: "claude-code",
    sessionModel: "opus",
    sessionEffort: "high",
    hasTerminal: false,
    waitsOnYou: false,
    unreadCount: 0,
    lastActiveAt: null,
    status: { sessionState: "working", label: "Working", actions: [] },
    ...facts,
  } as unknown as AgentOptionData;
}

function rowOf(agent: AgentOptionData) {
  return mount(AgentRow, { props: { agent, agents: [agent], inboxId: "chat-1", seed: null } });
}

describe("AgentRow", () => {
  it("names the agent above the composer: what it does on the left, its name, state, model and effort on the right", () => {
    const row = rowOf(agentWith());
    const chip = row.get('[data-agent-chip="agent-1"]');

    expect(row.find("[data-running-strip]").exists()).toBe(true);
    expect(chip.text()).toContain("Agent 1 · main");
    expect(chip.text()).toContain("Working");
    expect(row.get("[data-agent-settings]").text()).toBe("opus · high");
  });

  it("names a helper by its name alone and shows no settings for an agent with no session", () => {
    const row = rowOf(agentWith({ isMain: false, name: "Reviewer", sessionModel: null, sessionEffort: null }));

    expect(row.get('[data-agent-chip="agent-1"]').text()).toContain("Reviewer");
    expect(row.get('[data-agent-chip="agent-1"]').text()).not.toContain("· main");
    expect(row.find("[data-agent-settings]").exists()).toBe(false);
  });

  it("opens the chat list with the agent's actions from its name", async () => {
    const row = rowOf(agentWith());

    await row.get("[data-chat-list-trigger]").trigger("click");
    await flushPromises();

    expect(row.get("[data-chat-list-trigger]").attributes("aria-expanded")).toBe("true");
  });
});
