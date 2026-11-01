import {expect, test} from "vitest";
import SearchWindow from "../../core/modules/search/web/src/SearchWindow.vue";
import {context, mounted, settle} from "./support/windowContext.js";

const HITS = {hits: [{cli_name: "task", id: 7, passage: "Round the cart total to cents"}, {cli_name: "doc", id: 2, passage: "How the cart counts money"}], total: 2};

async function search(answer, words = "cart total") {
    const window = context({"search find": {ok: true, value: answer}});
    const opened = [];
    window.open = (name) => opened.push(name);
    const element = await mounted(SearchWindow, window);
    element.querySelector(".search-input").value = words;
    element.querySelector(".search-input").dispatchEvent(new Event("input"));
    element.querySelector("form").dispatchEvent(new Event("submit"));
    await settle();
    return {element, window, opened};
}

test("typing terms shows the hits with their passage and the total", async () => {
    const {element, window} = await search(HITS);
    expect(window.reads).toEqual([`search find "cart" "total"`]);
    expect([...element.querySelectorAll("[data-hit]")].map((hit) => [hit.querySelector(".search-hit-name").textContent, hit.querySelector(".search-hit-passage").textContent])).toEqual([
        ["task 7", "Round the cart total to cents"],
        ["doc 2", "How the cart counts money"],
    ]);
    expect(element.querySelector("[data-total]").textContent).toBe("2 rows hold all of: cart total");
});

test("a hit opens the window of the row it names", async () => {
    const {element, opened} = await search(HITS);
    element.querySelectorAll("[data-hit]")[1].click();
    expect(opened).toEqual(["documents.documents"]);
});

test("a model chip narrows the search to that model, and none picked means all", async () => {
    const {element, window} = await search(HITS);
    element.querySelector(`[data-model="doc"]`).click();
    await settle();
    expect(window.reads[1]).toBe(`search find "cart" "total" --model doc`);
});

test("a search that holds nothing says so", async () => {
    const {element} = await search({hits: [], total: 0}, "zebra");
    expect(element.querySelector("[data-no-hits]").textContent).toBe("Nothing here holds all of: zebra");
});
