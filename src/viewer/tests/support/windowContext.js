import {createApp, h, nextTick, ref} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import {WindowSubscriptions} from "../../src/windows/windowSubscriptions.js";

export const page = (rows) => ({ok: true, value: {rows, page: 1, size: 50, total: rows.length}});

// the chat window's keys as its module declares them, so a test answers a key by the line that fills it
const WINDOW_KEYS = {
    messages: {line: "message feed", events: ["message.*"]},
    marks: {line: "chat-mark main", events: ["chat_mark.*"]},
    docks: {line: "dock-item main", events: ["dock_item.*"]},
    pins: {line: "pin list", events: ["pin.*"]},
};

const keyFlags = (name, state) => Object.entries(state).filter(([flag]) => flag.startsWith(`${name}.`)).map(([flag, value]) => ` --${flag.slice(name.length + 1)} ${value}`).join("");

export function context(answers, agent = null) {
    const reads = [];
    const read = async (line) => {
        reads.push(line);
        const key = Object.keys(answers).find((start) => line.startsWith(start));
        return key ? answers[key] : {ok: false, failure: "refused", error: `no answer for ${line}`};
    };
    return {
        reads,
        window: "test.window",
        environment: "main",
        agent,
        tabs: [],
        sources: [],
        subscriptions: new WindowSubscriptions(),
        links: {},
        visible: {value: true},
        permissions: {reads: [], runs: [], missing: [], ask: async () => true},
        read,
        async readKeys({only = [], state = {}}) {
            const names = only.length ? only : Object.keys(WINDOW_KEYS);
            const results = await Promise.all(names.map((name) => this.read(`${WINDOW_KEYS[name].line}${keyFlags(name, state)}`)));
            const declared = Object.fromEntries(Object.entries(WINDOW_KEYS).map(([name, key]) => [name, {tab: null, events: key.events, reload_seconds: 0}]));
            return {ok: true, value: {declared, keys: Object.fromEntries(names.map((name, index) => [name, results[index]]))}};
        },
        run: async () => ({ok: true, value: null}),
        follow: () => {},
        open: () => {},
        setting: async (key, fallback) => fallback,
        keep: async () => {},
        setOption: () => {},
        option: (key) => ({value: key === "figure" ? "none" : undefined}),
    };
}

export async function settle() {
    for (let round = 0; round < 5; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
}

export async function settleTransition() {
    await settle();
    await new Promise((resolve) => setTimeout(resolve, 80));
}

// the element a window component is drawn into once it has settled, given the props its host gives it
// a component with no window around it, drawn in the page's body
export function appended(component, props) {
    const element = document.createElement("div");
    document.body.append(element);
    createApp({render: () => h(component, props)}).mount(element);
    return element;
}

export async function mounted(component, windowContext, props = {}) {
    const element = document.createElement("div");
    const app = createApp({render: () => h(component, props)});
    app.provide(WINDOW_CONTEXT, windowContext);
    app.mount(element);
    await settle();
    return element;
}

export async function drawn(component, windowContext) {
    return (await mounted(component, windowContext)).textContent;
}

export async function mountedDock(component, windowContext, item) {
    const foot = ref(null);
    const row = ref(item);
    const option = windowContext.option;
    return mounted({render: () => h("div", [h("footer", {ref: foot}), h(component)])}, {
        ...windowContext,
        option: (key) => ({foot, row}[key] ?? option(key)),
    });
}

export async function pickButton(element, label, selector = "button") {
    [...element.querySelectorAll(selector)].find((button) => button.textContent.trim() === label).click();
    await settle();
}

export function typeInto(input, text) {
    input.value = text;
    input.dispatchEvent(new Event("input"));
}

// a fetch stand-in that answers one line at a time, as the stubs of these tests were written, also for the lines the viewer sends together
export const perLine = (answer) => async (url, init) => {
    if (url === "/api/read-lines") return {ok: true, status: 200, json: async () => ({reads: ["task list", "suite current"]})};
    if (!String(url).endsWith("/api/lines")) return answer(url, init);
    const answers = [];
    for (const line of JSON.parse(init.body).lines) answers.push(await (await answer("/api/line", {...init, body: JSON.stringify(line)})).json());
    return {ok: true, json: async () => ({answers})};
};
