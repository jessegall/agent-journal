import {expect, test, vi} from "vitest";
import WorkerSplit from "../../suites/coding/modules/workers/web/src/WorkerSplit.vue";
import {context, mounted, page, settle, typeInto} from "./support/windowContext.js";

async function split(answer = {ok: true}, readOnly = false) {
    const programs = [{id: "claude", title: "Claude Code", share: 80, recent: 4, helpers_recent: 2, windows: ["5h 20% used"], is_ready: true},
        {id: "codex", title: "Codex", share: 20, recent: 1, helpers_recent: 0, windows: [], is_ready: false, outage: true, line: "out of credit", ends_at: "2027-01-01T12:00:00Z"}];
    const view = context({"worker split": page(programs), "worker-route list": page([]), "task tags": page([{word: "linux"}]),
        "agent limits": page([{key: "worker", run_limit: 2, run_setting: "sample.worker-run"}])}, null, {
        split: {line: "worker split"}, routes: {line: "worker-route list"}, tags: {line: "task tags"}, "split-limits": {line: "agent limits"},
    });
    view.readOnly = readOnly;
    view.run = vi.fn(async () => answer);
    const element = await mounted(WorkerSplit, view);
    return {view, element};
}

test("a drag updates all shares and writes only once on release", async () => {
    const {view, element} = await split();
    const slider = element.querySelector('[aria-label="Claude Code share"]');
    typeInto(slider, "60"); await settle();
    typeInto(slider, "65"); await settle();
    expect([...element.querySelectorAll("output")].map((node) => node.textContent)).toEqual(["65%", "35%"]);
    expect(view.run).not.toHaveBeenCalled();
    slider.dispatchEvent(new Event("change")); await settle();
    expect(view.run).toHaveBeenCalledTimes(1);
    expect(view.run).toHaveBeenCalledWith(["setting", "set", "journal.core.helpers.program-split", "claude 65,codex 35", "--project"]);
});
test("the run limit comes from the registered type and refusals stay visible", async () => {
    const {view, element} = await split({ok: false, error: "Only a person changes this setting"});
    const input = element.querySelector('[aria-label="Workers running at once"]');
    input.value = "4"; input.dispatchEvent(new Event("change")); await settle();
    expect(view.run).toHaveBeenCalledWith(["setting", "set", "sample.worker-run", "4", "--environment", "main"]);
    expect(element.querySelector('[role="alert"]').textContent).toContain("Only a person");
});
test("an outage names its reason and end and Back now ends that program's outage", async () => {
    const {view, element} = await split();
    const program = element.querySelector('[data-split-program="codex"]');
    expect(program.textContent).toContain("out of credit");
    expect(program.textContent).toContain("2027-01-01");
    [...program.querySelectorAll("button")].find((button) => button.textContent === "Back now").click(); await settle();
    expect(view.run).toHaveBeenCalledWith(["provider-outage", "end", "codex"]);
    expect(element.textContent).toContain("5h 20% used");
});
test("read-only viewers can read the split but cannot change it", async () => {
    const {view, element} = await split({ok: true}, true);
    expect([...element.querySelectorAll("input, select, button")].every((node) => node.disabled)).toBe(true);
    expect(view.run).not.toHaveBeenCalled();
});
