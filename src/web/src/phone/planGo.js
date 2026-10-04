import {computed, onUnmounted, reactive, ref, watch} from "vue";
import {ended, perform} from "./outbox.js";
import {announce} from "./announce.js";
import {tick} from "./haptic.js";

const HOLD_SECONDS = 3;

export const WAITS = "waiting";
export const here = (plan) => Math.min(Math.max(plan.current, 1), plan.phases.length);
export const phaseAt = (plan, i) => plan.phases[i - 1];
export const closed = (phase) => phase.todos.filter((todo) => todo.done).length;
export const counted = (phase) => (phase.todos.length ? `${closed(phase)} of ${phase.todos.length} done` : "No to-dos yet");
export const share = (phase) => (phase.todos.length ? (closed(phase) / phase.todos.length) * 100 : 0);

export function usePlanGo(plan, refresh, failed) {
    const left = ref(0);
    const held = ref(false);
    const sent = ref(false);
    const waits = ref(false);
    const stale = ref(false);
    const trouble = ref("");
    const sendingNow = ref(false);
    let timer = 0;
    let sending = null;

    const seconds = computed(() => Number(plan.value?.hold ?? HOLD_SECONDS));

    function stop() {
        clearInterval(timer);
        held.value = false;
    }

    async function send() {
        if (sendingNow.value || !held.value) return;
        sendingNow.value = true;
        stop();
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
            else trouble.value = `That didn't go through: ${error.message}. Try again.`;
        } finally {
            sendingNow.value = false;
        }
    }

    function start() {
        if (held.value || sendingNow.value || sent.value || waits.value) return;
        sending = {n: plan.value.n, updated: plan.value.updated};
        stale.value = false;
        sent.value = false;
        waits.value = false;
        trouble.value = "";
        held.value = true;
        left.value = seconds.value;
        tick();
        timer = setInterval(() => {
            left.value -= 1;
            if (left.value <= 0) send();
        }, 1000);
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

    onUnmounted(stop);
    return reactive({left, held, sent, waits, stale, trouble, sendingNow, seconds, start, undo: stop, now: send, again});
}
