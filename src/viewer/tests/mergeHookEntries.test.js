import {expect, test} from "vitest";
import {changedHooks, profileHooks} from "../../suites/coding/web/src/helperRows.js";

const ENTRIES = ["deploy", "journal-worker: npm run deploy", "journal-designer: echo designed"];

test("an edit of a profile's hooks keeps an entry with no colon as it was", () => {
    expect(changedHooks(ENTRIES, "journal-worker", ["git push", "echo merged"])).toEqual(["deploy", "journal-designer: echo designed", "journal-worker: git push", "journal-worker: echo merged"]);
});

test("an entry with no colon belongs to no profile, as the server reads it", () => {
    expect(profileHooks(ENTRIES, "journal-worker")).toEqual(["npm run deploy"]);
    expect(profileHooks(ENTRIES, "deplo")).toEqual([]);
    expect(profileHooks(ENTRIES, "deploy")).toEqual([]);
});
