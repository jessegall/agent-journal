import {onUnmounted, ref, watch} from "vue";
import {saveViewerSetting, settingsLoaded, viewerSetting} from "./viewerSetting.js";

const KEY = "tour_seen";
const START_AFTER = 800;
const FOLLOW = 250;

function around(selector) {
    const boxes = [...document.querySelectorAll(selector)].map((el) => el.getBoundingClientRect()).filter((r) => r.width > 4);
    if (!boxes.length) return null;
    return {
        l: Math.min(...boxes.map((r) => r.left)),
        t: Math.min(...boxes.map((r) => r.top)),
        r: Math.max(...boxes.map((r) => r.right)),
        b: Math.max(...boxes.map((r) => r.bottom)),
    };
}

export function useTour(steps, menu) {
    const step = ref(-1);
    const rect = ref(null);
    let waiting = 0;
    let following = 0;

    function measure() {
        const now = steps[step.value];
        if (!now) return;
        if (now.menu && !menu.isOpen()) menu.open();
        rect.value = around(now.target) || (now.fallback ? around(now.fallback) : null);
    }

    function go(at) {
        step.value = at;
        if (!steps[at].menu && menu.isOpen()) menu.close();
        rect.value = null;
        requestAnimationFrame(measure);
    }

    function start() {
        go(0);
        clearInterval(following);
        following = setInterval(measure, FOLLOW);
    }

    function end() {
        if (step.value < 0) return;
        if (steps[step.value].menu) menu.close();
        step.value = -1;
        rect.value = null;
        clearInterval(following);
        saveViewerSetting(KEY, true);
    }

    const next = () => (step.value >= steps.length - 1 ? end() : go(step.value + 1));
    const key = (e) => e.key === "Escape" && end();

    watch(
        settingsLoaded,
        (loaded) => {
            if (loaded && !viewerSetting(KEY, false) && step.value < 0) waiting = setTimeout(start, START_AFTER);
        },
        {immediate: true}
    );
    window.addEventListener("keydown", key);
    onUnmounted(() => {
        clearTimeout(waiting);
        clearInterval(following);
        window.removeEventListener("keydown", key);
    });
    return {step, rect, next, end};
}
