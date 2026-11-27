import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AgentStatusData } from "@generated/types/chat";
import { CHECK_READ_MILLISECONDS, CHECK_WAIT_MILLISECONDS, useStatusCheck } from "./useStatusCheck";

function statusReportedSecondsAgo(age: number | null): AgentStatusData {
  return {
    sessionState: "unknown",
    isStartRefused: false,
    label: "Status unknown",
    reason: null,
    remedy: null,
    commandOutcome: null,
    observationAgeSeconds: age,
    actions: [],
    isProcessConfirmed: false,
  };
}

describe("useStatusCheck", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("ends with no word once the host reported after the ask", () => {
    let status = statusReportedSecondsAgo(300);
    const check = useStatusCheck(
      () => status,
      (done) => {
        status = statusReportedSecondsAgo(0);
        done();
      },
    );
    const end = vi.fn();

    check.follow(Date.now(), end);
    vi.advanceTimersByTime(CHECK_READ_MILLISECONDS);

    expect(end).toHaveBeenCalledWith(null);
  });

  it("ends after its wait with the last report time when the host stays silent", () => {
    const status = statusReportedSecondsAgo(300);
    const check = useStatusCheck(
      () => status,
      (done) => done(),
    );
    const end = vi.fn();

    check.follow(Date.now(), end);
    vi.advanceTimersByTime(CHECK_WAIT_MILLISECONDS + CHECK_READ_MILLISECONDS);

    expect(end).toHaveBeenCalledTimes(1);
    expect(end.mock.calls[0][0]).toContain("300");
  });
});
