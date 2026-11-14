import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";
import CardPage from "../kit/CardPage.vue";
import {settle} from "./support/windowContext.js";

afterEach(() => (document.body.innerHTML = ""));

const ITEMS = [
    {id: 1, title: "GitHub token", icon: "key", state: "Used 4 min ago", line: "gh, curl", group: "Keys"},
    {id: 2, title: "Sentry token", icon: "key", state: "", line: "", fault: "Needs a value", group: "Keys"},
    {id: 3, title: "Status band", icon: "plug", state: "version 1.4.0", line: "A band over the chat", group: "Plugins"},
];
const FIELDS = [{key: "group", label: "Group", options: [["Keys", "Keys"], ["Plugins", "Plugins"]], get: (item) => item.group}];

function page(slots = {}) {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(CardPage, {title: "Secrets", items: ITEMS, fields: FIELDS}, slots)}).mount(element);
    return element;
}

test("test_cards_same_lines: every card has its name, state line, line and foot in the same places, a dash where there is nothing", () => {
    const element = page();
    const cards = [...element.querySelectorAll("[data-page-card]")];
    expect(cards.length).toBe(3);
    for (const card of cards) {
        const order = [...card.children].map((part) => part.tagName + (part.dataset.cardLine !== undefined ? "-line" : ""));
        expect(order.slice(0, 2)).toEqual(["HEADER", "P-line"]);
        expect(card.lastElementChild.dataset.cardFoot).toBeDefined();
        expect(card.querySelector("[data-card-state]")).not.toBeNull();
    }
    const bare = element.querySelector('[data-row="2"]');
    expect(bare.querySelector("[data-card-state]").textContent).toBe("—");
    expect(bare.querySelector("[data-card-line]").textContent).toBe("—");
    expect(bare.querySelector("[data-card-fault]").textContent).toBe("Needs a value");
    expect(element.querySelector('[data-row="1"] [data-card-fault]')).toBeNull();
    expect(element.querySelector("h1").textContent).toContain("Secrets");
});

test("test_corner_slot: the corner slot of each card holds what the page puts there, and a group filter narrows the cards", async () => {
    const element = page({corner: ({item}) => h("button", {"data-corner": item.id}, "On")});
    expect([...element.querySelectorAll("[data-card-corner] [data-corner]")].map((corner) => corner.dataset.corner)).toEqual(["1", "2", "3"]);
    element.querySelector('[data-filter-chip="group"] .filter-chip-main').click();
    await settle();
    document.body.querySelector('[data-filter-option="Plugins"]').click();
    await settle();
    expect([...element.querySelectorAll("[data-page-card]")].map((card) => card.dataset.row)).toEqual(["3"]);
});
