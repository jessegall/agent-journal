import {computed, reactive, ref, watch} from "vue";
import {store} from "../state/store.js";

const WRITING_FOR = 45;
const TICK = 3000;
const lastWrite = reactive({});
const now = ref(Date.now() / 1000);
const wrote = (event) => event.actor === "agent" && ["created", "updated"].includes(event.action) && !event.data?.seen;

watch(
    () => store.events.at(-1)?.id,
    () => {
        for (const event of store.events.filter(wrote)) {
            const key = `${event.type}:${event.n}`;
            if ((lastWrite[key]?.at || 0) < event.at) lastWrite[key] = {at: event.at, section: event.data?.section || ""};
        }
    },
    {immediate: true}
);
setInterval(() => (now.value = Date.now() / 1000), TICK);

export function useWriting(key) {
    return computed(() => {
        const write = lastWrite[key()];
        return write && now.value - write.at < WRITING_FOR ? write : null;
    });
}
