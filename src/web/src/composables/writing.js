import {agentWorking} from "./leadAgent.js";
import {seconds} from "../domain/row.js";
import {store} from "../state/store.js";
import {computed, watch} from "vue";
import {useNow} from "./now.js";

const WRITING_FOR = 45;
const TICK = 3000;
const wrote = (entry) => (entry.actor || "").startsWith("agent") && ["created", "updated"].includes(entry.kind);

watch(
    () => store.entries.at(-1)?.id,
    () => {
        for (const entry of store.entries.filter(wrote)) {
            const key = `${entry.data.table}:${entry.data.id}`;
            const at = seconds(entry.created_at);
            if ((store.agentWrites[key]?.at || 0) < at) store.agentWrites[key] = {at, section: ""};
        }
    },
    {immediate: true}
);

// the rows the agent writes part by part while the user watches them fill
const WRITTEN_IN_PARTS = new Set(["docs", "reports"]);

export function useWriting(key) {
    const now = useNow(TICK);
    return computed(() => {
        if (!WRITTEN_IN_PARTS.has(key().split(":")[0])) return null;
        const write = store.agentWrites[key()];
        return write && agentWorking.value && now.value - write.at < WRITING_FOR ? write : null;
    });
}
