import {reactive, ref, watch} from "vue";
import {useHeldSend} from "../composables/heldSend.js";
import {ended, perform} from "./outbox.js";
import {announce, tryAgain} from "./announce.js";
import {tick} from "./haptic.js";

export const WAITS = "waiting";
export const here = (plan) => Math.min(Math.max(plan.current, 1), plan.phases.length);
export const phaseAt = (plan, i) => plan.phases[i - 1];
export const closed = (phase) => phase.todos.filter((todo) => todo.done).length;
export const phaseProgress = (phase) => (phase.todos.length ? `${closed(phase)} of ${phase.todos.length} done` : "No to-dos yet");
export const share = (phase) => (phase.todos.length ? (closed(phase) / phase.todos.length) * 100 : 0);

export function usePlanGo(plan, refresh, failed) {
    const sent = ref(false);
    const waits = ref(false);
    const stale = ref(false);
    const trouble = ref("");
    const sendingNow = ref(false);
    const {left, holding: held, length: seconds, start: hold, undo: stop, sendNow} = useHeldSend({seconds: () => plan.value?.hold, send});

    async function send(sending) {
        if (sendingNow.value) return;
        sendingNow.value = true;
        trouble.value = "";
        try {
            const went = await perform({kind: "proceed", n: sending.n, updated: sending.updated});
            waits.value = went === "held";
            sent.value = went !== "held";
            if (sent.value) announce("Continued");
            refresh();
        } catch (error) {
            if (error.status === 409) stale.value = true;
            else if (ended(error)) failed(error);
            else trouble.value = tryAgain(error);
        } finally {
            sendingNow.value = false;
        }
    }

    function start() {
        if (held.value || sendingNow.value || sent.value || waits.value) return;
        stale.value = false;
        sent.value = false;
        waits.value = false;
        trouble.value = "";
        tick();
        hold({n: plan.value.n, updated: plan.value.updated});
    }

    function again() {
        stale.value = false;
        refresh();
    }

    watch(
        () => [plan.value?.n, plan.value?.current, plan.value?.status],
        ([n, current, status], [beforeN, beforeCurrent, beforeStatus]) => {
            if (n === beforeN && current === beforeCurrent && status === beforeStatus) return;
            stop();
            sent.value = false;
            waits.value = false;
            stale.value = false;
            trouble.value = "";
        }
    );

    return reactive({left, held, sent, waits, stale, trouble, sendingNow, seconds, start, undo: stop, now: sendNow, again});
}
