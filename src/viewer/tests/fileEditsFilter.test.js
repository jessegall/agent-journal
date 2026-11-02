import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import FileEdits from "../../suites/coding/web/src/FileEdits.vue";

test("the file edits filter by path and escape clears it", async () => {
    const element = await mounted(FileEdits, context({"file-edit list": page([{id: 1, path: "src/cart.py", added: 1, removed: 0, agent_id: 2}, {id: 2, path: "src/tax.py", added: 2, removed: 1, agent_id: 2}])}));
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
