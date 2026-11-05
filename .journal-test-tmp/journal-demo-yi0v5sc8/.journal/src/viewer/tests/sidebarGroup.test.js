import {createApp, h} from "vue";
import {expect, test} from "vitest";
import SidebarPages from "../src/shell/SidebarPages.vue";
import {WindowCatalogue} from "../src/windows/windowCatalogue.js";

const windows = [
    {name: "tasks.tasks", module: "journal.core.tasks", title: "Tasks"},
    {name: "plans.plans", module: "journal.core.plans", title: "Plans"},
    {name: "documents.documents", module: "journal.core.documents", title: "Documents"},
];

test("the pages of every module stand in one list in the sidebar, and none is a heading of its own", () => {
    const element = document.createElement("div");
    const app = createApp({render: () => h(SidebarPages, {windows, environments: [], current: "main"})});
    app.mount(element);
    const groups = [...element.querySelectorAll(".fold-head")].map((head) => head.textContent.trim());
    const items = [...element.querySelectorAll("[data-sidebar-window]")].map((item) => item.dataset.sidebarWindow);
    app.unmount();
    expect(groups.filter((name) => ["Tasks", "Plans", "Documents"].includes(name))).toEqual([]);
    expect(groups).not.toContain("Environment");
    expect(items).toEqual(["tasks.tasks", "plans.plans", "documents.documents"]);
});

test("changing a setting reloads the windows offered by the server", async () => {
    let offers = [{name: "developer.hook-requests", title: "Requests", place: "page", group: "developer"}];
    const catalogue = new WindowCatalogue(async () => ({windows: offers}));
    await catalogue.load();
    expect(catalogue.pages.value).toHaveLength(1);
    offers = [];
    await catalogue.heard({event: "setting.update"});
    expect(catalogue.pages.value).toHaveLength(0);
});

test("developer pages have their own section and disappear when no developer windows are offered", () => {
    localStorage.clear();
    const element = document.createElement("div");
    const app = createApp({render: () => h(SidebarPages, {windows: [...windows,
        {name: "developer.numbers", title: "Numbers", group: "developer"},
        {name: "developer.hook-requests", title: "Requests", group: "developer"},
    ]})});
    app.mount(element);
    expect(element.querySelector('[data-fold="developer"]').textContent).toContain("Developer");
    expect(element.querySelector('[data-sidebar-window="developer.hook-requests"]')).not.toBeNull();
    app.unmount();
    localStorage.clear();
    const plain = createApp({render: () => h(SidebarPages, {windows})});
    plain.mount(element);
    expect(element.querySelector('[data-fold="developer"]')).toBeNull();
    plain.unmount();
});
