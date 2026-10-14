import {reactive, watch} from "vue";
import {api} from "./api.js";
import {route} from "./route.js";

export const live = reactive({latest: 0, version: 0, online: true});

async function poll() {
    try {
        const got = await api.since(live.latest);
        live.online = true;
        if (got.latest !== live.latest) {
            live.latest = got.latest;
            live.version += 1;
        }
    } catch {
        live.online = false;
    }
}

watch(() => route.env, () => {
    live.latest = 0;
    live.version += 1;
});

export function startLive(every = 2000) {
    poll();
    setInterval(poll, every);
}
