import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {placeUnder} from "../kit/vContext.js";
import {menuEntries} from "../src/composables/contextMenu.js";
import {mounted, settle, typeInto, unmountAll} from "./support/windowContext.js";
import {templateWindowContext as context} from "./support/templateWindowContext.js";
import TemplateCards from "../../core/modules/templates/web/src/TemplateCards.vue";

const OWN = {id: 7, title: "Task: bug", brief: "What happens", targets: ["task"], purpose: "Report a bug", parts: ["What happens: {what}", "How to see it: {steps}"], commands: [], module: "", created_at: "2026-11-01T10:00:00Z"};
const PUBLISHED = {id: 1, title: "General critique", brief: "Read it as a whole", targets: ["plan"], purpose: "critique", parts: [], commands: ["pytest tests -q"], module: "journal.core.templates", created_at: "2026-10-01T10:00:00Z"};

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}});
    location.hash = "";
});
afterEach(() => {
    unmountAll();
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function drawn() {
    const ran = [];
    const window = context({});
    window.read = async () => ({ok: true, value: {rows: [PUBLISHED, OWN]}});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    const element = await mounted(TemplateCards, window);
    document.body.append(element);
    await settle();
    return {element, ran};
}
const rowOf = (element, id) => element.querySelector(`[data-row="${id}"]`);
const choose = async (element, id) => {
    rowOf(element, id).click();
    await settle();
};
const type = async (name, text) => {
    const field = document.body.querySelector(`[data-field="${name}"]`);
    field.value = text;
    field.dispatchEvent(new Event(field.tagName === "SELECT" ? "change" : "input", {bubbles: true}));
    await settle();
};
const send = async () => {
    document.body.querySelector("[data-create-send]").click();
    await settle();
};
const labels = (element, id) => menuEntries(placeUnder(rowOf(element, id)).items).filter((entry) => !entry.separator).map((entry) => entry.label);

test("test_send_on_row_dialog: Send it on a row asks for the kind of row, its number and a value for each slot, and runs template send", async () => {
    const {element, ran} = await drawn();
    await choose(element, 7);
    expect(rowOf(element, 7).textContent).not.toMatch(/template|module/i);
    expect(element.querySelector("[data-reader-number]").textContent).toBe("7");
    expect([...element.querySelectorAll("[data-template-part]")].map((part) => part.textContent.trim())).toEqual(["What happens {what}", "How to see it {steps}"]);
    element.querySelector("[data-template-send]").click();
    await settle();
    expect([...document.body.querySelectorAll("[data-field]")].map((field) => field.dataset.field)).toEqual(["kind", "row", "slot-what", "slot-steps"]);
    await type("row", "twelve");
    await type("slot-what", "it breaks");
    await type("slot-steps", "press save");
    await send();
    expect(document.body.querySelector('[data-refused="row"]').textContent).toBe("Write the number of the row.");
    await type("row", "12");
    expect(document.body.querySelector("[data-command-preview]").textContent).toBe("journal template send 7 --on=task:12 --set=what=… --set=steps=…");
    await send();
    expect(ran).toContainEqual(["template", "send", "7", "--on=task:12", "--set=what=it breaks", "--set=steps=press save"]);
});

test("test_edit_only_for_own_template: a template a user made has Edit in its reader, and Edit saves it through template edit", async () => {
    const {element, ran} = await drawn();
    await choose(element, 7);
    element.querySelector("[data-template-edit]").click();
    await settle();
    expect(document.body.querySelector('[data-field="title"]').value).toBe("Task: bug");
    await type("brief", "What goes wrong");
    document.body.querySelectorAll("[data-part-remove]")[0].click();
    await settle();
    await send();
    expect(ran).toContainEqual(["template", "edit", "7", "--title", "Task: bug", "--brief", "What goes wrong", "--targets", "task", "--purpose", "Report a bug", "--parts", "How to see it: {steps}"]);
    expect(document.body.querySelector("[data-create-dialog]")).toBeNull();
});

test("test_published_has_no_edit: a template a module published has no Edit in its reader, and says it is not changed", async () => {
    const {element} = await drawn();
    await choose(element, 1);
    expect(element.querySelector("[data-template-edit]")).toBeNull();
    expect(element.querySelector("[data-template-fixed]").textContent).toBe("Once made, a template is not changed: make a new one.");
    expect([...element.querySelectorAll("[data-template-command]")].map((command) => command.textContent)).toEqual(["pytest tests -q"]);
    expect(element.querySelector("[data-template-send]")).not.toBeNull();
    await choose(element, 7);
    expect(element.querySelector("[data-template-fixed]")).toBeNull();
});

test("test_menu_items: a right click has Use, and Edit only on a template a user made", async () => {
    const {element} = await drawn();
    expect(labels(element, 7)).toEqual(["Use", "Edit"]);
    expect(labels(element, 1)).toEqual(["Use"]);
    const spoken = [];
    menuEntries(placeUnder(rowOf(element, 7)).items).find((entry) => entry.label === "Edit").run({say: (text) => spoken.push(text)});
    await settle();
    expect(document.body.querySelector('[data-field="title"]').value).toBe("Task: bug");
});

test("test_new_template: New makes a template from its title, description and parts through template make", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-template-new]").click();
    await settle();
    await type("title", "Review: design");
    await type("brief", "Screens and states");
    typeInto(document.body.querySelector("[data-part-text]"), "What a person sees");
    await settle();
    document.body.querySelector("[data-part-add]").click();
    await settle();
    typeInto(document.body.querySelectorAll("[data-part-text]")[1], "Each state");
    await settle();
    await send();
    expect(ran).toContainEqual(["template", "make", "Review: design", "--applies-to", "plan", "--brief", "Screens and states", "--purpose", "", "--parts", "What a person sees | Each state"]);
});
