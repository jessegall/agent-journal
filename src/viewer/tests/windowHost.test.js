import {createApp, defineComponent, h, onMounted} from "vue";
import {expect, test} from "vitest";
import WindowHost from "../src/windows/WindowHost.vue";
import {WindowSubscriptions} from "../src/windows/windowSubscriptions.js";
import {useWindow} from "../src/windows/windowContext.js";

const following = defineComponent({
    setup() {
        const window = useWindow();
        onMounted(() => window.follow(["task.*"], () => {}));
        return () => h("p", "following tasks");
    },
});

const failing = defineComponent({
    setup() {
        throw new Error("the board could not draw");
    },
});

function mounted(component, subscriptions) {
    const element = document.createElement("div");
    document.body.appendChild(element);
    const app = createApp(() => h(WindowHost, {name: "notes.board", component, subscriptions, events: ["task.*"]}));
    app.mount(element);
    return {app, element};
}

test("the host stops every subscription of its window when the window is taken down", async () => {
    const subscriptions = new WindowSubscriptions();
    const {app} = mounted(following, subscriptions);
    await Promise.resolve();
    expect(subscriptions.count("notes.board")).toBe(1);
    app.unmount();
    expect(subscriptions.count("notes.board")).toBe(0);
});

test("an error a window throws shows in its own pane and leaves the next window drawn", async () => {
    const subscriptions = new WindowSubscriptions();
    const broken = mounted(failing, subscriptions);
    const working = mounted(following, subscriptions);
    await Promise.resolve();
    expect(broken.element.textContent).toContain("the board could not draw");
    expect(working.element.textContent).toContain("following tasks");
});

test("a window keeps a setting of its own and reads it back, or its fallback when it kept none", async () => {
    const {windowContext} = await import("../src/windows/windowContext.js");
    const kept = new Map();
    globalThis.fetch = async (url, request) => {
        const {line} = JSON.parse(request.body);
        if (line[1] === "save-setting") kept.set(line[3], line[4]);
        const value = kept.has(line[3]) ? JSON.parse(kept.get(line[3])) : undefined;
        return {json: async () => (line[1] === "save-setting" || value !== undefined ? {code: 0, value: {value}, error: ""} : {code: 1, value: null, error: "kept no setting"})};
    };
    const context = windowContext({window: "notes.board", environment: "main", agent: null, visible: () => true, permissions: {}, subscriptions: new WindowSubscriptions(), open: () => {}});
    expect(await context.setting("zoom", 1)).toBe(1);
    await context.keep("zoom", 2);
    await new Promise((resolve) => setTimeout(resolve, 110));
    expect(await context.setting("zoom", 1)).toBe(2);
    delete globalThis.fetch;
});

test("a window hears only the events it declared, whatever patterns it asks to follow", async () => {
    const {windowContext} = await import("../src/windows/windowContext.js");
    const subscriptions = new WindowSubscriptions();
    const heard = [];
    const context = windowContext({window: "notes.board", environment: "main", agent: null, visible: () => true, permissions: {}, events: ["task.*"], subscriptions, open: () => {}});
    context.follow(["task.*", "message.*", "*.*"], (event) => heard.push(event.event));
    subscriptions.dispatch({event: "task.create"});
    subscriptions.dispatch({event: "message.create"});
    expect(heard).toEqual(["task.create"]);
});
