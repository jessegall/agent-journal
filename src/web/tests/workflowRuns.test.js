import {describe, expect, it} from "vitest";
import {nodeRunWords, readWords} from "../src/domain/workflowRuns.js";

describe("a node's runs and a run's reads on the canvas", () => {
    it("says how often a node ran, and nothing for none", () => {
        expect(nodeRunWords({runs: 0})).toBe("");
        expect(nodeRunWords({runs: 1})).toBe("ran once");
        expect(nodeRunWords({runs: 12})).toBe("ran 12 times");
        expect(nodeRunWords(null)).toBe("");
    });

    it("says what a count check read on the run shown", () => {
        expect(readWords({7: 3}, 7)).toBe("read 3");
        expect(readWords({7: 0}, 7)).toBe("read 0");
        expect(readWords({}, 7)).toBe("");
        expect(readWords(undefined, 7)).toBe("");
    });
});
