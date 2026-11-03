import {watch} from "vue";
import {ENTER_MS, LEAVE_MS, RESIZE_MS} from "./markMotion.js";

const RECORDING_SETTING = "journal.core.developer.tools.mark-motion";
const SETTLE_MS = 200;
const RECORD_MS = LEAVE_MS + RESIZE_MS + ENTER_MS + SETTLE_MS;

function box(element) {
    if (!element) return null;
    const {x, y, width, height} = element.getBoundingClientRect();
    return {x, y, width, height, opacity: getComputedStyle(element).opacity};
}

// one animation frame of a mark: where the whole mark, its title line and its contents stand, and how far the chat has scrolled
function frameOf(element, started, phase) {
    return {
        ms: performance.now() - started,
        phase,
        classes: element.className,
        style: element.getAttribute("style") ?? "",
        mark: box(element),
        top: box(element.querySelector(".top")),
        title: box(element.querySelector(".title")),
        contents: box(element.querySelector(":scope > :not(.top)")),
        scroll: element.closest(".history")?.scrollTop ?? 0,
        running: document.getAnimations().map((animation) => `${animation.effect?.target?.className || animation.effect?.target?.tagName} ${animation.transitionProperty ?? animation.animationName}`),
        computed: (({width, minWidth, maxWidth, boxSizing, transform, display}) => ({width, minWidth, maxWidth, boxSizing, transform, display}))(getComputedStyle(element)),
        parent: box(element.parentElement),
        parentClasses: element.parentElement?.className ?? "",
    };
}

async function save(context, recording) {
    const setting = await context.read(`setting show ${RECORDING_SETTING}`);
    if (setting.ok && setting.value?.value === true) await context.run(["developer", "record-mark-motion", JSON.stringify(recording)]);
}

// each time a mark opens or closes, every animation frame until its motion is over is recorded, and kept while the developer setting is on
export function useMarkRecording(root, wanted, phase, context) {
    watch(wanted, (folds) => {
        const element = root.value;
        if (!element || !context?.run) return;
        const started = performance.now();
        const frames = [];
        function sample() {
            frames.push(frameOf(element, started, phase.value));
            if (performance.now() - started < RECORD_MS) return void requestAnimationFrame(sample);
            save(context, {key: element.dataset.markKey ?? "", folds, at: new Date().toISOString(), frames});
        }
        sample();
    }, {flush: "sync"});
}
