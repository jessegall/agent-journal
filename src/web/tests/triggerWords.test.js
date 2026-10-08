import {describe, expect, it} from "vitest";
import {plain, sentence} from "../src/domain/triggerWords.js";

describe("the sentence a trigger on a fact reads as", () => {
    const state = {when: "state", fact: "message.unanswered", over: 5, only_when: "idle", does: "nudge", text: "Answer it", timing: 15, most: 3, words: []};

    it("names the fact, the gate, the action and how often it repeats", () => {
        expect(plain(sentence(state, []))).toBe(
            "When a message of yours has been read but left unanswered for more than 5 minutes while the agent is idle, remind the agent “Answer it”. It says so again every 15 minutes, at most 3 times for each."
        );
    });

    it("says a hold lasts until the fact stops being true", () => {
        expect(plain(sentence({...state, does: "hold", timing: 0}, []))).toContain("hold the agent's writes until that stops being true");
    });
});
