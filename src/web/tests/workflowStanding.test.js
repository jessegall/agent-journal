import {expect, test} from "vitest";
import {countWords, standingLines, valueLines, valueWords, waitingWords} from "../src/domain/workflowStanding.js";

const standing = {
    agents: [
        {n: 3, session: "s1", node: 12, port: "no", waits: true, counts: {reminders: 2}, times: {}},
        {n: 4, session: "s2", node: 9, port: "then", waits: false, counts: {}, times: {}},
    ],
    values: [
        {name: "reminders", kind: "count", value: 2, set_at: "", set_by: [7]},
        {name: "last_tool_use", kind: "time", value: 300, set_at: "", set_by: [4, 5]},
    ],
    limits: {12: {number: 5, setting: "Hold the write after"}},
};

test("a node an agent waits at says so, and how many when several", () => {
    expect(waitingWords(standing, 12)).toBe("Waiting here");
    expect(waitingWords(standing, 9)).toBe("");
    expect(waitingWords({agents: [standing.agents[0], {...standing.agents[0], n: 5}]}, 12)).toBe("2 agents waiting here");
});

test("a count check says the environment's count against its number", () => {
    expect(countWords(standing, {id: 9, text: "reminders 3"})).toBe("reminders 2 of 3");
    expect(countWords(standing, {id: 12, text: "reminders messages.hold_after"})).toBe("reminders 2 of 5");
    expect(countWords(standing, {id: 12, text: "missing 3"})).toBe("");
    expect(countWords({agents: []}, {id: 9, text: "reminders 3"})).toBe("", "with no values served, nothing is said");
});

test("a value reads as words, a time by how long ago it was noted, with the steps that set it", () => {
    expect(standing.values.map(valueWords)).toEqual(["reminders 2", "last tool use noted 5 min ago"]);
    expect(valueLines(standing, {text: "last_tool_use 15 minutes"})).toEqual([{label: "Value now", words: "last tool use noted 5 min ago, by step 4 or 5"}]);
    expect(valueLines(standing, {text: "nothing"})).toEqual([]);
});

test("the side panel lists each agent waiting at a step", () => {
    expect(standingLines(standing, 12)).toEqual([{label: "Agent 3", words: "waits here"}]);
});
