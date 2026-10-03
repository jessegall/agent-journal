import {computed, reactive, watch} from "vue";
import {useNow} from "./now.js";
import {agent, store} from "../state/store.js";

const WRITING_FOR = 45;
const TICK = 3000;
const lastWrite = reactive({});
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

export function useWriting(key) {
    const now = useNow(TICK);
    return computed(() => {
        const write = lastWrite[key()];
        const working = agent.value && ["busy", "working"].includes(agent.value.data.status);
        return write && working && now.value - write.at < WRITING_FOR ? write : null;
    });
}
