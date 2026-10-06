import {agent} from "./leadAgent.js";
import {store} from "../state/store.js";
import {computed, watch} from "vue";
import {useNow} from "./now.js";

const WRITING_FOR = 45;
const TICK = 3000;
const wrote = (event) => event.actor === "agent" && ["created", "updated"].includes(event.action) && !event.data?.seen;

watch(
    () => store.events.at(-1)?.id,
    () => {
        for (const event of store.events.filter(wrote)) {
            const key = `${event.type}:${event.n}`;
            if ((store.agentWrites[key]?.at || 0) < event.at) store.agentWrites[key] = {at: event.at, section: event.data?.section || ""};
        }
    },
    {immediate: true}
);

export function useWriting(key) {
    const now = useNow(TICK);
    return computed(() => {
        const write = store.agentWrites[key()];
        const working = agent.value && ["busy", "working"].includes(agent.value.data.status);
        return write && working && now.value - write.at < WRITING_FOR ? write : null;
    });
}
