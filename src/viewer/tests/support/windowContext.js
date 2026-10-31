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
    };
}

export async function settle() {
    for (let round = 0; round < 5; round++) await nextTick();
    await new Promise((resolve) => setTimeout(resolve));
}

// the element a window component is drawn into once it has settled, given the props its host gives it
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
