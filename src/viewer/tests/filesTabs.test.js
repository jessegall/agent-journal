import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test} from "vitest";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {settle} from "./support/windowContext.js";
import {projectFilesWindowContext} from "./support/projectFilesWindowContext.js";
import ProjectFiles from "../../suites/coding/web/src/ProjectFiles.vue";

const apps = [];
const row = (id, extra = {}) => ({id, name: id.split("/").at(-1), folder: false, size: 0, git: "", ...extra});
const press = (key) => document.dispatchEvent(new KeyboardEvent("keydown", {key, bubbles: true, cancelable: true}));

beforeEach(() => history.replaceState(null, "", "/?"));

afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    history.replaceState(null, "", "/?");
});

// a Files window drawn into the page, with the files it reads and the lines it was asked for
async function drawn() {
    const reads = [];
    const window = projectFilesWindowContext({});
    window.read = async (words) => {
        const line = Array.isArray(words) ? words.join(" ") : words;
        reads.push(line);
        if (line.startsWith("project-file show")) return {ok: true, value: {path: line.slice(18), text: `text of ${line.slice(18)}`, cut: false}};
        return {ok: true, value: {rows: line.endsWith(" shop") ? [row("shop/cart.py"), row("shop/tax.py")] : [row("shop", {folder: true})]}};
    };
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(ProjectFiles)});
    app.provide(WINDOW_CONTEXT, window);
    app.mount(element);
    apps.push(app);
    await settle();
    return {element, reads, unmount: () => (app.unmount(), apps.splice(apps.indexOf(app), 1))};
}

const tabs = (element) => [...element.querySelectorAll("[data-files-tabs] [data-tab]")].map((tab) => tab.dataset.tab);
const onTab = (element) => element.querySelector('[data-files-tabs] [data-tab][aria-selected="true"]')?.dataset.tab;

async function openFile(element, path) {
    if (!element.querySelector(`[data-file="${path}"]`)) {
        element.querySelector('[data-folder="shop"]').click();
        await settle();
    }
    element.querySelector(`[data-file="${path}"]`).click();
    await settle();
}

test("test_open_file_opens_tab: opening a file from the tree opens its tab, named by the file, and shows it", async () => {
    const {element} = await drawn();
    expect(element.querySelector("[data-files-tabs]")).toBeNull();
    await openFile(element, "shop/cart.py");
    expect(tabs(element)).toEqual(["shop/cart.py"]);
    expect(element.querySelector('[data-tab="shop/cart.py"]').textContent).toContain("cart.py");
    expect(onTab(element)).toBe("shop/cart.py");
    expect(element.querySelector(".files-line").textContent).toContain("text of shop/cart.py");
});

test("test_open_again_focuses_tab: a file that is already open is focused, not opened twice, and the cross closes a tab", async () => {
    const {element} = await drawn();
    await openFile(element, "shop/cart.py");
    await openFile(element, "shop/tax.py");
    expect(tabs(element)).toEqual(["shop/cart.py", "shop/tax.py"]);
    await openFile(element, "shop/cart.py");
    expect(tabs(element)).toEqual(["shop/cart.py", "shop/tax.py"]);
    expect(onTab(element)).toBe("shop/cart.py");
    element.querySelector('[data-tab="shop/tax.py"]').click();
    await settle();
    expect(onTab(element)).toBe("shop/cart.py");
    element.querySelector('[data-tab="shop/cart.py"] .pane-tab-x').click();
    await settle();
    expect(tabs(element)).toEqual(["shop/tax.py"]);
    expect(onTab(element)).toBe("shop/tax.py");
    element.querySelector('[data-tab="shop/tax.py"]').dispatchEvent(new MouseEvent("auxclick", {bubbles: true, cancelable: true, button: 1}));
    await settle();
    expect(tabs(element)).toEqual([]);
    expect(element.querySelector(".files-line")).toBeNull();
});

test("test_tabs_kept_on_reload: the open tabs and the file shown are written in the address and a window opened again has them", async () => {
    const first = await drawn();
    await openFile(first.element, "shop/cart.py");
    await openFile(first.element, "shop/tax.py");
    const params = new URLSearchParams(location.search);
    expect(params.get("files")).toBe("shop%2Fcart.py,shop%2Ftax.py");
    expect(params.get("files-at")).toBe("shop/tax.py");
    first.unmount();
    document.body.innerHTML = "";
    const again = await drawn();
    expect(tabs(again.element)).toEqual(["shop/cart.py", "shop/tax.py"]);
    expect(onTab(again.element)).toBe("shop/tax.py");
    expect(again.reads).toContain("project-file show shop/tax.py");
});

test("test_two_files_windows_own_tabs: two Files windows keep their own tabs and their own place in the address, and the keys go to the one used last", async () => {
    const first = await drawn();
    const second = await drawn();
    await openFile(first.element, "shop/cart.py");
    await openFile(second.element, "shop/tax.py");
    expect(tabs(first.element)).toEqual(["shop/cart.py"]);
    expect(tabs(second.element)).toEqual(["shop/tax.py"]);
    const params = new URLSearchParams(location.search);
    expect(params.get("files")).toBe("shop%2Fcart.py");
    expect(params.get("files2")).toBe("shop%2Ftax.py");
    first.element.querySelector("[data-files]").dispatchEvent(new MouseEvent("pointerdown", {bubbles: true}));
    press("t");
    await settle();
    expect(first.element.querySelector("[data-files-palette]")).not.toBeNull();
    expect(second.element.querySelector("[data-files-palette]")).toBeNull();
    first.element.querySelector("[data-palette-field]").dispatchEvent(new KeyboardEvent("keydown", {key: "Escape", bubbles: true}));
    await settle();
    second.element.querySelector("[data-files]").dispatchEvent(new MouseEvent("pointerdown", {bubbles: true}));
    press("t");
    await settle();
    expect(second.element.querySelector("[data-files-palette]")).not.toBeNull();
    expect(first.element.querySelector("[data-files-palette]")).toBeNull();
});
