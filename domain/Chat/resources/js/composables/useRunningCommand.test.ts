import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { effectScope, nextTick, ref } from "vue";
import type { EffectScope } from "vue";
import { notifyRunningCommand, type RunningCommandData } from "@kit/runningCommands";
import {
  COMMAND_LINGER_MS,
  RUNNING_COMMAND_GAP_MS,
  useRunningCommand,
} from "./useRunningCommand";

const START = Date.parse("2026-11-28T10:00:00.000Z");

/**
 * A change of the agent's row at the given milliseconds after the start, as the server writes its time.
 */
function change(
  atMs: number,
  line: string | null,
  isRunning = true,
  agentId = "planner",
): RunningCommandData {
  const changedAt = new Date(START + atMs).toISOString().replace("Z", "000Z");

  return { agentId, line, isRunning, changedAt };
}

let scope: EffectScope;

function follow(seed: RunningCommandData | null = null) {
  const agentId = ref("planner");
  const inboxId = ref("chat-1");
  const seeded = ref<RunningCommandData | null>(seed);
  scope = effectScope();
  const shown = scope.run(() => useRunningCommand(agentId, inboxId, seeded));

  if (shown === undefined) {
    throw new Error("The scope ran nothing.");
  }

  return { ...shown, agentId, inboxId, seeded };
}

function at(ms: number): void {
  vi.setSystemTime(START + ms);
}

describe("useRunningCommand", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    at(0);
  });

  afterEach(() => {
    scope.stop();
    vi.useRealTimers();
  });

  it("shows a command at once after a quiet spell", () => {
    const { line, held } = follow();

    notifyRunningCommand(change(0, "Bash npm test"));

    expect([line.value, held.value]).toEqual(["Bash npm test", true]);
  });

  it("shows the newest of a burst once the gap has passed, and none in between", () => {
    const { line } = follow();
    const shown: Array<string | null> = [];

    notifyRunningCommand(change(0, "Bash one"));
    shown.push(line.value);

    for (const [ms, text] of [[60, "Bash two"], [120, "Bash three"], [180, "Bash four"], [240, "Bash five"]] as const) {
      vi.advanceTimersByTime(60);
      notifyRunningCommand(change(ms, text));
      shown.push(line.value);
    }

    vi.advanceTimersByTime(RUNNING_COMMAND_GAP_MS);

    expect(shown).toEqual(["Bash one", "Bash one", "Bash one", "Bash one", "Bash one"]);
    expect(line.value).toBe("Bash five");
  });

  it("keeps a finished command for the linger, then gives way to the idle word", () => {
    const { line, held } = follow();
    notifyRunningCommand(change(0, "Bash npm test"));
    vi.advanceTimersByTime(1000);
    notifyRunningCommand(change(1000, "Bash npm test", false));

    vi.advanceTimersByTime(COMMAND_LINGER_MS - 1);
    expect(line.value).toBe("Bash npm test");
    vi.advanceTimersByTime(1);

    expect([line.value, held.value]).toEqual([null, true]);
  });

  it("clears the line and greys the dot at once on a new turn", () => {
    const { line, held } = follow();
    notifyRunningCommand(change(0, "Bash npm test"));
    vi.advanceTimersByTime(100);

    notifyRunningCommand(change(100, null, false));

    expect([line.value, held.value]).toEqual([null, false]);
  });

  it("drops a change older than the newest applied and applies an equal one once", () => {
    const { line } = follow();
    notifyRunningCommand(change(1000, "Bash newer"));
    vi.advanceTimersByTime(2000);

    notifyRunningCommand(change(500, "Bash older"));
    notifyRunningCommand(change(1000, "Bash same time"));

    expect(line.value).toBe("Bash newer");
  });

  it("ignores the changes of another agent", () => {
    const { line } = follow();

    notifyRunningCommand(change(0, "Bash elsewhere", true, "coder"));

    expect(line.value).toBeNull();
  });

  it("starts from the seed, whose finish lingers only for the time left, and a seed over the linger shows idle", async () => {
    at(2000);
    const { line, seeded } = follow(change(0, "Bash npm test", false));
    expect(line.value).toBe("Bash npm test");
    vi.advanceTimersByTime(COMMAND_LINGER_MS - 2000);
    expect(line.value).toBeNull();

    at(20_000);
    seeded.value = change(10_000, "Bash build", false);
    await nextTick();

    expect(line.value).toBeNull();
  });

  it("keeps a newer notice when a page read returns an older seed", async () => {
    const { line, seeded } = follow(change(0, "Bash first"));
    at(1000);
    notifyRunningCommand(change(1000, "Bash second"));

    seeded.value = change(0, "Bash first");
    await nextTick();

    expect(line.value).toBe("Bash second");
  });

  it("forgets what it applied for another agent or chat and starts from the seed", async () => {
    const { line, agentId, seeded } = follow(change(0, "Bash planner's"));

    seeded.value = change(-1000, "Bash coder's", true, "coder");
    agentId.value = "coder";
    await nextTick();

    expect(line.value).toBe("Bash coder's");
  });

  it("stops its timers and listening when its scope ends", () => {
    const { line } = follow();
    notifyRunningCommand(change(0, "Bash npm test", false));
    scope.stop();

    vi.advanceTimersByTime(COMMAND_LINGER_MS);
    notifyRunningCommand(change(10_000, "Bash later"));

    expect(line.value).toBe("Bash npm test");
  });
});
