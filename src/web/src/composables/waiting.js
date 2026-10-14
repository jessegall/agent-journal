import {computed, ref} from "vue";
import {rows} from "../sync/rows.js";
import {stateOf, waitingOn} from "../domain/agentState.js";
import {agent} from "./leadAgent.js";
import {useHelpers} from "./helpers.js";
import {useSharedNow} from "./now.js";

export function useWaiting(helpers = useHelpers().rows, who = agent, works = () => rows("work")) {
    const now = useSharedNow();
    const waiting = computed(() => (stateOf(who.value, works()) === "waiting" ? waitingOn(who.value, works(), helpers.value, now.value) : null));
    const open = ref(false);
    const anchor = ref(null);
    const toggle = (event) => {
        anchor.value = event.currentTarget;
        open.value = !open.value;
    };
    return {waiting, open, anchor, toggle};
}
