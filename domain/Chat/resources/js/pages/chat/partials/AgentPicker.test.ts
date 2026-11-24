// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { AgentOptionData } from "@generated/types/chat";

const visited: string[] = [];

vi.mock("@inertiajs/vue3", () => ({
  router: { visit: (url: string) => visited.push(url) },
}));

const { default: AgentPicker } = await import("./AgentPicker.vue");

function agent(
  id: string,
  name: string,
  presenceLabel: string,
): AgentOptionData {
  return {
    id,
    name,
    profileKey: "journal-main",
    isRetired: false,
    presence: presenceLabel === "Working" ? "working" : "idle",
    presenceLabel,
    sessionId: null,
    sessionGeneration: 0,
    hasTerminal: false,
    switchId: null,
    switchStage: null,
    switchStageLabel: null,
    isSwitchOver: true,
    actions: ["start"],
    conversations: [],
    startRefusal: null,
    sessionDriver: null,
    sessionDriverLabel: null,
    sessionModel: null,
    needsAttention: false,
    status: {
      sessionState: presenceLabel === "Working" ? "working" : "idle",
      isStartRefused: false,
      label: presenceLabel,
      reason: null,
      remedy: null,
      operation: null,
      commandOutcome: null,
      observationAgeSeconds: null,
      actions: [{ type: "start", label: "Start session" }],
      isProcessConfirmed: false,
    },
  };
}

describe("AgentPicker", () => {
  it("lists idle agents, announces the chosen one and opens the chat of another", async () => {
    const picker = mount(AgentPicker, {
      attachTo: document.body,
      props: {
        agents: [
          agent("main", "Main agent", "Idle"),
          agent("helper", "Reviewer", "Working"),
        ],
        selectedAgentId: "main",
        agentUrl: (chosen: AgentOptionData) => `/?agent=${chosen.id}`,
      },
    });
    const choice = picker.get('button[aria-haspopup="listbox"]');

    expect(choice.text()).toBe("Main agent · Idle");
    expect(picker.find('[aria-live="polite"]').text()).toBe("Main agent, Idle");

    await choice.trigger("click");
    const options = picker.findAll('[role="option"]');
    expect(options.map((option) => option.text())).toEqual([
      "Main agent · Idle",
      "Reviewer · Working",
    ]);
    await options[1].trigger("click");

    expect(visited).toEqual(["/?agent=helper"]);
    picker.unmount();
  });
});
