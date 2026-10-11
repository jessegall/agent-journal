import {describe, expect, it} from "vitest";
import {store} from "../src/state/store.js";
import {factOf, neverMatched, plain, saysWhat, sentence, unitOf} from "../src/domain/triggerWords.js";

const FACTS = [
    {
        value: "message.unread",
        label: "A message of yours has not been read",
        phrase: "a message of yours has gone unread for more than {over} minutes",
        unit: "minutes",
        fills: ["n", "title", "minutes"],
    },
    {
        value: "message.unanswered",
        label: "A message of yours was read but not answered",
        phrase: "a message of yours has been read but left unanswered for more than {over} minutes",
        unit: "minutes",
    },
    {
        value: "agent.context",
        label: "The agent's context is getting full",
        phrase: "the agent's context is more than {over} percent full",
        unit: "percent",
        fills: ["title", "percent"],
    },
    {
        value: "todo.ready",
        label: "To-dos are ready and no work is open",
        phrase: "at least {over} to-dos are ready and no work is open",
        unit: "count",
    },
];
store.spec = {facts: FACTS};

describe("what a fact gives a wording to say", () => {
    it("offers only the placeholders that fact will fill, in the user's words", () => {
        expect(saysWhat(factOf("agent.context"))).toBe("{{title}} for its title, {{percent}} for how full");
        expect(saysWhat(factOf("message.unread"))).toBe("{{n}} for its number, {{title}} for its title, {{minutes}} for how many minutes");
    });
});

describe("a trigger that has never matched", () => {
    it("names the half that is still empty rather than stopping at never", () => {
        expect(neverMatched({when: "state", only_when: "idle"})).toBe("Never matched. It only watches while the agent is idle.");
        expect(neverMatched({when: "state", only_when: "working"})).toBe("Never matched. It only watches while the agent is working.");
        expect(neverMatched({when: "state", only_when: "any"})).toBe("Never matched. What it watches for has not been true yet.");
        expect(neverMatched({when: "words", only_when: "idle"})).toBe(
            "Never matched. Nothing the agent wrote or ran has carried these words yet."
        );
    });
});

describe("the facts a trigger can watch", () => {
    it("are the ones the server sent, and an unknown one reads as the first", () => {
        expect(factOf("agent.context")).toBe(store.spec.facts[2]);
        expect(factOf("nothing.of.the.kind")).toBe(store.spec.facts[0]);
    });

    it("count in the word that follows the number in their phrase", () => {
        expect(FACTS.map(unitOf)).toEqual(["minutes", "minutes", "percent", "to-dos"]);
    });
});

describe("the sentence a trigger on a fact reads as", () => {
    const state = {
        when: "state",
        fact: "message.unanswered",
        over: 5,
        only_when: "idle",
        does: "nudge",
        text: "Answer it",
        timing: 15,
        most: 3,
        words: [],
    };

    it("names the fact, the gate, the action and how often it repeats", () => {
        expect(plain(sentence(state, []))).toBe(
            "When a message of yours has been read but left unanswered for more than 5 minutes while the agent is idle, remind the agent “Answer it”. It says so again every 15 minutes, at most 3 times for each."
        );
    });

    it("says a hold lasts until the fact stops being true", () => {
        expect(plain(sentence({...state, does: "hold", timing: 0}, []))).toContain("hold the agent's writes until that stops being true");
    });
});
