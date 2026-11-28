// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { AgentOptionData } from "@generated/types/chat";
import type { SessionActivityStatus } from "@kit/CoreTypes";
import RunningCommand from "./RunningCommand.vue";

function agentIn(sessionState: SessionActivityStatus): AgentOptionData {
  return { id: "agent-1", status: { sessionState } } as unknown as AgentOptionData;
}

describe("RunningCommand", () => {
  it("names the command the agent runs while it works", () => {
    const line = mount(RunningCommand, {
      props: { agent: agentIn("working"), command: "Ran npm test" },
    });

    expect(line.get("[data-running-command]").text()).toBe("Ran npm test");
  });

  it("changes its line when a newer command arrives over the live update", async () => {
    const line = mount(RunningCommand, {
      props: { agent: agentIn("working"), command: "Ran npm test" },
    });

    await line.setProps({ command: "Edited src/b.php" });

    expect(line.get("[data-running-command]").text()).toBe("Edited src/b.php");
  });

  it("shows nothing once the agent has done nothing since its last message", () => {
    const line = mount(RunningCommand, {
      props: { agent: agentIn("working"), command: null },
    });

    expect(line.find("[data-running-command]").exists()).toBe(false);
  });

  it.each(["idle", "stopped", "starting"] as const)(
    "shows nothing for a %s agent",
    (state) => {
      const line = mount(RunningCommand, {
        props: { agent: agentIn(state), command: "Ran npm test" },
      });

      expect(line.find("[data-running-command]").exists()).toBe(false);
    },
  );
});
