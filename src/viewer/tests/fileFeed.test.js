import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test, vi} from "vitest";
import {mounted, page, settle} from "./support/windowContext.js";
import {fileFeedWindowContext as context} from "./support/fileFeedWindowContext.js";
import FileFeed from "../../suites/coding/web/src/FileFeed.vue";
import {cardsOf} from "../../suites/coding/web/src/fileCards.js";

vi.stubGlobal("ResizeObserver", class {
    observe() {}

    disconnect() {}
});

const ROWS = (line, text) => JSON.stringify([{line_type: "ctx", line, text: "same"}, {line_type: "add", line: line + 1, text}, {line_type: "del", line: line + 2, text: "gone"}]);
const EDIT = (id, path, line = 10, text = "a new line") => ({id, path, added: 1, removed: 1, rows: ROWS(line, text), edit_type: "edit", created_at: "2026-11-01T10:00:00Z"});

test("edits of one file one after the other join one card, with the gap between them left out", () => {
    const cards = cardsOf([EDIT(1, "a.py", 10), EDIT(2, "a.py", 40), EDIT(3, "b.py")]);
    expect(cards.map((card) => card.path)).toEqual(["a.py", "b.py"]);
    expect(cards[0].added).toBe(2);
    const fold = cards[0].rows.find((row) => row.line_type === "fold");
    expect(fold.hidden).toBe(27);
});

test("a file edit shows its path, its counts and its changed lines", async () => {
    const element = await mounted(FileFeed, context({"file-edit list": page([EDIT(1, "src/cart.py")])}, 2));
    await settle();
    expect(element.textContent).toContain("cart.py");
    expect(element.textContent).toContain("a new line");
    expect(element.querySelectorAll(".diff-row.add").length).toBe(1);
    expect(element.querySelectorAll(".diff-row.del").length).toBe(1);
});

test("the view menu hides removals and is kept", async () => {
    const window = context({"file-edit list": page([EDIT(1, "src/cart.py")])}, 2);
    const kept = [];
    window.setOption = (key, value) => kept.push([key, value]);
    const element = await mounted(FileFeed, window);
    document.body.append(element);
    await settle();
    element.querySelector("[data-search-menu]").click();
    await settle();
    document.querySelector('[data-feed-toggle="removals"]').click();
    await settle();
    expect(element.querySelectorAll(".diff-row.del").length).toBe(0);
    expect(kept[0][0]).toBe("view");
    expect(kept[0][1].removals).toBe(false);
});

test("headers only folds the cards and the filter keeps the files that match", async () => {
    const window = context({"file-edit list": page([EDIT(2, "b.py"), EDIT(1, "a.py")])}, 2, {headers: true});
    const element = await mounted(FileFeed, window);
    await settle();
    expect(element.querySelectorAll(".diff-row").length).toBe(0);
    expect(element.querySelectorAll(".diff-card").length).toBe(2);
});

test("the whole file button reads the file as it is now", async () => {
    const window = context({"file-edit list": page([EDIT(1, "src/cart.py")]), "file-edit file 1": {ok: true, value: {text: "first\nsecond"}}}, 2);
    const element = await mounted(FileFeed, window);
    await settle();
    element.querySelector(".diff-card-whole").click();
    await settle();
    expect(window.reads).toContain("file-edit file 1");
    expect(window.reads.some((line) => line.startsWith("project-file show"))).toBe(false);
    expect(element.textContent).toContain("second");
});

test("an edit kept before the changed lines were kept draws as its header alone", async () => {
    const element = await mounted(FileFeed, context({"file-edit list": page([{...EDIT(1, "old.py"), rows: "[]"}])}, 2));
    await settle();
    expect(element.querySelector(".diff-card").classList.contains("folded")).toBe(true);
});

test("in the view menu a checked and an unchecked item start their label at the same place", async () => {
    const window = context({"file-edit list": page([EDIT(1, "src/cart.py")])}, 2, {headers: true});
    const element = await mounted(FileFeed, window);
    document.body.append(element);
    await settle();
    element.querySelector("[data-search-menu]").click();
    await settle();
    const checked = document.querySelector('[data-feed-toggle="headers"]');
    const unchecked = document.querySelector('[data-feed-toggle="flush"]');
    const action = document.querySelector("[data-feed-expand]");
    expect(checked.children[0].className).toBe("menu-item-check");
    expect(checked.children[0].textContent).toBe("✓");
    for (const item of [unchecked, action]) {
        expect(item.children[0].className).toBe("menu-item-check");
        expect(item.children[0].textContent).toBe("");
    }
    expect(checked.textContent).toBe("✓Headers only");
    expect(unchecked.textContent).toBe("Flush");
});

test("in the view menu the Lines choices go below their label", async () => {
    const element = await mounted(FileFeed, context({"file-edit list": page([EDIT(1, "src/cart.py")])}, 2));
    document.body.append(element);
    await settle();
    element.querySelector("[data-search-menu]").click();
    await settle();
    const lines = document.querySelector(".feed-bar-lines");
    expect(lines.children[0].textContent).toBe("Lines");
    expect(lines.children[1].textContent).toContain("All");
    const source = readFileSync(resolve(__dirname, "../../suites/coding/web/src/FeedBar.vue"), "utf8");
    expect(source).toMatch(/\.feed-bar-lines \{[^}]*flex-direction: column;/);
});

