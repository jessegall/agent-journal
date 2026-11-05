import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import MemoriesPage from "../../core/modules/memories/web/src/MemoriesPage.vue";

const ENVIRONMENTS = page([{id: 1, name: "main"}, {id: 2, name: "docs"}]);

test("the page has a tab per environment, opens on the current one and reads the memories of the tab picked", async () => {
    const window_ = {...context({"environment list": ENVIRONMENTS, "memory list --environment main": page([{id: 1, text: "Totals are in cents", type: "fact", weight: 5, state: "active"}]), "memory list --environment docs": page([{id: 2, text: "Docs are plain", type: "fact", weight: 5, state: "active"}]), "memory list": page([])}), lines: []};
    const element = await mounted(MemoriesPage, window_);
    await settle();
    expect([...element.querySelectorAll("[data-memory-tabs] button")].map((tab) => tab.textContent.trim())).toEqual(["All", "main", "docs"]);
    expect(element.textContent).toContain("Totals are in cents");
    [...element.querySelectorAll("[data-memory-tabs] button")].find((tab) => tab.textContent.trim() === "docs").click();
    await settle();
    expect(element.textContent).toContain("Docs are plain");
    expect(element.textContent).not.toContain("Totals are in cents");
});

test("a memory made on a tab is made in that tab's environment", async () => {
    const lines = [];
    const window_ = {...context({"environment list": ENVIRONMENTS, "memory list": page([])}), run: async (line) => (lines.push(line), {ok: true, value: {}})};
    const element = await mounted(MemoriesPage, window_);
    await settle();
    element.querySelector("[data-memory-new]").click();
    await settle();
    const text = element.querySelector("[data-memory-form] textarea");
    text.value = "Keep this";
    text.dispatchEvent(new Event("input"));
    await settle();
    element.querySelector("[data-memory-form]").dispatchEvent(new Event("submit"));
    await settle();
    expect(lines).toEqual([["memory", "make", "Keep this", "--environment", "main"]]);
});
