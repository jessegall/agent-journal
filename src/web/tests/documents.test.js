import {describe, expect, test} from "vitest";
import {found, searchTerms, standing} from "../src/domain/documents.js";

const doc = (fields = {}, data = {}) => ({n: 4, title: "Plan", abstract: "", brief: "", sections: [], outcome: "", completed: 0, ...fields, data});
const asking = (label, chosen = false, ask = "Approve it?") => ({
    buttons: [{label, choice: "go", ask}],
    pressed: chosen ? [label] : [],
});

describe("the standing of a document", () => {
    test.each([
        ["replaced by a chip", doc({outcome: "Superseded by [[chip doc:12 new]]"}), "replaced", 12],
        ["replaced by plain words", doc({outcome: "replaced by doc 9."}), "replaced", 9],
        ["a pending approval", doc({}, asking("Approve")), "approve", undefined],
        ["a pending question", doc({}, asking("Pick one", false, "Which one?")), "answer", undefined],
        ["an answered choice", doc({}, asking("Pick one", true)), "answered", 0],
        ["an answer in the user's own words", doc({}, {answered_own: true}), "answered", 0],
        ["a completed document", doc({completed: 5}, {status: "draft"}), "final", 0],
        ["a document with no status", doc(), "final", 0],
        ["a draft", doc({}, {status: "draft"}), "writing", 0],
    ])("%s", (_, row, key, by) => {
        const got = standing(row);
        expect(got.key).toBe(key);
        if (by !== undefined) expect(got.by).toBe(by);
    });

    test("an outcome that says more than the standing is not said in full", () => {
        expect(standing(doc({outcome: "Superseded by doc 3, it was out of date"})).said).toBe(false);
        expect(standing(doc({outcome: "Superseded by doc 3."})).said).toBe(true);
        expect(standing(doc({completed: 1}, {status: "final"})).said).toBe(true);
        expect(standing(doc({outcome: "Shipped in 2.1", completed: 1})).said).toBe(false);
    });
});

describe("finding a document", () => {
    const row = doc({title: "Phone pairing", brief: "How the QR code works", sections: [{title: "Steps", body: "Scan the code with the camera"}]}, {files: {"qr.png": "the code"}});

    test("terms are split on spaces and lowered", () => {
        expect(searchTerms("  Phone   CODE ")).toEqual(["phone", "code"]);
        expect(searchTerms("   ")).toEqual([]);
    });

    test("every term has to appear somewhere", () => {
        expect(found(row, ["phone", "nothing"])).toBeNull();
    });

    test("a title hit scores highest and carries no excerpt", () => {
        expect(found(row, ["phone"])).toEqual({score: 8, where: "", text: ""});
    });

    test("a section hit names the section and quotes it", () => {
        const hit = found(row, ["camera"]);
        expect(hit.where).toBe("Steps");
        expect(hit.text).toContain("camera");
    });

    test("a file hit names the attached file", () => {
        expect(found(doc({}, {files: {"qr.png": "pairing picture"}}), ["pairing"])).toMatchObject({where: "Attached file", text: "qr.png"});
    });

    test("a brief hit is quoted without markup", () => {
        const hit = found(doc({brief: "See [[doc 3|the **plan**]] for pairing"}), ["pairing"]);
        expect(hit.text).toBe("See the plan for pairing");
    });
});
