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

    test("a comment the viewer wrote is answered by the server's comment with its words, and never by an older one on the same row", () => {
        const wrote = {type: "comment", n: 0, refs: ["doc:3"], brief: "Check the second table", created: 1000, data: {}};
        const older = {type: "comment", n: 7, refs: ["doc:3"], brief: "Check the second table", created: 100, data: {}};
        const other = {type: "comment", n: 8, refs: ["doc:3"], brief: "Something else", created: 1001, data: {}};
        const arrived = {type: "comment", n: 9, refs: ["doc:3"], brief: "Check the second table", created: 1001, data: {}};
        expect([answers(older, wrote), answers(other, wrote), answers(arrived, wrote)]).toEqual([false, false, true]);
        const second = {...wrote, brief: "And the third"};
        expect(withoutAnswered([wrote, second], [arrived])).toEqual([second]);
    });
});
