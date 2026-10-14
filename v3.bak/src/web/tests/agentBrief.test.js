import {expect, test} from "vitest";
import {briefOf, chatTurns, fromMainAgent} from "../src/domain/transcript.js";

const entries = [
    {line: 1, kind: "human", text: "Read the router and report", at: 100, tools: []},
    {line: 2, kind: "agent", text: "On it", at: 101, tools: []},
    {line: 3, kind: "human", text: "Also check the tests", at: 120, tools: []},
];

test("a subagent's first user line is the brief from the main agent and later ones are its messages", () => {
    expect(briefOf(entries)).toEqual({text: "Read the router and report", at: 100});
    const turns = fromMainAgent(chatTurns(entries));
    expect(turns.map((t) => [t.who, t.data.from_main || false, t.data.opening || false])).toEqual([
        ["user", true, true],
        ["agent", false, false],
        ["user", true, false],
    ]);
});
