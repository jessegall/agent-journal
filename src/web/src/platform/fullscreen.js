import {watch} from "vue";
import {store} from "../state/store.js";

let entered = false;

export function followFullscreen() {
    watch(
        () => store.wide,
        (on) => {
            const page = document.documentElement;
            if (on && !document.fullscreenElement && page.requestFullscreen)
                page.requestFullscreen()
                    .then(() => (entered = true))
                    .catch(() => {});
            if (!on && document.fullscreenElement) document.exitFullscreen().catch(() => {});
        }
    );
    document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement) return;
        if (entered && store.wide) store.wide = false;
        entered = false;
    });
}
