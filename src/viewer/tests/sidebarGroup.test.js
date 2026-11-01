import {createApp, h} from "vue";
import {expect, test} from "vitest";
import SidebarPages from "../src/shell/SidebarPages.vue";

const windows = [
    {name: "tasks.tasks", module: "journal.core.tasks", title: "Tasks"},
    {name: "plans.plans", module: "journal.core.plans", title: "Plans"},
    {name: "documents.documents", module: "journal.core.documents", title: "Documents"},
];

test("the windows of every module stand in one group of the sidebar", () => {
    const element = document.createElement("div");
    const app = createApp({render: () => h(SidebarPages, {windows, environments: [], current: "main"})});
    app.mount(element);
    const groups = [...element.querySelectorAll(".fold-head")].map((head) => head.textContent.trim());
    const items = [...element.querySelectorAll("[data-sidebar-window]")].map((item) => item.dataset.sidebarWindow);
    app.unmount();
    expect(groups.filter((name) => ["Tasks", "Plans", "Documents"].includes(name))).toEqual([]);
    expect(groups).toContain("Windows");
    expect(items).toEqual(["tasks.tasks", "plans.plans", "documents.documents"]);
});
