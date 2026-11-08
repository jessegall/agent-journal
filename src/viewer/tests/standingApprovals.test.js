import {expect, test} from "vitest";
import StandingApprovalsPanel from "../src/windows/StandingApprovalsPanel.vue";
import {context} from "./support/windowContext.js";
import {mounted, pickButton} from "./support/windowContext.js";

const KEYS = {standing: {line: "standing-approval list", events: ["standing_approval.*"]}};
const rows = [{id: 3, scope: "same", text: "ResumeAgent: Resume the paused agent 5?"}, {id: 4, scope: "like", text: "window allow notes.board"}];

test("the approvals window lists each standing yes with what it covers and removes one by its button", async () => {
    const windowContext = context({"standing-approval list": {ok: true, value: {rows, page: 1, size: 50, total: 2}}}, null, KEYS);
    const lines = [];
    windowContext.run = async (line) => { lines.push(line.join(" ")); return {ok: true, value: null}; };
    const element = await mounted(StandingApprovalsPanel, windowContext);
    const listed = [...element.querySelectorAll("[data-standing-yes]")].map((row) => row.textContent);
    expect(listed[0]).toContain("Accepts the same request");
    expect(listed[1]).toContain("Accepts any request like it");
    await pickButton(element, "Remove");
    expect(lines).toEqual(["standing-approval delete 3"]);
});

test("the approvals window says when no standing yes is kept", async () => {
    const element = await mounted(StandingApprovalsPanel, context({"standing-approval list": {ok: true, value: {rows: [], page: 1, size: 50, total: 0}}}, null, KEYS));
    expect(element.querySelector("[data-standing-empty]")).not.toBeNull();
});
