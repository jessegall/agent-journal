// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { AgentLogData } from "@generated/types/chat";

const reads: Array<{ agent: string }> = [];
const log: AgentLogData = {
  agentId: "agent-1",
  starts: [
    {
      sessionId: "session-2",
      startedAt: "2026-11-28T14:31:00+00:00",
      outcome: "Failed",
      hasFailed: true,
      lines: [
        {
          id: "refused-1",
          at: "2026-11-28T14:31:20+00:00",
          type: "start-refused",
          title: "Start refused",
          detail: "Claude Code refused the sign-in of Work (Max)",
          isFailure: true,
          reason: "Claude Code refused the sign-in of Work (Max)",
          evidence: "start start-1 · account claude-code",
        },
        {
          id: "asked-1",
          at: "2026-11-28T14:31:00+00:00",
          type: "start-asked",
          title: "Start asked",
          detail: "/work",
          isFailure: false,
          reason: null,
          evidence: null,
        },
      ],
    },
    { sessionId: "session-1", startedAt: "2026-11-28T11:20:00+00:00", outcome: "Ended at 11:40", hasFailed: false, lines: [] },
  ],
};

vi.mock("@kit/loaders", () => ({
  chatAgentLog: { key: "agent-log" },
  LoaderCancelled: class extends Error {},
  load: (_loader: unknown, input: { agent: string }) => {
    reads.push(input);

    return Promise.resolve({ status: "ok", value: log });
  },
}));

const { default: AgentLogPanel } = await import("./AgentLogPanel.vue");

async function panelAt(openedAt: string | null) {
  const panel = mount(AgentLogPanel, { props: { agentId: "agent-1", agentName: "Agent 1", openedAt } });
  await flushPromises();

  return panel;
}

describe("AgentLogPanel", () => {
  it("reads the agent's log once opened and shows its starts newest first, each with its outcome", async () => {
    const panel = await panelAt(null);

    expect(reads).toEqual([{ agent: "agent-1" }]);
    expect(panel.text()).toContain("Technical details · Agent 1 · newest first");
    expect(panel.findAll("[data-log-start]").map((start) => start.attributes("data-log-start"))).toEqual([
      "session-2",
      "session-1",
    ]);
    expect(panel.get('[data-log-start="session-2"]').text()).toContain("Failed");
  });

  it("opens at the line it was opened from, with the failure's reason and evidence to copy", async () => {
    const panel = await panelAt("refused-1");
    const evidence = panel.get("[data-log-evidence]");

    expect(evidence.text()).toContain("Claude Code refused the sign-in of Work (Max)");
    expect(evidence.text()).toContain("start start-1");
    expect(evidence.find("[data-copy-evidence]").exists()).toBe(true);
  });

  it("filters to the failures with their count, and Escape closes it", async () => {
    const panel = await panelAt(null);

    expect(panel.get('[data-log-filter="failures"]').text()).toContain("1");
    await panel.get('[data-log-filter="failures"]').trigger("click");
    expect(panel.find('[data-log-line="asked-1"]').exists()).toBe(false);
    expect(panel.find('[data-log-line="refused-1"]').exists()).toBe(true);

    await panel.get("[data-agent-log]").trigger("keydown", { key: "Escape" });
    expect(panel.emitted("close")).toHaveLength(1);
  });
});
