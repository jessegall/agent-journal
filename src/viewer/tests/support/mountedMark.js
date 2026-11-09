import {createApp, h, nextTick} from "vue";
import ChatMark from "../../src/kit/ChatMark.vue";

// a chat mark drawn into the document
export async function mountedMark(mark) {
    const host = document.createElement("div");
    document.body.append(host);
    const app = createApp({render: () => h(ChatMark, {mark})});
    app.mount(host);
    await nextTick();
    return {host, unmount: () => { app.unmount(); host.remove(); }};
}
