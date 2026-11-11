import {createApp, h, reactive} from "vue";
import {afterEach, beforeEach, expect, test} from "vitest";
import AgentBar from "../src/shell/AgentBar.vue";
import SidebarPages from "../src/shell/SidebarPages.vue";
import {settle} from "./support/windowContext.js";

beforeEach(() => window.localStorage.clear());
afterEach(() => (document.body.innerHTML = ""));

const WINDOWS = [{name: "tasks.tasks", title: "Tasks", icon: "tasks", group: ""}];
const ENVIRONMENTS = [{id: 1, name: "main"}];

function drawn(props) {
    const state = reactive(props);
    const element = document.createElement("div");
    document.body.append(element);
    const app = createApp({render: () => h(SidebarPages, {...state, current: "main"})});
    app.mount(element);
    return {element, state, app};
}

test("a sidebar draws what it last showed at once, and moves nothing when the server answers", async () => {
    const first = drawn({windows: WINDOWS, environments: ENVIRONMENTS});
    await settle();
    first.app.unmount();
    const {element, state} = drawn({windows: [], environments: []});
    await settle();
    expect(element.querySelector('[data-sidebar-window="tasks.tasks"]')).not.toBeNull();
    expect(element.querySelector('[data-environment="main"]')).not.toBeNull();
    expect(element.querySelector("[aria-busy=true]")).toBeNull();
    const before = element.querySelector(".sidebar-scroll").textContent;
    Object.assign(state, {windows: WINDOWS, environments: ENVIRONMENTS});
    await settle();
    expect(element.querySelector(".sidebar-scroll").textContent).toBe(before);
});

test("a sidebar that never loaded in this browser shimmers", async () => {
    const {element} = drawn({windows: [], environments: []});
    await settle();
    expect(element.querySelector("[aria-busy=true]")).not.toBeNull();
});

test("the agent bar shimmers while it loads and says No session yet once it knows", async () => {
    const element = document.createElement("div");
    document.body.append(element);
    const state = reactive({loading: true});
    createApp({render: () => h(AgentBar, {agent: null, loading: state.loading})}).mount(element);
    await settle();
    expect(element.querySelector(".skeleton-line")).not.toBeNull();
    expect(element.textContent).not.toContain("No session yet");
    state.loading = false;
    await settle();
    expect(element.querySelector(".skeleton-line")).toBeNull();
    expect(element.textContent).toContain("No session yet");
});
