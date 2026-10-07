import {describe, expect, test} from "vitest";
import {aboutLines, linesWord} from "../src/format/quote.js";
import {fileSize} from "../src/format/files.js";
import {needsOf, waitsOf} from "../src/phone/places/journals.js";
import {dotOf, linesOf} from "../src/phone/places/rowLines.js";
import {holding, LOOSE, onShelf} from "../src/phone/places/shelves.js";

const PLAN = {one: "Plan"};
const plan = {
    type: "plan",
    n: 3,
    created: 0,
    completed: 0,
    data: {
        status: "active",
        current: 2,
        phases: [
            {title: "Seed", todos: [1]},
            {title: "Water", todos: [2, 3]},
        ],
    },
};

describe("a row on a phone list", () => {
    test("a plan says its phase and how many of its to-dos are done", () => {
        const lines = linesOf(PLAN, plan, [
            {n: 1, completed: 5},
            {n: 2, completed: 0},
            {n: 3, completed: 9},
        ]);
        expect(lines).toEqual(["Plan 3", "Being worked on", "Phase 2 of 2: Water", "2 of 3 to-dos done"]);
        expect(dotOf(plan)).toBe("doing");
    });

    test("a question says its answer once it has one, and waits until then", () => {
        const asked = {type: "question", n: 4, completed: 0, outcome: "", data: {}};
        expect(linesOf({one: "Question"}, asked)).toContain("Needs your answer");
        expect(dotOf(asked)).toBe("waiting");
        expect(linesOf({one: "Question"}, {...asked, completed: 1, outcome: "Hill road"})).toContain("Answered: Hill road");
    });

    test("work says how many log entries it has and the latest one", () => {
        const work = {type: "work", n: 2, completed: 0, data: {}, sections: [{body: "Started"}, {body: "x".repeat(80)}]};
        expect(linesOf({one: "Work"}, work)).toEqual(["Work 2", "In hand", "2 log entries", `${"x".repeat(59)}…`]);
    });

    test("a suggestion says what you decided", () => {
        expect(linesOf({one: "Suggestion"}, {type: "suggestion", n: 1, completed: 1, data: {decision: "adjust"}})).toContain("Adjusted");
    });
});

describe("the shelves of the documents", () => {
    const docs = [{ref: "doc:1"}, {ref: "doc:2"}];
    const shelves = holding(
        [
            {ref: "collection:1", title: "Garden", refs: ["doc:1", "todo:4"]},
            {ref: "collection:2", title: "Empty", refs: ["todo:5"]},
        ],
        docs
    );

    test("a collection is a shelf only when it holds a document", () => {
        expect(shelves).toEqual([{ref: "collection:1", title: "Garden", holds: ["doc:1"]}]);
    });

    test("a shelf keeps its documents and the loose shelf keeps the rest", () => {
        expect(docs.filter(onShelf("collection:1", shelves))).toEqual([{ref: "doc:1"}]);
        expect(docs.filter(onShelf(LOOSE, shelves))).toEqual([{ref: "doc:2"}]);
        expect(docs.filter(onShelf("", shelves))).toEqual(docs);
    });
});

describe("what waits in each environment", () => {
    test("counts and words name only what waits", () => {
        const place = {details: {t: {waiting: {question: 3, plan: 0, doc: 1}}, garden: {waiting: {report: 2}}}};
        expect(needsOf(place)).toBe(6);
        expect(waitsOf(place.details.t)).toBe("3 questions, 1 document");
        expect(waitsOf(undefined)).toBe("");
    });
});

describe("a project file on the phone", () => {
    test("the lines picked go to the agent quoted, with the comment after them", () => {
        const file = {path: "roses.txt", text: "Red\nWhite\nYellow"};
        expect(linesWord({first: 2, last: 3})).toBe("lines 2-3");
        expect(aboutLines(file, {first: 2, last: 3, text: ""}, " Why? ")).toBe("About roses.txt, lines 2-3:\n\n> White\n> Yellow\n\nWhy?");
    });

    test("a size reads in bytes, kilobytes or megabytes", () => {
        expect([fileSize(35), fileSize(2048), fileSize(3 * 1048576)]).toEqual(["35 B", "2 KB", "3.0 MB"]);
    });
});
