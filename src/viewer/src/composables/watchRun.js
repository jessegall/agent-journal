import {computed} from "vue";
import {elapsed} from "../format/time.js";
import {useSharedNow} from "./now.js";

// the colour of a docked run by its state: running, passed (good), failed (bad), or stopped by the user, which is grey
const STATE_TONES = {running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--tone-bad)", stopped: "var(--text-3)"};
// its icon: the terminal while it goes, a tick once it passed, a cross once it failed, a square once stopped
const STATE_ICONS = {running: "terminal", good: "tick", bad: "cross", stopped: "stopped"};
// how the run ended, as its card reports it, or as its colour said on a card from before cards reported their outcome
const ENDED = {passed: "good", failed: "bad"};
// the states of a run that came to its end on its own
const ENDED_STATES = {good: true, bad: true};

// A docked run as its card reports it: its state, the colour and icon of that state, the share of it done and how long it has run
export function useWatchRun(card, stopped = () => false) {
    const endedTone = computed(() => ENDED[card().outcome] || card().tone || "good");
    const state = computed(() => {
        if (stopped()) return "stopped";
        return card().ending ? endedTone.value : "running";
    });
    const tone = computed(() => STATE_TONES[state.value]);
    const icon = computed(() => STATE_ICONS[state.value]);
    // a stopped run's progress line turns the faintest grey
    const bar = computed(() => (state.value === "stopped" ? "var(--text-4)" : tone.value));
    // a run that ended, passed or failed, is whole whatever its last reading said; a stopped one keeps where it stood
    const width = computed(() => (state.value in ENDED_STATES ? "100%" : `${Math.round((card().fraction || 0) * 100)}%`));
    const now = useSharedNow();
    const ranFor = computed(() => (card().began_at ? elapsed((card().ended_at || now.value) - card().began_at) : ""));
    return {endedTone, state, tone, icon, bar, width, ranFor};
}
