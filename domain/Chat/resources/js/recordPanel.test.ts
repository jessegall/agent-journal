import { describe, expect, it } from "vitest";
import type { DockCardEnvelope } from "@kit/dockCards";
import { openedRecordOf } from "./recordPanel";

function card(id: string, finishedAt: string | null): DockCardEnvelope {
  return {
    version: 1,
    placementId: `line-${id}`,
    source: { type: "sequences.sequence-run", id },
    accessibleName: `Run ${id}`,
    safeSummary: `Run ${id}`,
    open: null,
    root: {
      type: "duration",
      key: "duration",
      startedAt: "2026-11-22T13:00:00Z",
      finishedAt,
    },
  };
}

describe("openedRecordOf", () => {
  it("opens the newest running record, keeps it shut once closed, and lets it go when it ends", () => {
    const running = card("r1", null);
    const ended = card("r1", "2026-11-22T13:05:00Z");

    expect(openedRecordOf([running], null, [])).toEqual(running);
    expect(
      openedRecordOf([running], null, ["sequences.sequence-run:r1"]),
    ).toBeNull();
    expect(openedRecordOf([running, ended], null, [])).toBeNull();
  });

  it("shows the record the user chose, as its newest card says", () => {
    const ended = card("r2", "2026-11-22T13:05:00Z");

    expect(
      openedRecordOf(
        [card("r2", null), ended],
        "sequences.sequence-run:r2",
        [],
      ),
    ).toEqual(ended);
  });
});
