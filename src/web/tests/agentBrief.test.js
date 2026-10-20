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

test("a transcript line carries its words as text, which the chat bubble reads", () => {
    const [line] = chatTurns([{line: 13, who: "agent", kind: "agent", at: 1, tools: [], text: "I will inspect the journal first.", has_text: true}]);
    expect(line.type).toBe("line");
    expect(line.kind).toBe("message");
    expect(line.text).toBe("I will inspect the journal first.");
});

test("a run of tool calls between spoken turns is one card, which the chat draws as a mark and not as an empty bubble", () => {
    const turns = chatTurns([
        {line: 1, who: "agent", kind: "agent", at: 1, tools: [], text: "Looking.", has_text: true},
        {line: 2, who: "agent", kind: "agent", at: 2, tools: ["exec"], text: "", has_text: false},
        {line: 3, who: "tool", kind: "tool", at: 3, tools: [], text: "", has_text: true},
        {line: 4, who: "agent", kind: "agent", at: 4, tools: ["exec"], text: "", has_text: false},
        {line: 5, who: "agent", kind: "agent", at: 5, tools: [], text: "Found it.", has_text: true},
    ]);
    expect(turns.map((t) => t.kind)).toEqual(["message", "card", "message"]);
    expect(turns[1].data.label).toBe("Used exec ×2");
});
