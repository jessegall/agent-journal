import {createApp, h, withDirectives} from "vue";
import {afterEach, beforeEach, expect, test} from "vitest";
import ContextMenuHost from "../src/shell/ContextMenuHost.vue";
import ToastArea from "../src/kit/ToastArea.vue";
import {usePageToasts} from "../src/composables/toasts.js";
import {deleteItem} from "../src/domain/contextItems.js";
import {vContext} from "../kit/vContext.js";
import {settle} from "./support/windowContext.js";

const apps = [];
const sent = [];
const removed = [];

// a page with its toasts, as HomePage and ViewWindow have them, and one row whose menu holds the delete item it is given
function mountRow(item) {
    const element = document.createElement("div");
    document.body.append(element);
    const row = {render: () => withDirectives(h("li", {"data-row": ""}, "Row"), [[vContext, () => ({head: "Row", items: [item]})]])};
    const page = {
        setup() {
            const toasts = usePageToasts(async (line) => (sent.push(line), {ok: true}));
            return () => h("main", [h(row), h(ToastArea, {toasts})]);
        },
    };
    const app = createApp(page);
    app.mount(element);
    apps.push(app);
    const host = document.createElement("div");
    document.body.append(host);
    const hostApp = createApp(ContextMenuHost);
    hostApp.mount(host);
    apps.push(hostApp);
    return element.querySelector("[data-row]");
}

beforeEach(() => {
    sent.length = 0;
    removed.length = 0;
});

afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
});

const menu = () => document.body.querySelector("[data-context-menu]");
const deleteButton = () => menu().querySelector(".context-danger");
const text = () => deleteButton().querySelector(".context-label").textContent;
const toast = () => document.body.querySelector("[data-toast-text]")?.textContent;
const remove = async () => (removed.push("gone"), {ok: true});

async function open(row) {
    row.dispatchEvent(new MouseEvent("contextmenu", {bubbles: true, cancelable: true, clientX: 10, clientY: 10}));
    await settle();
}

test("test_first_click_asks: the first click on Delete turns it into its confirm text and sends nothing", async () => {
    const row = mountRow(deleteItem({name: "memory 12", remove, restore: ["memory", "restore", "12"]}));
    await open(row);
    expect(text()).toBe("Delete");
    deleteButton().click();
    await settle();
    expect(menu()).not.toBeNull();
    expect(text()).toBe("Delete: click again");
    expect(removed).toEqual([]);
    expect(toast()).toBeUndefined();
});

test("test_second_click_deletes: the second click sends the delete, closes the menu and says what was deleted", async () => {
    const row = mountRow(deleteItem({word: "Remove", name: "memory 12", remove, restore: ["memory", "restore", "12"]}));
    await open(row);
    deleteButton().click();
    await settle();
    expect(text()).toBe("Remove: click again");
    deleteButton().click();
    await settle();
    expect(removed).toEqual(["gone"]);
    expect(menu()).toBeNull();
    expect(toast()).toBe("Removed memory 12");
});

test("test_undo_runs_restore: the toast after a delete has an Undo that runs the row's restore command", async () => {
    const row = mountRow(deleteItem({name: "memory 12", remove, restore: ["memory", "restore", "12"]}));
    await open(row);
    deleteButton().click();
    await settle();
    deleteButton().click();
    await settle();
    document.body.querySelector("[data-toast-undo]").click();
    await settle();
    expect(sent).toEqual([["memory", "restore", "12"]]);
    expect(toast()).toBeUndefined();
});

test("test_no_undo_without_restore: a row whose model has no restore command gets no Undo", async () => {
    const row = mountRow(deleteItem({name: "rule 3", remove}));
    await open(row);
    deleteButton().click();
    await settle();
    deleteButton().click();
    await settle();
    expect(toast()).toBe("Deleted rule 3");
    expect(document.body.querySelector("[data-toast-undo]")).toBeNull();
});

test("test_secret_erase_text: a secret asks with the erase text and has no Undo", async () => {
    const row = mountRow(deleteItem({name: "Sentry token", remove, erase: true, restore: ["never", "used"]}));
    await open(row);
    deleteButton().click();
    await settle();
    expect(text()).toBe("Click again: the value is erased for good");
    deleteButton().click();
    await settle();
    expect(removed).toEqual(["gone"]);
    expect(toast()).toBe("Deleted Sentry token. The value is erased.");
    expect(document.body.querySelector("[data-toast-undo]")).toBeNull();
});

test("a delete the journal refuses says why and offers no Undo", async () => {
    const row = mountRow(deleteItem({name: "memory 12", remove: async () => ({ok: false, error: "Memory 12 is in use"}), restore: ["memory", "restore", "12"]}));
    await open(row);
    deleteButton().click();
    await settle();
    deleteButton().click();
    await settle();
    expect(toast()).toBe("Memory 12 is in use");
    expect(document.body.querySelector("[data-toast-undo]")).toBeNull();
});
