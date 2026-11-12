import {settle} from "./support/delayedWindowContext.js";
import {expect, test} from "vitest";
import SearchWindow from "../../core/modules/search/web/src/SearchWindow.vue";
import {context, mounted} from "./support/windowContext.js";

const KEYS = {results: {line: "search find {terms} --split-terms", loading: "requested"}};

const HITS = {hits: [{cli_name: "task", id: 7, excerpt: "Round the cart total to cents"}, {cli_name: "doc", id: 2, excerpt: "How the cart counts money"}], total: 2};

async function search(answer, words = "cart total") {
    const window = context({"search find": {ok: true, value: answer}}, null, KEYS);
    const element = await mounted(SearchWindow, window);
    element.querySelector("[data-search-input]").value = words;
    element.querySelector("[data-search-input]").dispatchEvent(new Event("input"));
    element.querySelector("[data-search-go]").click();
    await settle();
    return {element, window};
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

const OPEN = /open=([a-z]+:\d+)/;
const opened = () => decodeURIComponent(location.hash).match(OPEN)?.[1] ?? "";

test("a task, a message and a document hit each open their row in its inspector", async () => {
    const {element} = await search({hits: [{cli_name: "task", id: 7, excerpt: "Round the total"}, {cli_name: "message", id: 3, excerpt: "Check the cart"}, {cli_name: "doc", id: 2, excerpt: "How the cart counts money"}], total: 3});
    const hits = element.querySelectorAll("[data-hit]");
    const shown = [];
    for (const hit of hits) {
        location.hash = "#/search";
        hit.click();
        shown.push(opened());
    }
    expect(shown).toEqual(["tasks:7", "messages:3", "docs:2"]);
});

test("a hit of a model with no inspector shows its text in a dialog", async () => {
    const {element} = await search({hits: [{cli_name: "gadget", id: 4, excerpt: "Hinge on the left"}], total: 1});
    location.hash = "#/search";
    element.querySelector("[data-hit]").click();
    await settle();
    expect(opened()).toBe("");
    expect(document.body.textContent).toContain("Hinge on the left");
    expect(document.body.textContent).toContain("gadget 4");
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
    const closest = {...HITS, closest: true, hits: HITS.hits.map((hit) => ({...hit, matched_words: ["cart"]}))};
    const {element} = await search(closest, "cart euros");
    expect([...element.querySelectorAll("[data-hit-words]")].map((words) => words.textContent)).toEqual(["holds: cart", "holds: cart"]);
    expect(element.querySelector("[data-closest]").textContent).toBe("No result holds all these words: cart euros, these hold most of them, the closest first");
    expect(element.querySelector("[data-total]")).toBeNull();
    expect(element.querySelectorAll("[data-hit]")).toHaveLength(2);
});
