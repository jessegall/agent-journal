import {describe, expect, test} from "vitest";
import {answers, withoutAnswered} from "../src/domain/placeholders.js";

const placeholder = {type: "reaction", n: 0, refs: ["message:4"], data: {face: "👍"}};
const real = {type: "reaction", n: 12, refs: ["message:4"], data: {face: "👍", extra: 1}};

describe("a row the viewer added while its create call was out", () => {
    test("is answered by the server's row for the same thing, and by no other", () => {
        expect(answers(real, placeholder)).toBe(true);
        expect([answers({...real, data: {face: "❤️"}}, placeholder), answers({...real, refs: ["message:5"]}, placeholder), answers({...real, n: 0}, placeholder)]).toEqual([false, false, false]);
    });

    test("is dropped when the server's row arrives, so a list never shows the row twice", () => {
        const other = {type: "reaction", n: 9, refs: ["message:4"], data: {face: "🎉"}};
        expect(withoutAnswered([other, placeholder], [other, real])).toEqual([other]);
        expect(withoutAnswered([other, placeholder], [other])).toEqual([other, placeholder]);
    });
});
