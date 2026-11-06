import {createApp, h, unref} from "vue";
import DockStack from "../../src/chat/DockStack.vue";
import {WINDOW_CONTEXT} from "../../src/windows/windowContext.js";
import {dockWindow} from "./dockWindow.js";

let app;

export function stacked(items, folded = false) {
    const host = document.createElement("div");
    document.body.append(host);
    app = createApp({render: () => h(DockStack, {items, folded: unref(folded)})});
    app.provide(WINDOW_CONTEXT, dockWindow());
    app.mount(host);
    return host;
}

export function unmountStacked() {
    app?.unmount();
}
