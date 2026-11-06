import {ref} from "vue";
import {expect, test, vi} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {suggestionWindowContext} from "./support/suggestionWindowContext.js";
import {useListTools} from "../kit/useListTools.js";
import SuggestionRows from "../../core/modules/suggestions/web/src/SuggestionRows.vue";
import QuestionRows from "../../core/modules/questions/web/src/QuestionRows.vue";
import Outputs from "../../core/modules/processes/web/src/Outputs.vue";
import PhoneRows from "../../core/modules/phone/web/src/PhoneRows.vue";
import ShareRows from "../../core/modules/sharing/web/src/ShareRows.vue";
import ServerRows from "../../core/modules/mcp/web/src/ServerRows.vue";
import TemplateCards from "../../core/modules/templates/web/src/TemplateCards.vue";
import CheckCards from "../../suites/coding/modules/checks/web/src/CheckCards.vue";
import DumpRows from "../../core/modules/dumps/web/src/DumpRows.vue";
import ReviewerSteps from "../../core/modules/reviews/web/src/ReviewerSteps.vue";
import SkillCatalogue from "../../core/modules/skills/web/src/SkillCatalogue.vue";

const ROWS = [{id: 3, title: "Zebra", open: true}, {id: 2, title: "Apple pie", open: false}, {id: 1, title: "Mango", open: true}];

test("words keep the results matching them, and the order sorts by title", () => {
    const tools = useListTools(ref(ROWS), {title: (row) => row.title});
    tools.words.value = "APPLE";
    expect(tools.shown.value.map((row) => row.id)).toEqual([2]);
    tools.words.value = "";
    expect(tools.shown.value.map((row) => row.id)).toEqual([3, 2, 1]);
    tools.order.value = "title";
    expect(tools.shown.value.map((row) => row.title)).toEqual(["Apple pie", "Mango", "Zebra"]);
    expect(tools.hasStates).toBe(false);
});

test("a list with states keeps open or closed rows", () => {
    const tools = useListTools(ref(ROWS), {title: (row) => row.title, isOpen: (row) => row.open});
    tools.state.value = "closed";
    expect(tools.shown.value.map((row) => row.id)).toEqual([2]);
    tools.state.value = "open";
    expect(tools.shown.value.map((row) => row.id)).toEqual([3, 1]);
});

test("a window's search narrows what it draws", async () => {
    const element = await mounted(SuggestionRows, suggestionWindowContext({"suggestion list": page([{id: 1, title: "Cart", answer: ""}, {id: 2, title: "Shop", answer: ""}])}));
    const input = element.querySelector("[data-search-input]");
    input.value = "shop";
    input.dispatchEvent(new Event("input"));
    await settle();
    expect(element.textContent).toContain("Shop");
    expect(element.textContent).not.toContain("Cart");
});

test("a list with states offers Open, Closed and All, another does not", async () => {
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        disconnect() {}
    });
    const menuOf = async (component, answers) => {
        document.body.innerHTML = "";
        const element = await mounted(component, component === SuggestionRows ? suggestionWindowContext(answers) : context(answers));
        document.body.append(element);
        element.querySelector("[data-search-menu]").click();
        await settle();
        return document.body.textContent;
    };
    expect(await menuOf(QuestionRows, {"question list": page([])})).toContain("Closed");
    expect(await menuOf(SuggestionRows, {"suggestion list": page([])})).not.toContain("Closed");
});

test.each([
    ["the commands", Outputs, {"process feed": page([])}],
    ["the phones", PhoneRows, {"phone list": page([])}],
    ["the links", ShareRows, {"share list": page([])}],
    ["the servers", ServerRows, {"mcp list": page([]), "mcp suggested": page([])}],
    ["the templates", TemplateCards, {"template list": page([])}],
    ["the checks", CheckCards, {"check list": page([])}],
    ["the dumps", DumpRows, {"dump board": {ok: true, value: {dumps: [], total: 0}}}],
    ["the reviews", ReviewerSteps, {"review board": {ok: true, value: {reviews: [], queued: 0}}}],
])("the list of %s has the bar", async (_, component, answers) => {
    const element = await mounted(component, context(answers));
    expect(element.querySelector("[data-list-tools]")).not.toBeNull();
});

test("the skills catalogue searches its skills", async () => {
    const {createApp, h, nextTick} = await import("vue");
    const element = document.createElement("div");
    createApp(() => h(SkillCatalogue, {rows: [{folder: "journal", description: "The rules"}, {folder: "cart", description: "Totals"}]})).mount(element);
    await nextTick();
    expect(element.querySelectorAll(".skill-entry")).toHaveLength(2);
    const search = element.querySelector("input");
    search.value = "cart";
    search.dispatchEvent(new Event("input"));
    await nextTick();
    expect([...element.querySelectorAll(".skill-name")].map((name) => name.textContent)).toEqual(["cart"]);
});

