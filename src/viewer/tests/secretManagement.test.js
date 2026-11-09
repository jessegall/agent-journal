import {afterEach, expect, test, vi} from "vitest";
import {context as baseContext, mounted, settle, typeInto as type} from "./support/windowContext.js";

const KEYS = {secrets: {line: "secret board", events: ["secret.*"]}};
const context = (answers) => baseContext({"secret board": {ok: true, value: {rows: answers["secret list"].value.rows, deleted: answers["secret list --deleted"].value.rows}}}, null, KEYS);
const page = (rows) => ({ok: true, value: {rows}});
import SecretRows from "../../core/modules/secrets/web/src/SecretRows.vue";

afterEach(() => (document.body.innerHTML = ""));

const SECRET = {id: 3, title: "Shop key", brief: "For the shop", secret_type: "api key", fields: [{name: "key", hidden: true}], filled: ["key"], programs: [], proposed: [], helpers: false, waiting: false};
const CUSTOM = {...SECRET, id: 4, title: "Own", secret_type: "custom", fields: [{name: "token", hidden: true}], filled: ["token"]};
const ASKED = {...SECRET, id: 5, title: "GitHub login", secret_type: "login", fields: [{name: "username", hidden: false}, {name: "password", hidden: true}], filled: [], proposed: ["gh"], waiting: true};

async function drawn(rows = [SECRET], deleted = []) {
    const ran = [];
    const window = context({"secret list --deleted": page(deleted), "secret list": page(rows)});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    return {element: await mounted(SecretRows, window), ran};
}

async function update(element, id) {
    element.querySelector(`[data-row="${id}"] [data-secret-update]`).click();
    await settle();
}

const save = async () => {
    document.body.querySelector("[data-secret-save]").click();
    await settle();
};

test("the page shows no input, and a card says what is set in the same rows whatever is configured", async () => {
    const {element} = await drawn([SECRET, {...SECRET, id: 8, brief: "", programs: ["curl", "gh"], helpers: true}]);
    expect(element.querySelector("input")).toBeNull();
    expect(element.textContent).not.toContain("Needs a value");
    expect(element.querySelector('[data-row="3"] [data-secret-programs]').textContent).toBe("Programs: none");
    expect(element.querySelector('[data-row="8"] [data-secret-programs]').textContent).toBe("Programs: curl, gh");
    expect(element.querySelector('[data-row="8"] .note').textContent).toBe("Note: none");
    expect(element.querySelector('[data-row="3"] [data-secret-helpers-line]').textContent).toBe("Helpers: cannot use it");
});

test("what waits on the user is one button, apart from the saved secrets, and opens the dialog", async () => {
    const {element, ran} = await drawn([SECRET, ASKED]);
    const ask = element.querySelector('[data-secret-ask="5"]');
    expect(ask.textContent).toContain("GitHub login");
    expect(ask.textContent).toContain("Add credentials");
    expect(element.querySelector('[data-row="5"]')).toBeNull();
    ask.click();
    await settle();
    expect(document.body.textContent).toContain("The agent requested these credentials");
    type(document.body.querySelector('[data-secret-value="password"]'), "hunter2");
    await settle();
    await save();
    expect(ran).toEqual([["secret", "fill", "5", "password", "hunter2"]]);
});

test("nothing waiting shows no button", async () => {
    const {element} = await drawn();
    expect(element.querySelector("[data-secret-asks]")).toBeNull();
});

test("Cancel drops what was typed and Save applies all of it at once", async () => {
    const {element, ran} = await drawn();
    await update(element, 3);
    const titled = () => document.body.querySelector("[data-secret-title] input") ?? document.body.querySelector("input[data-secret-title]");
    type(titled(), "Shop token");
    await settle();
    [...document.body.querySelectorAll("button")].find((button) => button.textContent.trim() === "Cancel").click();
    await settle();
    expect(ran).toEqual([]);
    await update(element, 3);
    type(titled(), "Shop token");
    type(document.body.querySelector('[data-secret-value="key"]'), "new-value");
    document.body.querySelector("[data-secret-helpers]").click();
    await settle();
    await save();
    await vi.waitFor(() => expect(ran).toEqual([["secret", "fill", "3", "key", "new-value"], ["secret", "allow", "3", "--helpers"], ["secret", "update", "3", "--title", "Shop token", "--brief", "For the shop"]]));
});

test("a refused change keeps the dialog open and says justification", async () => {
    const {element} = await drawn();
    const window = context({"secret list --deleted": page([]), "secret list": page([SECRET])});
    window.run = async () => ({ok: false, error: "the value is too long"});
    document.body.innerHTML = "";
    const refused = await mounted(SecretRows, window);
    await update(refused, 3);
    type(document.body.querySelector('[data-secret-value="key"]'), "x");
    await settle();
    await save();
    expect(document.body.textContent).toContain("the value is too long");
    expect(element).toBeTruthy();
});

test("a custom secret adds and removes fields in its dialog, and another type does not", async () => {
    const {element, ran} = await drawn([SECRET, CUSTOM]);
    await update(element, 3);
    expect(document.body.querySelector("[data-secret-field-add]")).toBeNull();
    [...document.body.querySelectorAll("button")].find((button) => button.textContent.trim() === "Cancel").click();
    await settle();
    await update(element, 4);
    const form = document.body.querySelector("[data-secret-field-add]");
    type(form.querySelector("input"), "region");
    await settle();
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    document.body.querySelector('[data-secret-field-remove="token"]').click();
    await settle();
    type(document.body.querySelector('[data-secret-value="region"]'), "eu");
    await settle();
    await save();
    await vi.waitFor(() => expect(ran).toEqual([["secret", "update", "4", "--add-field", "region"], ["secret", "update", "4", "--remove-field", "token"], ["secret", "fill", "4", "region", "eu"]]));
});

test("a program is allowed by name, or from what the agent proposed", async () => {
    const {element, ran} = await drawn([{...SECRET, proposed: ["gh"]}]);
    await update(element, 3);
    document.body.querySelector('[data-secret-allow="gh"]').click();
    await settle();
    const form = document.body.querySelector("[data-secret-program-add]");
    type(form.querySelector("input"), "curl");
    await settle();
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    await save();
    expect(ran).toEqual([["secret", "allow", "3", "gh"], ["secret", "allow", "3", "curl"]]);
});

test("deleting asks first", async () => {
    vi.stubGlobal("ResizeObserver", class {
        observe() {}
        disconnect() {}
    });
    const {element, ran} = await drawn();
    document.body.append(element);
    element.querySelector("[data-secret-more] button, button[data-secret-more]").click();
    await settle();
    document.body.querySelector("[data-secret-delete]").click();
    await settle();
    expect(ran).toEqual([]);
    document.body.querySelector("[data-secret-confirm]").click();
    await settle();
    expect(ran).toContainEqual(["secret", "delete", "3"]);
});

test("every deleted secret is listed and can be restored", async () => {
    const {element, ran} = await drawn([SECRET], [{...SECRET, id: 9, title: "Old key"}]);
    expect(element.querySelector("[data-secret-removed]").textContent).toContain("Old key");
    element.querySelector("[data-secret-restore]").click();
    await settle();
    expect(ran).toContainEqual(["secret", "restore", "9"]);
});

test("a new secret is made with its type, title and note, and a custom one asks for its first field", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-secret-new]").click();
    await settle();
    document.body.querySelector('[data-secret-type="custom"]').click();
    await settle();
    const input = (mark) => document.body.querySelector(`[${mark}] input`) ?? document.body.querySelector(`input[${mark}]`);
    type(input("data-secret-new-title"), "Own");
    await settle();
    expect(document.body.querySelector("[data-secret-create]").disabled).toBe(true);
    type(input("data-secret-first-field"), "token");
    type(input("data-secret-new-note"), "For the own server");
    await settle();
    document.body.querySelector("[data-secret-create]").click();
    await settle();
    expect(ran).toContainEqual(["secret", "make", "Own", "--type", "custom", "--field", "token", "--brief", "For the own server"]);
});
