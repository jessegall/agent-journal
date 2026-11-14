import {expect, test} from "vitest";
import CheckDialog from "../../suites/coding/modules/checks/web/src/CheckDialog.vue";
import {settle} from "./support/windowContext.js";
import {mounted} from "./support/windowContext.js";
import {checkWindowContext as context} from "./support/checkWindowContext.js";

const ROW = {id: 3, title: "Suite", command: "pytest", last_output: "newest words", stopped: false};
const RUNS = {ok: true, value: {rows: [{run_at: "2026-11-02T10:00:00+00:00", passed: false, output: "older words"}]}};

function drawnInBody(element) {
    return document.body.textContent + element.textContent;
}

test("the dialog opens on the newest output and offers a run", async () => {
    const held = context({"check runs": RUNS});
    const element = await mounted(CheckDialog, held, {row: ROW});
    expect(drawnInBody(element)).toContain("newest words");
    expect(document.querySelector("[data-check-run]").textContent).toContain("Run");
    expect(held.reads.some((line) => line.startsWith("check runs"))).toBe(false);
});

test("a stopped check offers no run", async () => {
    document.body.replaceChildren();
    await mounted(CheckDialog, context({"check runs": RUNS}), {row: {...ROW, stopped: true}});
    expect(document.querySelector("[data-check-run]")).toBeNull();
});

test("a run in progress shows on its button", async () => {
    document.body.replaceChildren();
    await mounted(CheckDialog, context({"check runs": RUNS}), {row: ROW, running: true});
    expect(document.querySelector("[data-check-run]").textContent).toContain("Running");
});

test("the runs view lists each run, and picking one shows what it printed", async () => {
    document.body.replaceChildren();
    await mounted(CheckDialog, context({"check runs": RUNS}), {row: ROW});
    [...document.querySelectorAll("button")].find((button) => button.textContent.trim() === "Runs").click();
    await settle();
    expect(document.querySelector("[data-check-runs]").textContent).toContain("Failed");
    document.querySelector("[data-check-runs] button").click();
    await settle();
    expect(document.querySelector("[data-check-output]").textContent).toBe("older words");
});
