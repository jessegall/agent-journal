// @vitest-environment happy-dom
import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import type { RunningCommandData } from "@generated/types/core";
import type { SessionActivityStatus } from "@kit/CoreTypes";
import { notifyRunningCommand } from "@kit/runningCommands";
import { RUNNING_COMMAND_GAP_MS } from "../../../composables/useRunningCommand";
import RunningCommand from "./RunningCommand.vue";

function agentIn(sessionState: SessionActivityStatus): AgentOptionData {
  return { id: "agent-1", status: { sessionState } } as unknown as AgentOptionData;
}

function running(line: string | null, changedAt = new Date().toISOString()): RunningCommandData {
  return { agentId: "agent-1", line, isRunning: line !== null, changedAt };
}

function mountStrip(sessionState: SessionActivityStatus = "working", seed: RunningCommandData | null = null) {
  return mount(RunningCommand, {
    props: { agent: agentIn(sessionState), inboxId: "chat-1", seed },
  });
}

enableAutoUnmount(afterEach);

describe("RunningCommand", () => {
  it("names the seeded command with its full text as the title and a held dot", () => {
    const strip = mountStrip("working", running("Bash npm test"));

    const line = strip.get("[data-running-line]");
    expect([line.text(), line.attributes("title")]).toEqual(["Bash npm test", "Bash npm test"]);
    expect(line.classes()).toContain("truncate");
    expect(strip.get("[data-running-dot]").attributes("data-held")).toBe("true");
  });

  it.each([
    ["working", "thinking"],
    ["idle", "idle"],
  ] as const)("shows the idle word of a %s agent with no command, and a grey dot", (state, word) => {
    const strip = mountStrip(state);

    expect(strip.get("[data-running-idle]").text()).toBe(word);
    expect(strip.find("[data-running-line]").exists()).toBe(false);
    expect(strip.get("[data-running-dot]").attributes("data-held")).toBe("false");
  });

  it("rolls in a new text and keeps the same element for the same text again", async () => {
    vi.useFakeTimers();
    const strip = mountStrip();
    notifyRunningCommand(running("Bash npm test", "2026-11-28T10:00:00.000000Z"));
    await nextTick();
    const first = strip.get("[data-running-line]").element;

    vi.advanceTimersByTime(RUNNING_COMMAND_GAP_MS);
    notifyRunningCommand(running("Bash npm test", "2026-11-28T10:00:01.000000Z"));
    await nextTick();
    expect(strip.get("[data-running-line]").element).toBe(first);

    vi.advanceTimersByTime(RUNNING_COMMAND_GAP_MS);
    notifyRunningCommand(running("Bash npm run build", "2026-11-28T10:00:02.000000Z"));
    await nextTick();
    expect(strip.get("[data-running-line]").element).not.toBe(first);
    expect(strip.get("[data-running-line]").text()).toBe("Bash npm run build");
    vi.useRealTimers();
  });
});
