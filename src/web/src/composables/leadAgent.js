import {computed} from "vue";
import {store} from "../state/store.js";

const stopped = (a) => (a.data.status === "stopped" ? 1 : 0);
export const agent = computed(
    () =>
        [...store.agents].filter((a) => !a.data.parent).sort((a, b) => stopped(a) - stopped(b) || (b.data.at || 0) - (a.data.at || 0))[0] ||
        null
);
