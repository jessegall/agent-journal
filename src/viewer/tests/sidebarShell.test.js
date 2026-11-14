import {createApp, h} from "vue";
import {afterEach, beforeEach, expect, test} from "vitest";
import SidebarPages from "../src/shell/SidebarPages.vue";
import {pageTitle, sidebarSections} from "../src/domain/sidebarNav.js";

const page = (name, title, group = "project") => ({name, title, group});
const OFFERED = [
    page("reminders.reminders", "Reminders"),
    page("coding.git", "Git", "footer"),
    page("settings.settings", "Settings"),
    page("skills.skills", "Skills"),
    page("search.search", "Search"),
    page("secrets.secrets", "Secrets"),
    page("memories.memories", "Memories"),
    page("documents.page", "Document reader"),
    page("drivers.nudges", "Nudges"),
    page("tools.tools", "Tools"),
    page("tunnel.tunnel", "Tunnel"),
    page("tunler.account", "Tunler"),
    page("settings.project-hooks", "Hooks"),
    page("project-rules.rules", "Rules"),
    page("templates.templates", "Templates"),
    page("sequences.sequences", "Sequences"),
    page("developer.system-logs", "System logs", "developer"),
    page("developer.numbers", "Numbers", "developer"),
];

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

function drawn(windows) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(SidebarPages, {windows, environments: [], current: "main"})});
    app.mount(element);
    return {element, unmount: () => app.unmount()};
}

test("test_nav_order: the pages stand in the design's groups and order, and what the design does not place goes under More", () => {
    const sections = sidebarSections(OFFERED);
    expect(sections.map((section) => [section.key, section.windows.map((window) => window.name)])).toEqual([
        ["pages", ["search.search"]],
        ["work", ["documents.page", "coding.git"]],
        ["agents", ["skills.skills", "memories.memories", "project-rules.rules", "templates.templates", "sequences.sequences", "reminders.reminders"]],
        ["connect", ["secrets.secrets"]],
        ["developer", ["developer.numbers", "developer.system-logs"]],
        ["more", ["drivers.nudges"]],
        ["foot", ["settings.settings"]],
    ]);
    const shown = drawn(OFFERED);
    const rows = [...shown.element.querySelectorAll("[data-sidebar-window]")].map((row) => row.dataset.sidebarWindow);
    expect(rows.indexOf("skills.skills")).toBeLessThan(rows.indexOf("memories.memories"));
    expect(rows.indexOf("memories.memories")).toBeLessThan(rows.indexOf("project-rules.rules"));
    expect(rows.indexOf("sequences.sequences")).toBeLessThan(rows.indexOf("reminders.reminders"));
    expect([...shown.element.querySelectorAll(".fold-head")].map((head) => head.textContent.trim()).slice(0, 4)).toEqual(["Work", "Agents", "Connect", "Developer"]);
    expect(shown.element.querySelector(".sidebar-settings").dataset.sidebarWindow).toBe("settings.settings");
    shown.unmount();
});

test("the tunnel, the tunler account, the hooks and the program tools are not rows of the sidebar, since Settings holds them", () => {
    const listed = sidebarSections(OFFERED).flatMap((section) => section.windows.map((window) => window.name));
    for (const name of ["tunnel.tunnel", "tunler.account", "settings.project-hooks", "tools.tools"]) expect(listed).not.toContain(name);
});

test("test_developer_group_hidden_by_default: with no developer page offered the sidebar has no Developer group", () => {
    const offered = OFFERED.filter((window) => window.group !== "developer");
    const shown = drawn(offered);
    expect(shown.element.querySelector('[data-fold="developer"]')).toBeNull();
    expect(sidebarSections(offered).map((section) => section.key)).not.toContain("developer");
    shown.unmount();
});

test("test_page_title: the top bar names a page as the design does, and falls back to what the window calls itself", () => {
    expect(pageTitle("project-rules.rules", "Project rules")).toBe("Rules");
    expect(pageTitle("developer.hook-requests", "Requests")).toBe("Request log");
    expect(pageTitle("updates.updates", "Updates")).toBe("Change log");
    expect(pageTitle("tools.tools", "Tools")).toBe("Tools");
    expect(pageTitle("unknown.page")).toBe("");
});
