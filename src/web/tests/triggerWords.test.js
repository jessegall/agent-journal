import {describe, expect, it} from "vitest";
import {store} from "../src/state/store.js";
import {doesOf, sentence, startWords, startedBy, wordsText} from "../src/domain/triggerWords.js";

const trigger = (more = {}) => ({table: "triggers", id: 3, words: ["force push"], action: "deny", text: "Never force-push", ...more});

describe("the words a trigger watches", () => {
    it("are quoted, joined with or, and the rest counted", () => {
        expect(wordsText(["a"])).toBe("“a”");
        expect(wordsText(["a", "b"])).toBe("“a” or “b”");
        expect(wordsText(["a", "b", "c", "d", "e"])).toBe("“a”, “b”, “c” or 2 other phrases");
    });
});

describe("the sentence a trigger reads as", () => {
    it("names the words and what happens", () => {
        expect(sentence(trigger())).toBe("When “force push” comes up, block it and tell the agent “Never force-push”.");
        expect(sentence(trigger({action: "sequence", text: "Release"}))).toBe("When “force push” comes up, start the sequence “Release”.");
    });

    it("asks for words while it has none", () => {
        expect(sentence(trigger({words: []}))).toBe("Add the words to watch for and choose what happens.");
    });

    it("an unknown action reads as a reminder", () => {
        expect(doesOf("nothing").value).toBe("nudge");
    });
});

describe("when a sequence starts", () => {
    it("by a trigger, by a row being created, or only by hand", () => {
        store.rows = {triggers: [trigger()], sequences: [{table: "sequences", id: 1, title: "Release", starts_on: "", trigger_ids: [3]}]};
        expect(startedBy(3).map((s) => s.id)).toEqual([1]);
        expect(startWords(store.rows.sequences[0])).toBe("When the trigger on “force push” matches");
        expect(startWords({starts_on: "tasks.created", trigger_ids: []})).toBe("When a task is created");
        expect(startWords({starts_on: "", trigger_ids: []})).toBe("Only when you or the agent start it");
    });
});
