import {createApp, h, nextTick, ref} from "vue";
import {afterEach, beforeEach, expect, test, vi} from "vitest";
import SidebarPages from "../src/shell/SidebarPages.vue";
import Breadcrumb from "../src/shell/Breadcrumb.vue";
import StageTopButtons from "../src/windows/StageTopButtons.vue";

const lineResult = vi.hoisted(() => vi.fn());
vi.mock("../src/windows/windowContext.js", () => ({lineResult}));
const {useTabCounts} = await import("../src/composables/tabCounts.js");

beforeEach(() => localStorage.clear());
afterEach(() => (document.body.innerHTML = ""));

function drawn(component, props) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(component, props)});
    app.directive("tip", {});
    app.mount(element);
    return {element, unmount: () => app.unmount()};
}

const page = (name, title, group = "project") => ({name, title, group});
const WINDOWS = [page("documents.documents", "Documents"), page("checks.checks", "Checks"), page("project-rules.rules", "Rules"), page("secrets.secrets", "Secrets")];
const ENVIRONMENTS = [{id: 5, name: "development", folder: "/work/agent-journal", branch: "version-5"}, {id: 2, name: "main", folder: "/work/agent-journal", branch: ""}];

test("the sidebar head shows the project's name and the current environment's branch and number", () => {
    const {element} = drawn(SidebarPages, {windows: WINDOWS, environments: ENVIRONMENTS, current: "development", project: "agent-journal"});
    expect(element.querySelector(".sidebar-name").textContent).toBe("agent-journal");
    expect(element.querySelector("[data-sidebar-environment]").textContent).toBe("version-5 · environment 5");
});

test("an environment on no branch shows only its number under the project's name", () => {
    const {element} = drawn(SidebarPages, {windows: WINDOWS, environments: ENVIRONMENTS, current: "main", project: "agent-journal"});
    expect(element.querySelector("[data-sidebar-environment]").textContent).toBe("environment 2");
});

test("the group titles are plain words with no arrow", () => {
    const {element} = drawn(SidebarPages, {windows: WINDOWS, environments: ENVIRONMENTS, current: "development"});
    const heads = [...element.querySelectorAll(".fold-head")];
    expect(heads.map((head) => head.textContent.trim())).toEqual(["Work", "Agents", "Connect", "Environments"]);
    expect(heads.every((head) => !head.querySelector("svg, .icon"))).toBe(true);
});

test("a sidebar row shows the count its window's count line answered", () => {
    const counts = {"checks.checks": {count: 1, warm: false}, "project-rules.rules": {count: 1, warm: false}, "secrets.secrets": {count: 2, warm: false}, "documents.documents": {count: 4, warm: false}};
    const {element} = drawn(SidebarPages, {windows: WINDOWS, environments: ENVIRONMENTS, current: "development", counts});
    const countOf = (name) => element.querySelector(`[data-sidebar-window="${name}"] .item-count`).textContent;
    expect([countOf("documents.documents"), countOf("checks.checks"), countOf("project-rules.rules"), countOf("secrets.secrets")]).toEqual(["4", "1", "1", "2"]);
});

test("a count line counts the rows of a list: the total of a paged answer, every row of an unpaged one", async () => {
    const entries = {"documents.documents": {name: "documents.documents", count: "doc list", events: []}, "secrets.secrets": {name: "secrets.secrets", count: "secret list", events: []}};
    lineResult.mockImplementation(async (name) => ({ok: true, value: name === "documents.documents" ? {rows: [{id: 1}], page: 1, size: 1, total: 4} : {rows: [{id: 1}, {id: 2}]}}));
    let counts = ref({});
    const {unmount} = drawn({setup: () => {
        counts = useTabCounts({catalogue: {window: (name) => entries[name]}, subscriptions: {follow: () => {}}, environment: "development", names: () => Object.keys(entries)}).counts;
        return () => null;
    }});
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
    expect(counts.value).toEqual({"documents.documents": {count: 4, warm: false}, "secrets.secrets": {count: 2, warm: false}});
    unmount();
});

test("the top bar has a search field with the command-K hint, and Command K opens search", () => {
    const views = [];
    const {element} = drawn(StageTopButtons, {waiting: 4, pairedPhones: [], onView: (name) => views.push(name)});
    const search = element.querySelector("[data-top-search]");
    expect(search.textContent).toContain("Search");
    expect(search.querySelector("[data-top-search-key]").textContent).toBe("⌘K");
    window.dispatchEvent(new KeyboardEvent("keydown", {key: "k", metaKey: true}));
    search.click();
    expect(views).toEqual(["search.search", "search.search"]);
});

test("the top bar's bell carries the count of what waits on you", () => {
    const {element} = drawn(StageTopButtons, {waiting: 4, pairedPhones: []});
    expect(element.querySelector("[data-top-bell-count]").textContent).toBe("4");
});

test("the breadcrumb names the project, the environment and the page", () => {
    const {element} = drawn(Breadcrumb, {project: "agent-journal", environment: "version-5", page: "Home"});
    expect(element.querySelector("[data-crumb-project]").textContent).toBe("agent-journal");
    expect([...element.querySelectorAll(".crumb")].map((crumb) => crumb.textContent)).toEqual(["agent-journal", "version-5", "Home"]);
});
