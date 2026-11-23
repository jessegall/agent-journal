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
    retired: false,
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
  it("lists idle agents, announces the chosen one and chooses another by keyboard", async () => {
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
    const options = picker.findAll('[role="option"]');

    expect(
      options.map((option) =>
        option.findAll("span").map((part) => part.text()),
      ),
    ).toEqual([
      ["Main agent", "Idle"],
      ["Reviewer", "Working"],
    ]);
    expect(options[0].attributes("aria-selected")).toBe("true");
    expect(options[0].attributes("tabindex")).toBe("0");
    expect(picker.find('[aria-live="polite"]').text()).toBe("Main agent, Idle");

    await options[0].trigger("keydown", { key: "ArrowRight" });
    expect(document.activeElement).toBe(options[1].element);
    await options[1].trigger("keydown", { key: "Enter" });

    expect(visited).toEqual(["/?agent=helper"]);
    picker.unmount();
  });
});
