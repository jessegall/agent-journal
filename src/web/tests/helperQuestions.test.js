import {describe, expect, it} from "vitest";
import {helperAsking, helperCard, helperTag} from "../src/domain/helpers.js";

const environments = [
    {name: "main-leslie", owner: "helper:1", attention: {kind: "question", text: "Which port?"}},
    {name: "main-rhea", owner: "helper:2", attention: {kind: "permission", text: "Run a command"}},
    {name: "main-zoe", owner: "helper:3", attention: {}},
];

describe("a helper waiting on a question", () => {
    it("is found by the environment it owns, and only when that environment asks a question", () => {
        expect([1, 2, 3, 4].map((n) => helperAsking({n}, environments))).toEqual(["Which port?", "", "", ""]);
    });

    it("shows as needing you in the helpers list and on the plan page, in the inspector with the question", () => {
        const asking = {n: 1, title: "Profile the hooks", data: {}, asking: "Which port?"};
        expect(helperTag(asking)).toEqual({state: "needs", word: "Asks a question"});
        expect(helperCard(asking).reason).toBe("Asks a question: Which port?");
        expect(helperTag({n: 2, data: {}, asking: ""})).toEqual({state: "running", word: "Working"});
        expect(helperCard({n: 2, title: "x", data: {}, asking: ""}).reason).toBe("");
    });
});
