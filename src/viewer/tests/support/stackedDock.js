import {createApp, h} from "vue";
import DockStack from "../../src/chat/DockStack.vue";
import {WINDOW_CONTEXT} from "../../src/windows/windowContext.js";

let app;

export function stacked(items) {
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(DockStack, {items})});
    app.provide(WINDOW_CONTEXT, {environment: "main"});
    app.mount(host);
    return host;
}

export function unmountStacked() {
    app?.unmount();
}
