import {afterEach, expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import SecretRows from "../../core/modules/secrets/web/src/SecretRows.vue";

afterEach(() => (document.body.innerHTML = ""));

const SECRET = {id: 3, title: "Shop key", brief: "For the shop", secret_type: "api key", fields: [], filled: [], programs: [], proposed: [], helpers: true};

async function drawn() {
    const ran = [];
    const window = context({"secret list": page([SECRET])});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    return {element: await mounted(SecretRows, window), ran};
}

const type = (input, text) => {
    input.value = text;
    input.dispatchEvent(new Event("input"));
};

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

test("deleting asks first, and a deleted secret can be restored", async () => {
    const {element, ran} = await drawn();
    element.querySelector("[data-secret-delete]").click();
    await settle();
    expect(ran).toEqual([]);
    element.querySelector("[data-secret-confirm]").click();
    await settle();
    expect(ran).toContainEqual(["secret", "delete", "3"]);
    element.querySelector("[data-secret-restore]").click();
    await settle();
    expect(ran).toContainEqual(["secret", "restore", "3"]);
    expect(element.querySelector("[data-secret-removed]")).toBeNull();
});
