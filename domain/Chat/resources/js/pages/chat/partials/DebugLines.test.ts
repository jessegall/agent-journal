// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { AgentLogLineData } from "@generated/types/chat";
import DebugLines from "./DebugLines.vue";

const KINDS: Array<[AgentLogLineData["type"], string, boolean]> = [
  ["start-asked", "Start asked", false],
  ["start-refused", "Start refused", true],
  ["start-ended", "Session ended", false],
  ["process-started", "Process started", false],
  ["process-ended", "Process ended", false],
  ["process-failed", "Process failed", true],
  ["woke", "Woke", false],
  ["wake-failed", "Wake failed", true],
  ["turn-opened", "Turn opened", false],
  ["turn-failed", "Turn failed", true],
  ["retrying", "Retrying", false],
  ["gave-up", "Gave up", true],
];

function lineOf(type: AgentLogLineData["type"], title: string, isFailure: boolean): AgentLogLineData {
  return {
    id: `line-${type}`,
    at: "2026-11-28T14:31:05+00:00",
    type,
    title,
    detail: isFailure ? "Claude Code refused the sign-in" : "Agent terminal · 0.9 s",
    isFailure,
    reason: isFailure ? "Claude Code refused the sign-in" : null,
    evidence: isFailure ? "exit code 1" : null,
  };
}

describe("DebugLines", () => {
  it("keeps the lines folded into one small icon until it is pressed, red when a step failed", async () => {
    const lines = mount(DebugLines, {
      props: { lines: [lineOf("woke", "Woke", false), lineOf("wake-failed", "Wake failed", true)] },
    });

    expect(lines.find("[data-debug-line]").exists()).toBe(false);
    expect(lines.get("[data-debug-toggle]").classes()).toContain("text-danger");
    await lines.get("[data-debug-toggle]").trigger("click");

    expect(lines.findAll("[data-debug-line]")).toHaveLength(2);
  });

  it.each(KINDS)("shows a %s line quietly with its words and detail, a failure in red", async (type, title, isFailure) => {
    const lines = mount(DebugLines, { props: { lines: [lineOf(type, title, isFailure)] } });
    await lines.get("[data-debug-toggle]").trigger("click");
    const line = lines.get(`[data-debug-line="${type}"]`);

    expect(line.text()).toContain(title);
    expect(line.classes()).toContain(isFailure ? "text-danger" : "text-text-4");
  });

  it("opens Technical details at the line pressed, and shows nothing with no line", async () => {
    const lines = mount(DebugLines, { props: { lines: [lineOf("wake-failed", "Wake failed", true)] } });
    await lines.get("[data-debug-toggle]").trigger("click");

    await lines.get("[data-debug-line]").trigger("click");

    expect(lines.emitted("open")).toEqual([["line-wake-failed"]]);
    expect(mount(DebugLines, { props: { lines: [] } }).find("[data-debug-lines]").exists()).toBe(false);
  });
});
