import {createApp, h, nextTick} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";

export const page = (rows) => ({ok: true, value: {rows, page: 1, size: 50, total: rows.length}});

export function context(answers, agent = null) {
    const reads = [];
    return {
        reads,
        window: "test.window",
        environment: "main",
        agent,
        tabs: [],
        visible: {value: true},
        permissions: {reads: [], runs: [], missing: [], ask: async () => true},
        read: async (line) => {
            reads.push(line);
            const key = Object.keys(answers).find((start) => line.startsWith(start));
            return key ? answers[key] : {ok: false, failure: "refused", error: `no answer for ${line}`};
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
    if (!String(url).endsWith("/api/lines")) return answer(url, init);
    const answers = [];
    for (const line of JSON.parse(init.body).lines) answers.push(await (await answer("/api/line", {...init, body: JSON.stringify(line)})).json());
    return {ok: true, json: async () => ({answers})};
};
