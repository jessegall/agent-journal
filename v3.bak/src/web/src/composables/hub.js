import {computed, onMounted, onUnmounted, watch} from "vue";
import {store} from "../state/store.js";
import {asksOf, countsOf, environmentsOf, envState, isActive, journalState, STATE_RANK, totalsOf} from "../domain/journals.js";
import {closeAll, forget, refresh, scan} from "../sync/hub.js";

const running = computed(() => store.hub.journals.filter((j) => j.running));
const waitsOnYou = (j) => Number(countsOf(totalsOf(j)).some((c) => c.hot));

const online = computed(() =>
    store.hub.journals
        .filter((j) => j.running && !j.gone && (j.summary || j.unreadable))
        .sort(
            (a, b) =>
                STATE_RANK[journalState(a)] - STATE_RANK[journalState(b)] ||
                waitsOnYou(b) - waitsOnYou(a) ||
                a.project.localeCompare(b.project)
        )
);
const stopped = computed(() => store.hub.journals.filter((j) => !j.running || j.gone));
const needs = computed(() =>
    online.value
        .flatMap((j) => environmentsOf(j).map((e) => ({key: `${j.root}:${e.name}`, journal: j, env: e, asks: asksOf(j, e)})))
        .filter((item) => item.asks.length)
);
const tally = computed(() => {
    const states = online.value.flatMap(environmentsOf).map(envState);
    return {
        journals: online.value.length,
        stopped: stopped.value.length,
        agents: states.filter((s) => s !== "stopped").length,
        working: states.filter(isActive).length,
        idle: states.filter((s) => s === "idle").length,
        needs: needs.value.reduce((sum, item) => sum + item.asks.reduce((n, ask) => n + ask.n, 0), 0),
        todos: online.value.reduce((sum, j) => sum + totalsOf(j).todos, 0),
    };
});

let users = 0;

export function useHub() {
    watch(() => store.journals, scan);
    watch(
        () => store.summary,
        (summary) => {
            const mine = store.hub.journals.find((j) => j.current);
            if (mine) mine.summary = summary;
        }
    );

    onMounted(() => {
        users++;
        if (store.journals.length) scan();
    });
    onUnmounted(() => {
        users--;
        if (users) return;
        closeAll();
    });

    const journals = computed(() => store.hub.journals);
    const loaded = computed(() => store.hub.loaded);
    return {journals, loaded, running, online, stopped, needs, tally, refresh, forget};
}
