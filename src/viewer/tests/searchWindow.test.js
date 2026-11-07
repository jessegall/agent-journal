import {expect, test} from "vitest";
import SearchWindow from "../../core/modules/search/web/src/SearchWindow.vue";
import {context, mounted, settle as tick} from "./support/windowContext.js";

const KEYS = {results: {line: "search find {terms} --split-terms", loading: "requested"}};
async function settle() {
    await tick();
    await new Promise((resolve) => setTimeout(resolve, 80));
    await tick();
}

const HITS = {hits: [{cli_name: "task", id: 7, excerpt: "Round the cart total to cents"}, {cli_name: "doc", id: 2, excerpt: "How the cart counts money"}], total: 2};

async function search(answer, words = "cart total") {
    const window = context({"search find": {ok: true, value: answer}}, null, KEYS);
    const opened = [];
    window.open = (name) => opened.push(name);
    const element = await mounted(SearchWindow, window);
    element.querySelector("[data-search-input]").value = words;
    element.querySelector("[data-search-input]").dispatchEvent(new Event("input"));
    element.querySelector("[data-search-go]").click();
    await settle();
    return {element, window, opened};
}

test("typing terms shows the hits with their excerpt and the total", async () => {
    const {element, window} = await search(HITS);
    expect(window.reads).toEqual([`search find cart total --split-terms`]);
    expect([...element.querySelectorAll("[data-hit]")].map((hit) => [hit.querySelector(".search-hit-name").textContent, hit.querySelector(".search-hit-excerpt").textContent])).toEqual([
        ["task 7", "Round the cart total to cents"],
        ["doc 2", "How the cart counts money"],
    ]);
    expect(element.querySelector("[data-total]").textContent).toBe("2 results match all these words: cart total");
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
    expect(window.reads[1]).toBe(`search find cart total --split-terms --model doc`);
});

test("a search that holds nothing says so", async () => {
    const {element} = await search({hits: [], total: 0}, "zebra");
    expect(element.querySelector("[data-no-hits]").textContent).toBe("No results match all these words: zebra");
});

test("a search where no row holds every word says so in one line and lists the closest rows", async () => {
    const {element} = await search({...HITS, closest: true}, "cart euros");
    expect(element.querySelector("[data-closest]").textContent).toBe("No result holds all these words: cart euros, these hold most of them, the closest first");
    expect(element.querySelector("[data-total]")).toBeNull();
    expect(element.querySelectorAll("[data-hit]")).toHaveLength(2);
});
