import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import ButtonSlot from "../src/kit/ButtonSlot.vue";
import ButtonForm from "../src/kit/ButtonForm.vue";
import {ButtonSlot as KitSlot, ButtonForm as KitForm, SplitButton, KIT_VERSION} from "@journal/window-kit";
import {startButtons} from "../src/domain/buttons.js";
import {AllowancePrompts} from "../src/windows/allowancePrompts.js";
import {perLine, pickButton, settle, typeInto} from "./support/windowContext.js";

const ROW = {id: 12, term: "plan", title: "A better journal", state: "ready"};
const BASE = {name: "plans.review", slots: ["row.plan"], label: "Critique", runs: "plan review {row_id}", fields: [], menu: [], icon: "", primary: false, condition: null, tip: ""};
const FIELDS = [
    {name: "size", label: "Size", choices: [{key: "short", label: "Short"}, {key: "full", label: "Full"}], default: ""},
    {name: "message", label: "Message"},
    {name: "template", label: "Template", target: "plan", purpose: "review", default_title: ""},
];
const TEMPLATES = [{id: 1, title: "General critique", module: "journal.core.templates", brief: "Check the plan"},
    {id: 2, title: "Security review", module: "acme.review", brief: "Check access and data"}];
const mounted = [];
let offers, writes, reads, writeAnswer;

beforeEach(() => {
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        unobserve() {}
        disconnect() {}
    });
    offers = [];
    writes = [];
    reads = [];
    writeAnswer = async () => ({code: 0, value: {}, error: ""});
    vi.stubGlobal("fetch", perLine(async (url, init) => {
        if (String(url).startsWith("/api/buttons")) return {ok: true, status: 200, json: async () => ({buttons: offers, missing: {}})};
        const body = JSON.parse(init.body);
        if (body.line[0] === "template") {
            reads.push(body);
            return {ok: true, json: async () => ({code: 0, value: {rows: TEMPLATES}, error: ""})};
        }
        writes.push(body);
        return {ok: true, json: writeAnswer};
    }));
});

afterEach(() => {
    mounted.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

async function drawn(component, props) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(component, props)});
    app.directive("tip", {});
    app.mount(element);
    mounted.push(app);
    await settle();
    return element;
}

async function slot(buttons, props = {}) {
    offers = buttons;
    await startButtons("main", new AllowancePrompts(async () => ({ok: true}))).load();
    return drawn(ButtonSlot, {name: "row.plan", row: ROW, environment: "main", ...props});
}

test("the kit exports standalone slots, forms and split buttons at version 1.2.0", () => {
    expect(KitSlot).toBe(ButtonSlot);
    expect(KitForm).toBe(ButtonForm);
    expect(SplitButton).toBeTruthy();
    expect(KIT_VERSION).toBe("1.2.0");
});

test("the journal's buttons come first, with declaration order preserved in each group", async () => {
    const element = await slot([
        {...BASE, name: "review.first", from: "acme.review", label: "External first"},
        {...BASE, name: "plans.first", label: "Journal first"},
        {...BASE, name: "review.second", from: "acme.review", label: "External second"},
        {...BASE, name: "plans.second", label: "Journal second"},
    ]);
    expect([...element.querySelectorAll("[data-button]")].map((button) => button.textContent.trim()))
        .toEqual(["Journal first", "Journal second", "External first", "External second"]);
});

test("a missing condition field allows a button, while a present wrong state hides it", async () => {
    const element = await slot([
        {...BASE, name: "plans.present", condition: {field: "state", values: ["draft"]}},
        {...BASE, name: "plans.absent", label: "Available", condition: {field: "stage", values: ["draft"]}},
    ]);
    expect(element.querySelector('[data-button="plans.present"]')).toBeNull();
    expect(element.querySelector('[data-button="plans.absent"]')).not.toBeNull();
});

test("a slot without a row hides row commands and readOnly hides every button", async () => {
    const element = await slot([BASE, {...BASE, name: "plans.list", runs: "plan list", label: "List"}], {row: null});
    expect(element.textContent).toBe("List");
    const readOnly = await slot([BASE], {readOnly: true});
    expect(readOnly.querySelector("button")).toBeNull();
});

test("a third party's tip includes its module and its menu sends its own declared command", async () => {
    const element = await slot([{...BASE, from: "acme.review", tip: "Check the plan", menu_label: "Review options",
        menu: [{label: "Check security", runs: "plan security {row_id}", fields: [], description: "Access and data"}]}]);
    expect(element.querySelector("[data-button]").title).toBe("From acme.review · Check the plan");
    element.querySelector('[aria-label="Review options"]').click();
    await settle();
    await pickButton(document.body, "Check securityAccess and data");
    expect(writes.at(-1)).toMatchObject({line: ["plan", "security", "12"], environment: "main"});
});

test("every choice, text and template field is required before sending", async () => {
    await drawn(ButtonForm, {button: {...BASE, fields: FIELDS, runs: "plan review {row_id} {size} --message={message} --template={template}"}, row: ROW, environment: "main"});
    const form = document.querySelector("[data-button-form]");
    expect(document.querySelector('[role="dialog"]').getAttribute("aria-label")).toContain("Plan 12");
    expect(form.querySelector("[data-button-send]").disabled).toBe(true);
    await pickButton(form, "Short");
    typeInto(form.querySelector("textarea"), "A message with spaces");
    await settle();
    expect(form.querySelector("[data-button-send]").disabled).toBe(true);
    [...form.querySelectorAll('[role="radio"]')].find((option) => option.textContent.includes("Security review")).click();
    await settle();
    expect(form.textContent).toContain("Check access and data");
    expect(form.querySelector("[data-button-send]").disabled).toBe(false);
    await pickButton(form, "Send");
    expect(writes.at(-1).line).toEqual(["plan", "review", "12", "short", "--message=A message with spaces", "--template=2"]);
    expect(reads[0]).toMatchObject({window: "messages.chat", line: ["template", "list", "--target", "plan", "--purpose", "review"], environment: "main"});
});

test.each(["Security review", "General critique"])("a template field picks its default title %s", async (title) => {
    const field = {...FIELDS[2], purpose: "critique", default_title: title === "General critique" ? "" : title};
    await drawn(ButtonForm, {button: {...BASE, fields: [field]}, row: ROW, environment: "main"});
    expect(document.querySelector('[aria-checked="true"]').textContent).toContain(title);
    expect(document.querySelector("[data-button-send]").disabled).toBe(false);
});

test("a refusal keeps typed text and shows the error; a double click sends once", async () => {
    let finish;
    writeAnswer = () => new Promise((resolve) => { finish = resolve; });
    await drawn(ButtonForm, {button: {...BASE, fields: [FIELDS[1]], runs: "plan review {row_id} --message={message}"}, row: ROW, environment: "main"});
    const form = document.querySelector("[data-button-form]");
    typeInto(form.querySelector("textarea"), "Keep this text");
    await settle();
    const send = form.querySelector("[data-button-send]");
    send.click();
    send.click();
    await settle();
    expect(writes).toHaveLength(1);
    finish({code: 1, value: null, error: "The plan is under review"});
    await settle();
    expect(form.querySelector("textarea").value).toBe("Keep this text");
    expect(form.querySelector('[role="alert"]').textContent).toContain("The plan is under review");
    expect(document.querySelector('[role="dialog"]')).not.toBeNull();
});
