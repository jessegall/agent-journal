import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test} from "vitest";
import {inspectorWidth} from "../src/domain/inspectorWidths.js";
import {fresh} from "../src/domain/panes.js";
import {route} from "../src/route.js";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";
import {placeOnHome} from "../src/windows/placeOnHome.js";
import DiffCard from "../src/kit/DiffCard.vue";
import FileInspector from "../src/resource/FileInspector.vue";
import SidebarPages from "../src/shell/SidebarPages.vue";
import {placeUnder} from "../kit/vContext.js";
import {settle} from "./support/windowContext.js";

const apps = [];

beforeEach(() => (location.hash = ""));

afterEach(() => {
    apps.splice(0).forEach((app) => app.unmount());
    document.body.innerHTML = "";
    location.hash = "";
});

function mount(component, props) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(component, props)});
    app.directive("tip", {});
    app.mount(element);
    apps.push(app);
    return element;
}

test("test_inspector_width: the file inspector is the widest inspector, up to 1120 px and 92% of the window", () => {
    expect(inspectorWidth("wide")).toBe("min(1120px, 92vw)");
    const element = mount(FileInspector, {path: "src/cart.py", environment: "main"});
    expect(element.querySelector("[data-file-inspector]").getAttribute("style")).toContain("min(1120px, 92vw)");
});

test("test_open_files_page_primary: its title names the file, its one primary button opens the Files page on it, and Copy path and Show changes in Git are its actions", () => {
    const element = mount(FileInspector, {path: "src/cart.py", environment: "main"});
    expect(element.querySelector("[data-resource-title]").textContent).toBe("cart.py");
    const primary = element.querySelector("[data-file-inspector-open]");
    expect(primary.textContent).toBe("Open the Files page");
    expect(primary.classList.contains("primary")).toBe(true);
    const address = new URL(primary.href);
    expect(address.searchParams.get("page")).toBe("coding.files");
    expect(address.searchParams.get("file")).toBe("src/cart.py");
    expect(address.searchParams.get("environment")).toBe("main");
    expect(element.querySelector("[data-file-inspector-copy]")).not.toBeNull();
    expect(new URL(element.querySelector("[data-file-inspector-git]").href).searchParams.get("page")).toBe("coding.git");
});

test("test_feed_open_icon: a file of the feed has an icon that opens it in the file inspector, named by its path in the address", async () => {
    const element = mount(DiffCard, {path: "src/app/Main.vue", change: "edit", added: 1, removed: 0, at: "2026-11-03T10:00:00Z", rows: []});
    element.querySelector("[data-diff-open]").click();
    await settle();
    expect(location.hash).toBe("#?open=file:src%2Fapp%2FMain.vue");
    expect(route.value.open).toMatchObject({table: "file", id: "src/app/Main.vue"});
});

test("test_files_is_page_and_pane: a window that is a page and a pane is in the pane menu and in the sidebar", async () => {
    const offers = [{name: "coding.files", title: "Files", place: "pane_or_page"}, {name: "settings.settings", title: "Settings", place: "page"}, {name: "tasks.tasks", title: "Tasks", place: "pane"}];
    const catalogue = new WindowCatalogue(async () => ({windows: offers}));
    await catalogue.load();
    expect(catalogue.windows.value.map((window) => window.name)).toEqual(["coding.files", "tasks.tasks"]);
    expect(catalogue.pages.value.map((window) => window.name)).toEqual(["coding.files", "settings.settings"]);
});

test("a click on the Files row with Command or Control opens the inspector, and its menu has Place on Home when it can also be a pane", async () => {
    const lines = [];
    const windows = [{name: "coding.files", title: "Files", place: "pane_or_page", group: "project"}, {name: "settings.settings", title: "Settings", place: "page", group: "project"}];
    const element = mount(SidebarPages, {windows, current: "main", layoutLine: async (line) => (lines.push(line.join(" ")), {ok: false, error: "stopped here"})});
    const files = element.querySelector('[data-sidebar-window="coding.files"]');
    files.dispatchEvent(new MouseEvent("click", {bubbles: true, cancelable: true, metaKey: true}));
    await settle();
    expect(route.value.open).toMatchObject({table: "file", id: ""});
    const labels = (row) => placeUnder(row).items.map((item) => item.label);
    expect(labels(files)).toEqual(["Open", "Open in a new tab", "Copy link", "Place on Home"]);
    expect(labels(element.querySelector('[data-sidebar-window="settings.settings"]'))).not.toContain("Place on Home");
});

test("Place on Home puts the window in the largest pane of Home's saved layout and saves it, and does nothing when a pane already holds it", async () => {
    const layout = {...fresh(), panes: {1: {tabs: ["tasks.tasks"], active: "tasks.tasks"}}};
    const lines = [];
    const line = async (words) => {
        lines.push(words.join(" ").replace(/--layout .* --base-version/, "--layout LAYOUT --base-version"));
        if (words[0] === "suite") return {ok: true, value: {suite: "coding", drivers: "main: coding.builder, worker: coding.worker"}};
        if (words[1] === "current") return {ok: true, value: {layout: JSON.stringify(layout), version: 4}};
        return {ok: true, value: {version: 5}};
    };
    expect((await placeOnHome(line, "main", "coding.files")).ok).toBe(true);
    expect(lines).toEqual(["suite current main", "viewer-layout current --suite coding --page home --driver coding.builder", "viewer-layout save --suite coding --page home --driver coding.builder --layout LAYOUT --base-version 4"]);
    lines.length = 0;
    expect((await placeOnHome(line, "main", "tasks.tasks")).value).toBe("already");
    expect(lines.length).toBe(2);
});
