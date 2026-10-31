import {computed, ref, watch} from "vue";
import {FULLSCREEN_KEYS} from "../platform/fullscreen.js";

export const TOUR = [
    {
        title: "Drag a window onto a pane",
        text: "Every window has an icon here. Drag one onto a pane to open it there. The icon comes back when you close that window.",
        target: ".agent-bar [data-reopen]",
        fallback: ".agent-bar",
    },
    {
        title: "Pick a preset",
        text: "Presets opens a list of ready layouts, such as Default, Chat only and Terminal, and arranges every pane in one step.",
        target: ".agent-bar [data-presets]",
    },
    {
        title: "Split a pane",
        text: "Each pane has this menu. Split right or Split below opens a second window beside this one.",
        target: "[data-menu=\"split-right\"]",
        fallback: ".pane-menu-button",
        menu: true,
    },
    {
        title: "Detach a window",
        text: "Detach opens this window in a window of its own that stays on screen on every page. Dock it back from its menu.",
        target: "[data-menu=\"detach\"]",
        fallback: ".pane-menu-button",
        menu: true,
    },
    {
        title: "Full screen",
        text: `This button, or the full screen keys (${FULLSCREEN_KEYS}), hides the sidebar and the top bar so the panes fill the screen. Esc brings them back.`,
        target: ".agent-bar [data-fullscreen]",
    },
];
const key = (environment, part) => `journal.${part}.${environment}`;

// the first-visit tour of the pane stage, five steps, and once it is over the hint at the pane menu; each is shown once
// per environment in this browser; `menu` is {isOpen, open, close} for the pane menu the third and fourth steps point into
export function usePaneGuide(environment, menu, storage = localStorage) {
    const touring = ref(!storage.getItem(key(environment, "tour")));
    const step = ref(0);
    const hinting = ref(touring.value || !storage.getItem(key(environment, "hint")));
    const current = computed(() => (touring.value ? TOUR[step.value] : null));

    watch(
        current,
        (now) => {
            if (now?.menu && !menu.isOpen()) menu.open();
            else if (!now?.menu && menu.isOpen()) menu.close();
        },
        {flush: "sync"},
    );

    function next() {
        if (step.value + 1 < TOUR.length) return step.value++;
        skip();
    }

    function skip() {
        touring.value = false;
        storage.setItem(key(environment, "tour"), "seen");
    }

    function understood() {
        hinting.value = false;
        storage.setItem(key(environment, "hint"), "seen");
    }

    return {current, step, count: TOUR.length, hint: computed(() => hinting.value && !touring.value), next, skip, understood};
}
