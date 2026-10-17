import {expect, test} from "vitest";
import {countWords, readingLines, standingLines, waitingWords} from "../src/domain/workflowStanding.js";

const standing = {
    agents: [
        {n: 3, session: "s1", node: 12, port: "no", waits: true, counts: {reminders: 2}, readings: {uses: 7}},
        {n: 4, session: "s2", node: 9, port: "then", waits: false, counts: {}, readings: {uses: 1}},
    ],
    readings: {uses: "Tool uses since the newest unread message came."},
    limits: {12: {number: 5, setting: "Hold the write after"}},
};

test("a node an agent waits at says so, and how many when several", () => {
    expect(waitingWords(standing, 12)).toBe("Waiting here");
    expect(waitingWords(standing, 9)).toBe("");
    expect(waitingWords({agents: [standing.agents[0], {...standing.agents[0], n: 5}]}, 12)).toBe("2 agents waiting here");
});

test("a count check says its count against its number, a reading too", () => {
    expect(countWords(standing, {id: 9, text: "reminders 3"})).toBe("reminders 2 of 3");
    expect(countWords(standing, {id: 12, text: "uses messages.hold_after"})).toBe("uses 7 of 5");
    expect(countWords({agents: standing.agents}, {id: 12, text: "uses messages.hold_after"})).toBe("uses 7");
    expect(countWords(standing, {id: 12, text: "missing 3"})).toBe("");
});

test("the side panel lists each waiting agent's counts and what a reading counts", () => {
    expect(standingLines(standing, 12)).toEqual([{label: "Agent 3", words: "reminders 2, uses 7"}]);
    expect(readingLines(standing)).toEqual([{label: "uses, a reading", words: "Tool uses since the newest unread message came."}]);
});
