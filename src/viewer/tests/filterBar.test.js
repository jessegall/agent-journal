import {computed, createApp, h, ref} from "vue";
import {afterEach, expect, test} from "vitest";
import FilterBar from "../kit/FilterBar.vue";
import {applyFilter, defaultFilter, emptyFilter, optionsOf} from "../kit/toggleFilter.js";
import {settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const ROWS = [
    {id: 1, title: "Cart", state: "active", agent: "main"},
    {id: 2, title: "Checkout", state: "removed", agent: "main"},
    {id: 3, title: "Cache", state: "active", agent: "worker-4"},
];
const fields = (withDefault) => [
    {key: "state", label: "State", options: optionsOf(ROWS, (row) => row.state), get: (row) => row.state, default: withDefault ? ["active"] : []},
    {key: "agent", label: "Agent", options: optionsOf(ROWS, (row) => row.agent), get: (row) => row.agent},
];

// a page's side of the bar: it holds the value and the words, and shows the rows the bar's filters keep
function page(declared) {
    const value = ref(defaultFilter(declared));
    const words = ref("");
    const element = document.createElement("div");
    document.body.append(element);
    createApp({
        setup() {
            const shown = computed(() => applyFilter(ROWS, declared, value.value, words.value, ["title"]));
            return () => h("div", [
                h(FilterBar, {fields: declared, rows: ROWS, modelValue: value.value, words: words.value, shown: shown.value.length, "onUpdate:modelValue": (next) => (value.value = next), "onUpdate:words": (next) => (words.value = next)}),
                h("p", {"data-shown": ""}, shown.value.map((row) => row.id).join(",")),
            ]);
        },
    }).mount(element);
    return {element, value, words};
}
const shownIds = (element) => element.querySelector("[data-shown]").textContent;
const chipOf = (element, key) => element.querySelector(`[data-filter-chip="${key}"]`);
const choose = async (element, key, option) => {
    chipOf(element, key).querySelector(".filter-chip-main").click();
    await settle();
    document.body.querySelector(`[data-filter-option="${option}"]`).click();
    await settle();
};

test("test_chip_applies_option: choosing a value in a chip keeps the rows holding it, and the chip reads the choice", async () => {
    const {element} = page(fields(false));
    expect(shownIds(element)).toBe("1,2,3");
    await choose(element, "agent", "worker-4");
    expect(shownIds(element)).toBe("3");
    expect(chipOf(element, "agent").querySelector("[data-filter-value]").textContent).toBe(": worker-4");
});

test("test_default_shown_as_set: a field with a default other than all starts as set and holds the other rows back", () => {
    const {element} = page(fields(true));
    expect(chipOf(element, "state").classList.contains("on")).toBe(true);
    expect(chipOf(element, "state").querySelector("[data-filter-value]").textContent).toBe(": active");
    expect(chipOf(element, "agent").classList.contains("on")).toBe(false);
    expect(shownIds(element)).toBe("1,3");
    expect(chipOf(element, "state").querySelector("[data-filter-clear]")).toBeNull();
});

test("test_clear_restores_default: the chip's cross and the bar's Clear put the fields back on their defaults", async () => {
    const {element, words} = page(fields(true));
    await choose(element, "state", "removed");
    expect(shownIds(element)).toBe("1,2,3");
    chipOf(element, "state").querySelector("[data-filter-clear]").click();
    await settle();
    expect(shownIds(element)).toBe("1,3");
    await choose(element, "agent", "main");
    words.value = "cart";
    await settle();
    expect(element.querySelector("[data-filter-count]").textContent).toBe("1 of 3");
    element.querySelector("[data-filter-clear-all]").click();
    await settle();
    expect(shownIds(element)).toBe("1,3");
    expect(words.value).toBe("");
    expect(element.querySelector("[data-filter-count]")).toBeNull();
});

test("test_search_and_chips_combine: the words search inside the rows the chips keep", async () => {
    const {element, words} = page(fields(false));
    await choose(element, "agent", "main");
    words.value = "che";
    await settle();
    expect(shownIds(element)).toBe("2");
    words.value = "ca";
    await settle();
    expect(shownIds(element)).toBe("1");
});

test("an empty filter holds nothing back and 'is not' keeps the rows without the value", () => {
    expect(applyFilter(ROWS, fields(false), emptyFilter()).length).toBe(3);
    const kept = applyFilter(ROWS, fields(false), {agent: {not: true, values: ["main"]}});
    expect(kept.map((row) => row.id)).toEqual([3]);
});
