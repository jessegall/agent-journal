import { describe, expect, it } from "vitest";
import { ACTING_AGENT, groupTurns } from "./chatTurns";

type Row = { name: string; turn: string | null; day?: boolean };

const grouped = (rows: Row[]) =>
  groupTurns(
    rows,
    (row) => row.turn,
    (row) => row.day === true,
  ).map((group) => group.map((row) => row.name));

describe("groupTurns", () => {
  it("keeps the rows of one agent turn together, with the rows of whichever agent is acting", () => {
    expect(
      grouped([
        { name: "mine", turn: null },
        { name: "step", turn: ACTING_AGENT },
        { name: "answer", turn: "agent:1" },
        { name: "card", turn: ACTING_AGENT },
        { name: "mine-again", turn: null },
      ]),
    ).toEqual([["mine"], ["step", "answer", "card"], ["mine-again"]]);
  });

  it("starts a new group when another agent speaks or a new day begins", () => {
    expect(
      grouped([
        { name: "one", turn: "agent:1" },
        { name: "two", turn: "agent:2" },
        { name: "two-later", turn: "agent:2" },
        { name: "two-next-day", turn: "agent:2", day: true },
      ]),
    ).toEqual([["one"], ["two", "two-later"], ["two-next-day"]]);
  });
});
