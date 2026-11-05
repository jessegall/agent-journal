import {createApp, h, nextTick} from "vue";
import {afterEach, expect, test} from "vitest";
import SidebarPages from "../src/shell/SidebarPages.vue";
import NewEnvironment from "../src/shell/NewEnvironment.vue";

afterEach(() => (document.body.innerHTML = ""));

const windows = [{name: "messages.chat", title: "Chat", group: ""}, {name: "coding.files", title: "Files", group: "project"}, {name: "settings.settings", title: "Settings", group: "project"}];

function drawn(component, props) {
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(component, props)});
    app.directive("tip", {});
    app.mount(element);
    return element;
}

test("the sidebar shows every page in one list, under no heading", () => {
    const element = drawn(SidebarPages, {windows, environments: [], current: "main"});
    expect(element.querySelector('[data-fold="project"]')).toBeNull();
    expect(element.querySelector('[data-fold="environment"]')).toBeNull();
    expect([...element.querySelectorAll("[data-sidebar-window]")].map((page) => page.textContent.trim())).toEqual(["Chat", "Files", "Settings"]);
    expect(element.textContent).toContain("Home");
});

test("a new environment needs its name and folder, and is made with its branch", async () => {
    const ran = [];
    const made = [];
    drawn(NewEnvironment, {run: async (line) => (ran.push(line), {ok: true, value: {}}), onMade: (name) => made.push(name)});
    await nextTick();
    const field = (name) => document.querySelector(`[data-environment-${name}]`);
    expect(document.querySelector("[data-environment-create]").disabled).toBe(true);
    for (const [name, words] of [["name", "review"], ["folder", "/work/review"], ["branch", "main"]]) {
        field(name).value = words;
        field(name).dispatchEvent(new Event("input"));
    }
    await nextTick();
    document.querySelector("[data-environment-create]").click();
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
    expect(ran).toEqual([["environment", "make", "review", "/work/review", "--branch", "main"]]);
    expect(made).toEqual(["review"]);
});

test("a refused environment says why and stays open", async () => {
    const made = [];
    drawn(NewEnvironment, {run: async () => ({ok: false, error: "that name is taken"}), onMade: (name) => made.push(name)});
    await nextTick();
    for (const [name, words] of [["name", "main"], ["folder", "/work"]]) {
        const field = document.querySelector(`[data-environment-${name}]`);
        field.value = words;
        field.dispatchEvent(new Event("input"));
    }
    await nextTick();
    document.querySelector("[data-environment-create]").click();
    await new Promise((resolve) => setTimeout(resolve));
    await nextTick();
    expect(document.body.textContent).toContain("that name is taken");
    expect(made).toEqual([]);
});
