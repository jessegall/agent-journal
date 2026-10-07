import {saveViewerSetting, settingsLoaded, viewerSetting} from "./settings.js";
import {onUnmounted, ref, watch} from "vue";
import {boxAround} from "../platform/boxes.js";
import {useFollowedBox} from "./followedBox.js";
import {pollKey, startPoll} from "./poll.js";

const KEY = "tour_seen";
const START_AFTER = 800;

const around = (selector) => boxAround([...document.querySelectorAll(selector)]);

export function useTour(steps, menu) {
    const step = ref(-1);
    const rect = ref(null);
    let stopWaiting = () => {};

    function measure() {
        const now = steps[step.value];
        if (!now) return;
        if (now.menu && !menu.isOpen()) menu.open();
        rect.value = around(now.target) || (now.fallback ? around(now.fallback) : null);
    }

    const {follow, stop} = useFollowedBox(measure);

    function go(at) {
        step.value = at;
        if (!steps[at].menu && menu.isOpen()) menu.close();
        rect.value = null;
        requestAnimationFrame(measure);
    }

    const covered = () => Boolean(document.querySelector(".dialog, .veil"));

    function attempt() {
        const since = Date.now();
        stopWaiting = startPoll(
            pollKey(),
            async () => Date.now() - since >= START_AFTER && !covered(),
            START_AFTER,
            (clear) => {
                if (!clear) return;
                stopWaiting();
                start();
            }
        );
    }

    function start() {
        go(0);
        follow();
    }

    function end() {
        if (step.value < 0) return;
        if (steps[step.value].menu) menu.close();
        step.value = -1;
        rect.value = null;
        stop();
        saveViewerSetting(KEY, true);
    }

    const next = () => (step.value >= steps.length - 1 ? end() : go(step.value + 1));
    const key = (e) => e.key === "Escape" && end();

    watch(
        settingsLoaded,
        (loaded) => {
            if (loaded && !viewerSetting(KEY, false) && step.value < 0) attempt();
        },
        {immediate: true}
    );
    window.addEventListener("keydown", key);
    onUnmounted(() => {
        stopWaiting();
        window.removeEventListener("keydown", key);
    });
    return {step, rect, next, end};
}
