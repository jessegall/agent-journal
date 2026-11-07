import {createApp} from "vue";
import ActionOutput from "./ActionOutput.vue";

export function showActionOutput(text) {
    const host = document.body.appendChild(document.createElement("div"));
    const app = createApp(ActionOutput, {text, onClose: () => {
        app.unmount();
        host.remove();
    }});
    app.mount(host);
}
