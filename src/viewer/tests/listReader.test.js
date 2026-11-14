import {createApp, h, ref} from "vue";
import {afterEach, expect, test} from "vitest";
import ListReaderLayout from "../kit/ListReaderLayout.vue";
import Reader from "../kit/Reader.vue";
import {settle} from "./support/windowContext.js";

afterEach(() => {
    document.body.innerHTML = "";
    location.hash = "";
});

const ITEMS = [
    {id: 1, title: "Journal", desc: "The basics"},
    {id: 2, title: "A very long title that a one-line row must cut with an ellipsis and still show whole on hover", desc: "Documents"},
    {id: 3, title: "Memory", desc: "What is kept"},
];

function layout(items = ITEMS, start = null) {
    const chosen = ref(start);
    const element = document.createElement("div");
    document.body.append(element);
    createApp({
        render: () => h(ListReaderLayout, {items, chosen: chosen.value, "onUpdate:chosen": (id) => (chosen.value = id), listWidth: 460}, {reader: ({item}) => h("p", {"data-read": ""}, item.title)}),
    }).mount(element);
    return {element, chosen};
}
const press = (element, key) => element.querySelector("[data-reader-list]").dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true, cancelable: true}));

test("test_arrow_keys_step_rows: down and up move the chosen row and stop at the ends", async () => {
    const {element, chosen} = layout(ITEMS, 1);
    press(element, "ArrowDown");
    await settle();
    expect(chosen.value).toBe(2);
    expect(element.querySelector("[data-reader-row].on").dataset.row).toBe("2");
    press(element, "ArrowDown");
    press(element, "ArrowDown");
    await settle();
    expect(chosen.value).toBe(3);
    press(element, "ArrowUp");
    await settle();
    expect(chosen.value).toBe(2);
    expect(element.querySelector("[data-read]").textContent).toContain("very long title");
});

test("test_chosen_row_in_address: choosing a row writes it to the address, and an address with a row chooses it on load", async () => {
    const first = layout();
    first.element.querySelector('[data-row="3"]').click();
    await settle();
    expect(location.hash).toContain("row=3");
    document.body.innerHTML = "";
    location.hash = "#/skills?row=2";
    await new Promise((resolve) => setTimeout(resolve, 20));
    const reloaded = layout();
    await settle();
    expect(reloaded.chosen.value).toBe(2);
});

test("test_long_title_one_line_with_hover: a row holds the whole title for hover and draws it in the one-line title", () => {
    const {element} = layout();
    const row = element.querySelector('[data-row="2"]');
    expect(row.getAttribute("title")).toBe(ITEMS[1].title);
    expect(row.querySelector(".list-row-title").textContent).toBe(ITEMS[1].title);
});

test("an empty list says so, and a list with no row chosen asks for one", () => {
    expect(layout([]).element.textContent).toContain("Nothing here yet");
    expect(layout().element.textContent).toContain("No row chosen");
});

test("test_reader_tabs_and_facts: the reader shows its title, facts and tabs with counts, and the open tab picks the body", async () => {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({
        render: () => h(Reader, {title: "Journal", number: "12", abstract: "What the journal is", facts: [{name: "group", label: "Group", value: "Journal"}], tabs: [{key: "text", label: "Text"}, {key: "links", label: "Links", count: 3}]}, {
            default: ({tab}) => h("p", {"data-body": tab}, tab),
            primary: () => h("button", {"data-primary": ""}, "Edit"),
        }),
    }).mount(element);
    expect(element.querySelector("[data-resource-title]").textContent).toBe("Journal");
    expect(element.querySelector("[data-reader-number]").textContent).toBe("12");
    expect(element.querySelector("[data-resource-fields]").textContent).toContain("Journal");
    expect(element.querySelector('[data-tab="links"] [data-tab-count]').textContent).toBe("3");
    expect(element.querySelector('[data-tab="text"] [data-tab-count]')).toBeNull();
    expect(element.querySelector("[data-body]").textContent).toBe("text");
    element.querySelector('[data-tab="links"]').click();
    await settle();
    expect(element.querySelector("[data-body]").textContent).toBe("links");
    expect(element.querySelector("[data-primary]")).not.toBeNull();
});

test("test_open_first_chooses_the_first_row_when_the_address_names_none: a page that opens its first row shows it in the reader", async () => {
    const chosen = ref(null);
    const element = document.createElement("div");
    document.body.append(element);
    createApp({
        render: () => h(ListReaderLayout, {items: ITEMS, openFirst: true, chosen: chosen.value, "onUpdate:chosen": (id) => (chosen.value = id), listWidth: 460}, {reader: ({item}) => h("p", {"data-read": ""}, item.title)}),
    }).mount(element);
    await settle();
    expect(chosen.value).toBe(1);
    expect(element.querySelector("[data-read]").textContent).toBe("Journal");
});
