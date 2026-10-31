import {saveViewerSetting, settingsLoaded, viewerSetting} from "./settings.js";
import {computed, effectScope, ref, watch} from "vue";
import {INSPECTOR_VIEWS, VIEWS, adapted, WORKER_HOME_VIEWS, WORKER_VIEWS, fresh, freshInspector, freshWorker, freshWorkerHome, docked, leaves, measure, opened, resized, wellShaped} from "../domain/panes.js";
import {route} from "../route.js";

const SAVE_AFTER = 500;
const FOLD = 380;
const HOME = {key: "layout", tab: () => `journal.layout.${route.value.env}`, views: VIEWS, fresh};
const INSPECTOR = {
    key: "inspector_layout",
    tab: () => "journal.inspector-layout",
    views: INSPECTOR_VIEWS,
    whole: true,
    fresh: freshInspector,
};
const WORKER = {key: "worker_layout", tab: () => "journal.worker-layout", views: WORKER_VIEWS, whole: true, fresh: freshWorker};

function tabLayout(kind) {
    try {
        return JSON.parse(sessionStorage.getItem(kind.tab()));
    } catch (e) {
        return null;
    }
}

function keepInTab(kind, layout) {
    try {
        sessionStorage.setItem(kind.tab(), JSON.stringify(layout));
    } catch (e) {
        return;
    }
}

function shared(kind) {
    const placed = (layout) => leaves(layout.tree).flatMap((id) => layout.panes[id].tabs);
    const fits = (layout) => wellShaped(layout) && (!kind.whole || kind.views.every((view) => placed(layout).includes(view)));
    const stored = () => adapted(viewerSetting(kind.key, null), kind.views, kind.whole);
    const own = adapted(tabLayout(kind), kind.views, kind.whole);
    const layout = ref(fits(own) ? own : fits(stored()) ? stored() : kind.fresh());
    const born = ref({});
    const dying = ref({});
    let loaded = settingsLoaded();
    let saving = 0;

    watch(
        [settingsLoaded, stored],
        ([ready, got]) => {
            if (!ready || loaded) return;
            loaded = true;
            if (!fits(own) && fits(got)) layout.value = got;
        },
        {immediate: true}
    );

    function keep() {
        keepInTab(kind, layout.value);
        if (!loaded) return;
        clearTimeout(saving);
        saving = setTimeout(() => {
            saving = 0;
            saveViewerSetting(kind.key, layout.value);
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
        Object.keys(change.dying).forEach((id) => setTimeout(() => forget(id), FOLD));
        if (Object.keys(change.born).length) {
            born.value = {...born.value, ...change.born};
            requestAnimationFrame(() => requestAnimationFrame(() => (born.value = {})));
        }
        keep();
    }

    function replace(next) {
        layout.value = next;
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
    const open = computed(() => opened(layout.value));
    const stage = ref(null);
    return {layout, measured, panes, open, apply, replace, resize, stage};
}

const made = {};
const madeFor = (kind) => (made[kind.key] = made[kind.key] || effectScope(true).run(() => shared(kind)));

export const usePaneLayout = () => madeFor(HOME);

export const useInspectorLayout = () => madeFor(INSPECTOR);

export const useWorkerLayout = () => madeFor(WORKER);

// a worker's home view keeps a layout of its own, as each worker is laid out as the user left it
const workerHome = (id) => ({
    key: `worker_home_layout.${id}`,
    tab: () => `journal.worker-home-layout.${id}`,
    views: WORKER_HOME_VIEWS,
    whole: true,
    fresh: freshWorkerHome,
});

export const useWorkerHomeLayout = (id) => madeFor(workerHome(id));

// one page's layout as the person stored it: a window no longer on offer keeps its tab and is listed as gone, and only a change the
// person makes is saved, so a window that comes back finds its place again
export function paneLayout({stored, windows, save}) {
    const layout = ref(wellShaped(stored) ? stored : null);
    const gone = computed(() => (layout.value ? [...docked(layout.value)].filter((window) => !windows.includes(window)) : []));
    const change = (next) => {
        layout.value = next;
        save(next);
    };
    return {layout, gone, change};
}
