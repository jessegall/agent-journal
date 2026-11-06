import {expect, test} from "vitest";
import {mounted, page, settle} from "./support/windowContext.js";
import {fileEditsWindowContext as context} from "./support/fileEditsWindowContext.js";
import FileEdits from "../../suites/coding/web/src/FileEdits.vue";

test("the file edits filter by path and escape clears it", async () => {
    const element = await mounted(FileEdits, context({"file-edit list": page([{id: 1, path: "src/cart.py", added: 1, removed: 0, session_agent_id: 2}, {id: 2, path: "src/tax.py", added: 2, removed: 1, session_agent_id: 2}])}));
    const input = element.querySelector("[data-search-input]");
    input.value = "tax";
    input.dispatchEvent(new Event("input"));
    await settle();
    expect(element.textContent).toContain("src/tax.py");
    expect(element.textContent).not.toContain("src/cart.py");
    input.dispatchEvent(new KeyboardEvent("keydown", {key: "Escape"}));
    await settle();
    expect(element.textContent).toContain("src/cart.py");
});

test("the file edits key retains its page when older edits are requested", async () => {
    const rows = Array.from({length: 50}, (_, index) => ({id: 51 - index, path: `src/file${51 - index}.py`, added: 1, removed: 0, session_agent_id: 2}));
    const held = context({
        "file-edit list --before-id 2": {ok: true, value: {rows: [{id: 1, path: "src/old.py", added: 2, removed: 0, session_agent_id: 3}], page: 2, size: 50, total: 51}},
        "file-edit list": {ok: true, value: {rows, page: 1, size: 50, total: 51}},
    });
    const element = await mounted(FileEdits, held);
    expect(held.reads).toEqual(["file-edit list --limit 50"]);
    element.querySelector("[data-row-list-more]").click();
    await settle();
    expect(element.textContent).toContain("src/old.py");
    expect(element.textContent).toContain("src/file51.py");
    expect(element.querySelector("[data-row-list-more]")).toBeNull();
    expect(held.reads.at(-1)).toContain("--before-id 2");
});
