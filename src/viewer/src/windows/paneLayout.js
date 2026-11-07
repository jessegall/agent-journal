import {computed, ref} from "vue";
import {activated, docked, fresh, leaves, measure, opened, resized, wellShaped} from "../domain/panes.js";
import {LayoutStore} from "./layoutStore.js";

export const SAVE_DELAY_MS = 500;
const FOLD_MS = 380;

const tabKey =({environment, person, suite, page, driver}) => `journal.layout.${environment}.${person}.${suite}.${page}.${driver}`;
const lastKey = (environment, page) => `journal.last-layout.${environment}.${page}`;

// the browser tab's own copy of a layout, so a reload keeps what this tab showed while another tab saves its own
export const sessionTab = {
    read(key) {
        try {
            return JSON.parse(sessionStorage.getItem(key));
        } catch (error) {
            return null;
        }
    },
    write(key, layout) {
        try {
            sessionStorage.setItem(key, JSON.stringify(layout));
        } catch (error) {
            return;
        }
    },
};

// this browser's copy of a layout, shared by its tabs, so a new tab draws the person's panes and their skeletons at once
export const browserCopy = {
    read(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (error) {
            return null;
        }
    },
    write(key, layout) {
        try {
            localStorage.setItem(key, JSON.stringify(layout));
        } catch (error) {
            return;
        }
    },
};

// view is the one value a window keeps on its pane without declaring a control for it, as the file feed does
const PANE_OWN_OPTIONS = ["width", "agent", "view"];

// each pane's tabs with the titles the catalogue gives them, a gone window keeping the title it had, and its options
// only those its windows declare and those every pane has
function tidied(layout, entry) {
    const panes = Object.fromEntries(Object.entries(layout.panes).map(([id, pane]) => {
        const titles = {...(pane.titles || {})};
        const declared = new Set(PANE_OWN_OPTIONS);
        for (const name of pane.tabs) {
            const window = entry(name);
            if (!window) continue;
            titles[name] = window.title;
            (window.options || []).forEach((option) => declared.add(option.key));
        }
        const options = Object.fromEntries(Object.entries(pane.options || {}).filter(([key]) => declared.has(key)));
        return [id, {...pane, titles, options}];
    }));
    return {...layout, panes};
}

// one page's layout for a person, suite, page and driver: the browser tab's copy, else the person's saved layout, else
// the suite's; a change goes to the tab at once and is saved half a second after the last of a burst, against the version
// it was loaded at, so a save over another tab's newer layout is refused and that layout loaded instead; a window no
// module offers keeps its tab and is listed as gone, and loading never saves
export function paneLayout({saved, defaults, save, tab = sessionTab, copy = browserCopy, entry}) {
    const store = new LayoutStore({saved, defaults, save});
    // a page has a layout from the first moment, an empty one until its own is loaded (a journal with no suite chosen never loads one)
    const layout = ref(fresh());
    // false until the page's own layout, or the tab's copy of it, is known, so the stage draws a skeleton and never one wide pane that narrows
    const ready = ref(false);
    const loaded = ref(false);
    const refusal = ref("");
    const born = ref({});
    const dying = ref({});
    let key = null;
    let loading = null;
    let version = null;
    let pending = null;

    function flush() {
        if (!pending) return null;
        clearTimeout(pending.timer);
        const {at, kept, base} = pending;
        pending = null;
        return keeping(at, kept, base);
    }

    async function keeping(at, kept, base) {
        const answer = await store.keep(at, kept, base);
        if (answer.ok) {
            refusal.value = "";
            if (at === key) version = answer.version;
            return;
        }
        refusal.value = answer.error;
        const latest = await store.saved(at);
        if (at === key && latest && latest.version !== base && wellShaped(latest.layout)) {
            version = latest.version;
            layout.value = tidied(latest.layout, entry);
            tab.write(tabKey(at), layout.value);
            copy.write(tabKey(at), layout.value);
        }
    }

    // the first paint, before the person, suite and driver are known: the layout this browser last had for the page, so its skeleton has the panes' number and widths
    function drawKept(environment, page) {
        const at = copy.read(lastKey(environment, page));
        const kept = at && (tab.read(tabKey(at)) ?? copy.read(tabKey(at)));
        if (!kept || !wellShaped(kept)) return;
        layout.value = tidied(kept, entry);
        ready.value = true;
    }

    // no layout is kept while one loads: a change to the empty layout would be saved over the person's own
    async function load(at) {
        loaded.value = false;
        await flush();
        key = null;
        loading = at;
        copy.write(lastKey(at.environment, at.page), at);
        const own = tab.read(tabKey(at));
        const kept = own && wellShaped(own) ? own : copy.read(tabKey(at));
        if (kept && wellShaped(kept)) {
            layout.value = tidied(kept, entry);
            ready.value = true;
        }
        try {
            const found = await store.layout(at);
            if (loading !== at) return;
            key = at;
            version = found.version;
            layout.value = tidied(own && wellShaped(own) ? own : found.layout, entry);
            copy.write(tabKey(at), layout.value);
            ready.value = true;
        } finally {
            if (loading === at) loaded.value = true;
        }
    }

    const settle = () => { ready.value = true; loaded.value = true; };

    function keep() {
        if (key === null) return;
        layout.value = tidied(layout.value, entry);
        tab.write(tabKey(key), layout.value);
        copy.write(tabKey(key), layout.value);
        if (pending) clearTimeout(pending.timer);
        pending = {at: key, kept: layout.value, base: version, timer: setTimeout(flush, SAVE_DELAY_MS)};
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
        Object.keys(change.dying).forEach((id) => setTimeout(() => forget(id), FOLD_MS));
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

    const activate = (id, window) => apply(activated(layout.value, id, window));

    function resize(path, r) {
        layout.value = {...layout.value, tree: resized(layout.value.tree, path, r)};
        keep();
    }

    const gone = computed(() => (layout.value ? [...docked(layout.value)].filter((window) => !entry(window)) : []));
    const measured = computed(() => measure(layout.value.tree));
    const panes = computed(() => {
        const {rects} = measured.value;
        const live = leaves(layout.value.tree).map((id) => ({
            id,
            pane: layout.value.panes[id],
            rect: born.value[id] || rects[id],
            state: born.value[id] ? "born" : "live",
        }));
        const closing = Object.entries(dying.value)
            .filter(([id]) => !rects[id])
            .map(([id, d]) => ({id: Number(id), pane: d.pane, rect: d.rect, state: "dying"}));
        return [...live, ...closing].sort((a, b) => a.id - b.id);
    });
    const open = computed(() => opened(layout.value));
    return {layout, ready, loaded, settle, refusal, drawKept, load, flush, apply, replace, activate, resize, gone, measured, panes, open};
}
