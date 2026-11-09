import {createApp, h} from "vue";
import {WINDOW_CONTEXT} from "@journal/window-kit";
import MessageCard from "../../kit/MessageCard.vue";
import {context, settle} from "./windowContext.js";

// a message card drawn into the document with the given props, and the window context it reads from
export async function mountedMessageCard(props, windowContext = context({})) {
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(MessageCard, props)});
    app.provide(WINDOW_CONTEXT, windowContext);
    app.mount(host);
    await settle();
    return {host, unmount: () => { app.unmount(); host.remove(); }};
}
