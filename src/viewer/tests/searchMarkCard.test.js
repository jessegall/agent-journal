import {afterEach, expect, test} from "vitest";
import {h, ref} from "vue";
import SearchMarkCard from "../../core/modules/search/web/src/SearchMarkCard.vue";
import {context, mounted, settle} from "./support/windowContext.js";

const hits = (count) => Array.from({length: count}, (_, at) => ({cli_name: at % 2 ? "doc" : "task", id: at + 1, excerpt: `passage ${at + 1} around cart`}));
const markWith = (found) => ({id: 3, type: "search.search", lines: JSON.stringify(found)});

async function card(found, opened = []) {
    const windowContext = {...context({}), option: () => ref(markWith(found)), open: (name) => opened.push(name)};
    const element = await mounted({render: () => h(SearchMarkCard)}, windowContext);
    document.body.append(element);
    return element;
}

afterEach(() => {
    document.body.innerHTML = "";
    location.hash = "";
});

test("an opened search mark has a child for each row found, with its term, number and passage", async () => {
    const element = await card({terms: ["cart"], total: 2, hits: hits(2)});
    const children = [...element.querySelectorAll("[data-search-child]")].map((child) => `${child.querySelector(".search-child-name").textContent} ${child.querySelector(".search-child-excerpt").textContent}`);
    expect(children).toEqual(["task 1 passage 1 around cart", "doc 2 passage 2 around cart"]);
    expect(element.querySelector("[data-search-more]")).toBeNull();
});

test("a child opens its row in the panel", async () => {
    const element = await card({terms: ["cart"], total: 1, hits: hits(1)});
    element.querySelector("[data-search-child]").click();
    await settle();
    expect(location.hash).toContain("open=tasks:1");
});

test("when more rows held the words than are shown the last child opens the search page and says how many", async () => {
    const opened = [];
    const element = await card({terms: ["cart"], total: 14, hits: hits(10)}, opened);
    expect(element.querySelectorAll("[data-search-child]")).toHaveLength(10);
    const last = [...element.querySelectorAll(".search-mark > button")].at(-1);
    expect(last.hasAttribute("data-search-more")).toBe(true);
    expect(last.textContent).toContain("All 14 results");
    last.click();
    expect(opened).toEqual(["search.search"]);
});

test("a search that found nothing says which words nothing held", async () => {
    const element = await card({terms: ["cart", "euros"], total: 0, hits: []});
    expect(element.querySelector("[data-search-none]").textContent).toBe("No results match all these words: cart euros");
    expect(element.querySelectorAll("[data-search-child]")).toHaveLength(0);
});
