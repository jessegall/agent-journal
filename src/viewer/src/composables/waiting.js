import {computed, ref} from "vue";
import {stateOf, waitingOn} from "../domain/agentState.js";
import {agent} from "./leadAgent.js";
import {useWorkers} from "./workers.js";
import {useSharedNow} from "./now.js";

export function useWaiting(workers = useWorkers().rows, who = agent) {
    const now = useSharedNow();
    const waiting = computed(() => (stateOf(who.value) === "waiting" ? waitingOn(who.value, workers.value, now.value) : null));
    const open = ref(false);
    const anchor = ref(null);
    const toggle = (event) => {
        anchor.value = event.currentTarget;
        open.value = !open.value;
    };
    return {waiting, open, anchor, toggle};
}
