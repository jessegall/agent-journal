import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle, typeInto as type} from "./support/windowContext.js";
import SecretRows from "../../core/modules/secrets/web/src/SecretRows.vue";

afterEach(() => (document.body.innerHTML = ""));

const SECRET = {id: 3, title: "Shop key", brief: "For the shop", secret_type: "api key", fields: [], filled: [], programs: [], proposed: [], helpers: true};

async function drawn(rows = [], deleted = []) {
    const ran = [];
    const window = context({"secret list --deleted": page(deleted), "secret list": page([SECRET, ...rows])});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    return {element: await mounted(SecretRows, window), ran};
}


test("a new secret is made with its kind, title and note", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-secret-new]").click();
    await settle();
    const form = element.querySelector("[data-secret-draft]");
    [...form.querySelectorAll("button")].find((button) => button.textContent.trim() === "Login").click();
    await settle();
    const [title, note] = form.querySelectorAll("input");
    type(title, "Mail");
    type(note, "The mail server");
    await settle();
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(ran).toContainEqual(["secret", "make", "Mail", "--kind", "login", "--brief", "The mail server"]);
    expect(element.querySelector("[data-secret-draft]")).toBeNull();
});

test("a secret's title and note are edited", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-secret-edit-open]").click();
    await settle();
    const form = element.querySelector("[data-secret-edit]");
    type(form.querySelector("input"), "Shop token");
    await settle();
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(ran).toContainEqual(["secret", "update", "3", "--title", "Shop token", "--brief", "For the shop"]);
});

test("deleting asks first", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-secret-delete]").click();
    await settle();
    expect(ran).toEqual([]);
    element.querySelector("[data-secret-confirm]").click();
    await settle();
    expect(ran).toContainEqual(["secret", "delete", "3"]);
});

test("every deleted secret is listed and can be restored", async () => {
    const {element, ran} = await drawn([], [{...SECRET, id: 9, title: "Old key"}]);
    expect(element.querySelector("[data-secret-removed]").textContent).toContain("Old key");
    element.querySelector("[data-secret-restore]").click();
    await settle();
    expect(ran).toContainEqual(["secret", "restore", "9"]);
});

const CUSTOM = {...SECRET, id: 4, title: "Own", secret_type: "custom", fields: [{name: "token", hidden: true}]};

test("a custom secret adds and removes fields, and another kind does not", async () => {
    const {element, ran} = await drawn([CUSTOM]);
    expect(element.querySelector('[data-row="3"] [data-secret-field-add]')).toBeNull();
    const form = element.querySelector('[data-row="4"] [data-secret-field-add]');
    type(form.querySelector("input"), "region");
    await settle();
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(ran).toContainEqual(["secret", "update", "4", "--add-field", "region"]);
    element.querySelector('[data-secret-field-remove="token"]').click();
    await settle();
    expect(ran).toContainEqual(["secret", "update", "4", "--remove-field", "token"]);
});

test("a program is allowed by name", async () => {
    const {element, ran} = await drawn();
    const form = element.querySelector("[data-secret-program-add]");
    type(form.querySelector("input"), "gh");
    await settle();
    form.dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(ran).toContainEqual(["secret", "allow", "3", "gh"]);
});


test("a new custom secret asks for its first field", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-secret-new]").click();
    await settle();
    [...element.querySelectorAll("[data-secret-draft] button")].find((button) => button.textContent.trim() === "Custom").click();
    await settle();
    type(element.querySelector('[aria-label="Title"]'), "Own");
    await settle();
    expect(element.querySelector("[data-secret-create]").disabled).toBe(true);
    type(element.querySelector("[data-secret-first-field]"), "token");
    await settle();
    element.querySelector("[data-secret-draft]").dispatchEvent(new Event("submit", {cancelable: true}));
    await settle();
    expect(ran).toContainEqual(["secret", "make", "Own", "--kind", "custom", "--field", "token"]);
});
