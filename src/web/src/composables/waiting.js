import {computed, ref} from "vue";
import {rows} from "../sync/rows.js";
import {stateOf, waitingOn} from "../domain/agentState.js";
import {agent} from "./leadAgent.js";
import {useHelpers} from "./helpers.js";
import {useNow} from "./now.js";

const MINUTE = 30;

export function useWaiting(helpers = useHelpers().rows) {
    const now = useNow(MINUTE);
    const waiting = computed(() => (stateOf(agent.value, rows("work")) === "waiting" ? waitingOn(agent.value, rows("work"), helpers.value, now.value) : null));
    const open = ref(false);
    const anchor = ref(null);
    const toggle = (event) => {
        anchor.value = event.currentTarget;
        open.value = !open.value;
    };
    return {waiting, open, anchor, toggle};
}
