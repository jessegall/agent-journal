import {computed, ref} from "vue";

export const TOUR = [
    {title: "Tabs", text: "Each pane holds windows as tabs. Click a tab to show it, or close it with its cross."},
    {title: "Move and split", text: "Drag a tab to another pane's edge to split that pane, or onto its tab strip to add it there."},
    {title: "Resize", text: "Drag the line between two panes to resize them. Double-click it to reset."},
];
const key = (environment, part) => `journal.${part}.${environment}`;

// the first-visit tour of the pane stage and, once it is over, the hint at the pane menu; each is shown once per
// environment in this browser
export function usePaneGuide(environment, storage = localStorage) {
    const touring = ref(!storage.getItem(key(environment, "tour")));
    const step = ref(0);
    const hinting = ref(touring.value || !storage.getItem(key(environment, "hint")));
    const current = computed(() => (touring.value ? TOUR[step.value] : null));

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
