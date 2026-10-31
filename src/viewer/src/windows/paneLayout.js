import {computed, ref} from "vue";
import {activated, docked, leaves, measure, opened, resized, wellShaped} from "../domain/panes.js";
import {LayoutStore} from "./layoutStore.js";

export const SAVE_DELAY_MS = 500;
const FOLD_MS = 380;

export const tabKey = ({environment, person, suite, page, driver}) => `journal.layout.${environment}.${person}.${suite}.${page}.${driver}`;

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

// each pane's tabs with the titles the catalogue gives them, a gone window keeping the title it had, and its options
// only those its windows declare
function tidied(layout, entry) {
    const panes = Object.fromEntries(Object.entries(layout.panes).map(([id, pane]) => {
        const titles = {...(pane.titles || {})};
        const declared = new Set();
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
export function paneLayout({saved, defaults, save, tab = sessionTab, entry}) {
    const store = new LayoutStore({saved, defaults, save});
    const layout = ref(null);
    const refusal = ref("");
    const born = ref({});
    const dying = ref({});
    let key = null;
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
        }
    }

    async function load(at) {
        await flush();
        key = at;
        const own = tab.read(tabKey(at));
        const found = await store.layout(at);
        version = found.version;
        layout.value = tidied(own && wellShaped(own) ? own : found.layout, entry);
    }

    function keep() {
        layout.value = tidied(layout.value, entry);
        tab.write(tabKey(key), layout.value);
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
    return {layout, refusal, load, flush, apply, replace, activate, resize, gone, measured, panes, open};
}
