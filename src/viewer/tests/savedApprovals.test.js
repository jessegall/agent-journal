import {expect, test} from "vitest";
import SavedApprovalsPanel from "../../core/modules/approvals/web/src/SavedApprovalsPanel.vue";
import {context} from "./support/windowContext.js";
import {mounted, pickButton} from "./support/windowContext.js";

const KEYS = {saved: {line: "saved-approval list", events: ["saved_approval.*"]}};
const rows = [{id: 3, scope: "same", text: "ResumeAgent: Resume the paused agent 5?"}, {id: 4, scope: "like", text: "window allow notes.board"}];

test("the approvals window lists each saved yes with what it covers and removes one by its button", async () => {
    const windowContext = context({"saved-approval list": {ok: true, value: {rows, page: 1, size: 50, total: 2}}}, null, KEYS);
    const lines = [];
    windowContext.run = async (line) => { lines.push(line.join(" ")); return {ok: true, value: null}; };
    const element = await mounted(SavedApprovalsPanel, windowContext);
    const listed = [...element.querySelectorAll("[data-saved-yes]")].map((row) => row.textContent);
    expect(listed[0]).toContain("Accepts the same request");
    expect(listed[1]).toContain("Accepts any request like it");
    await pickButton(element, "Remove");
    expect(lines).toEqual(["saved-approval delete 3"]);
});

test("the approvals window says when no saved yes is kept", async () => {
    const element = await mounted(SavedApprovalsPanel, context({"saved-approval list": {ok: true, value: {rows: [], page: 1, size: 50, total: 0}}}, null, KEYS));
    expect(element.querySelector("[data-saved-empty]")).not.toBeNull();
});
