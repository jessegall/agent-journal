import {computed, onUnmounted, ref, watch} from "vue";
import {docked, fresh, leaves, measure, resized, valid} from "../domain/panes.js";
import {saveViewerSetting, settingsLoaded, viewerSetting} from "./viewerSetting.js";

const KEY = "layout";
const SAVE_AFTER = 500;
const FOLD = 380;

export function usePaneLayout() {
    const stored = () => viewerSetting(KEY, null);
    const layout = ref(valid(stored()) ? stored() : fresh());
    const born = ref({});
    const dying = ref({});
    const timers = new Set();
    let loaded = settingsLoaded();
    let mine = JSON.stringify(layout.value);
    let saving = 0;

    watch([settingsLoaded, stored], ([ready, got]) => {
        if (!ready) return;
        const first = !loaded;
        loaded = true;
        const text = JSON.stringify(got);
        if ((!first && (saving || text === mine)) || !valid(got)) return;
        layout.value = got;
        mine = text;
    });

    function later(ms, run) {
        const t = setTimeout(() => (timers.delete(t), run()), ms);
        timers.add(t);
    }

    function keep() {
        mine = JSON.stringify(layout.value);
        if (!loaded) return;
        clearTimeout(saving);
        saving = setTimeout(() => {
            saving = 0;
            saveViewerSetting(KEY, layout.value);
        }, SAVE_AFTER);
    }

    function forget(id) {
        const next = {...dying.value};
        delete next[id];
        dying.value = next;
    }

    function apply(change) {
        if (!change) return;
        layout.value = change.layout;
        dying.value = {...dying.value, ...change.dying};
        Object.keys(change.dying).forEach((id) => later(FOLD, () => forget(id)));
        if (Object.keys(change.born).length) {
            born.value = {...born.value, ...change.born};
            requestAnimationFrame(() => requestAnimationFrame(() => (born.value = {})));
        }
        keep();
    }

    function resize(path, r) {
        layout.value = {...layout.value, tree: resized(layout.value.tree, path, r)};
        keep();
    }

    const measured = computed(() => measure(layout.value.tree));
    const panes = computed(() => {
        const {rects} = measured.value;
        const live = leaves(layout.value.tree).map((id) => ({
            id,
            pane: layout.value.panes[id],
            rect: born.value[id] || rects[id],
            state: born.value[id] ? "born" : "live",
        }));
        const gone = Object.entries(dying.value)
            .filter(([id]) => !rects[id])
            .map(([id, d]) => ({id: Number(id), pane: d.pane, rect: d.rect, state: "dying"}));
        return [...live, ...gone].sort((a, b) => a.id - b.id);
    });
    const open = computed(() => docked(layout.value));

    onUnmounted(() => {
        timers.forEach(clearTimeout);
        clearTimeout(saving);
    });
    return {layout, measured, panes, open, apply, resize};
}
