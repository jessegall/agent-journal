import {computed, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {useFilesTabs} from "./filesTabs.js";

const TYPING = new Set(["INPUT", "TEXTAREA", "SELECT"]);
// a menu or a dialog that is open keeps the page's keys to itself
const LAYERS = '[role="dialog"][aria-modal="true"], [data-context-menu]';
const SEARCH_AFTER_MS = 150;
const LEAST_TEXT_LETTERS = 2;
// the Files window the person used last gets the page keys, even when the chat was used after it
let lastUsed = null;

// The state of the Files page: the project tree (a folder is read when it is first opened), the file shown and where the person has been (back and forward),
// and the one search palette, for file names or for text. Every read goes through the window; opening a file reloads the file key only.
export function useFilesBrowser(view) {
    const root = view.props.entries;
    const folders = reactive({});
    const opened = ref(new Set());
    const current = ref("");
    const line = ref(0);
    const history = reactive({back: [], forward: []});
    const palette = ref(null);
    const query = ref("");
    const hits = ref([]);
    const chosen = ref(0);
    const token = Symbol("files window");
    const kept = useFilesTabs();
    const tabs = kept.tabs;
    const selection = kept.selection;
    // the agent that edited the file shown last, when the journal has an edit of it
    const editor = ref(0);

    // the rows of a folder, or null while they are being read; the project's own are the window's first key
    const rowsOf = (folder) => (folder ? folders[folder]?.rows ?? null : root.loaded.value ? root.rows.value : null);
    const failureOf = (folder) => (folder ? folders[folder]?.failure ?? "" : root.failure.value);

    async function readFolder(folder) {
        if (!folder || folders[folder]) return;
        folders[folder] = {rows: null, failure: ""};
        const answer = await view.read(["project-file", "list", folder]);
        folders[folder] = answer.ok ? {rows: answer.value.rows, failure: ""} : {rows: [], failure: answer.error};
    }

    async function toggle(folder) {
        const next = new Set(opened.value);
        if (!next.delete(folder)) next.add(folder);
        opened.value = next;
        await readFolder(folder);
    }

    // the folders above a path are opened, so the file shows in the tree
    function reveal(path) {
        const parts = path.split("/").slice(0, -1);
        const next = new Set(opened.value);
        parts.forEach((_, at) => next.add(parts.slice(0, at + 1).join("/")));
        opened.value = next;
        return Promise.all([...next].map(readFolder));
    }

    // a click on a line number picks the line; with Shift it stretches the pick to a range
    function pick(number, stretch) {
        const now = selection.value;
        selection.value = stretch && now ? {from: Math.min(now.from, number), to: Math.max(now.to, number)} : {from: number, to: number};
    }

    async function findEditor(path) {
        editor.value = 0;
        const answer = await view.read(["file-edit", "list", "--search", path, "--limit", "20"]);
        const edit = answer.ok ? answer.value.rows.find((row) => row.path === path) : null;
        if (path === current.value) editor.value = edit?.session_agent_id ?? 0;
    }

    function open(path, lineNumber = 0, remember = true) {
        if (path !== current.value) selection.value = null;
        if (!tabs.value.includes(path)) tabs.value = [...tabs.value, path];
        if (remember && current.value && path !== current.value) {
            history.back.push(current.value);
            history.forward.length = 0;
        }
        current.value = path;
        line.value = lineNumber;
        palette.value = null;
        view.state["file.path"] = path;
        view.reload("file");
        reveal(path);
        findEditor(path);
    }

    function back() {
        const path = history.back.pop();
        if (!path) return;
        history.forward.unshift(current.value);
        open(path, 0, false);
    }

    function forward() {
        const path = history.forward.shift();
        if (!path) return;
        history.back.push(current.value);
        open(path, 0, false);
    }

    function leaveFile() {
        current.value = "";
    }

    // closing the tab of the file shown shows its neighbour, or no file when it was the last
    function closeTab(path) {
        const at = tabs.value.indexOf(path);
        tabs.value = tabs.value.filter((tab) => tab !== path);
        if (path !== current.value) return;
        const next = tabs.value[Math.min(at, tabs.value.length - 1)];
        if (next) open(next, 0, false);
        else leaveFile();
    }
    kept.watchTabs(current);
    if (tabs.value.length) {
        const restored = selection.value;
        open(tabs.value.includes(kept.shown) ? kept.shown : tabs.value[tabs.value.length - 1], 0, false);
        selection.value = restored;
    }

    // the palette: what it finds is read as the words are typed
    const canSearch = () => (palette.value === "text" ? query.value.trim().length >= LEAST_TEXT_LETTERS : query.value.trim().length > 0);
    let timer = 0;
    async function search() {
        const words = query.value.trim();
        const mode = palette.value;
        if (!mode || !canSearch()) {
            hits.value = [];
            return;
        }
        const answer = await view.read(["project-file", mode === "files" ? "find" : "grep", words]);
        if (words === query.value.trim() && mode === palette.value) hits.value = answer.ok ? answer.value.rows : [];
        chosen.value = 0;
    }
    watch([palette, query], () => {
        clearTimeout(timer);
        timer = setTimeout(search, SEARCH_AFTER_MS);
    });
    onUnmounted(() => clearTimeout(timer));

    function openPalette(mode) {
        query.value = "";
        hits.value = [];
        chosen.value = 0;
        palette.value = mode;
    }

    // with nothing typed the file palette offers the files the person has been in
    const visited = computed(() => [...new Set([current.value, ...[...history.back].reverse(), ...history.forward].filter(Boolean))].map((path) => ({id: path, name: path.split("/").pop(), line: 0, text: ""})));
    const shownHits = computed(() => (palette.value === "files" && !query.value.trim() ? visited.value : hits.value));

    function choose(by) {
        const count = shownHits.value.length;
        if (count) chosen.value = (chosen.value + by + count) % count;
    }

    function openChosen() {
        const hit = shownHits.value[chosen.value];
        if (hit) open(hit.id, hit.line || 0);
    }

    // page keys, only while no menu or dialog is open and never while typing: T searches files, Ctrl or Command and Shift and F text, [ and ] go back and forward
    function pressed(event) {
        if (lastUsed !== token || view.visible?.value === false || document.querySelector(LAYERS) || TYPING.has(event.target?.tagName) || event.target?.isContentEditable) return;
        const bare = !event.metaKey && !event.ctrlKey && !event.altKey;
        if (event.key.toLowerCase() === "t" && bare) {
            event.preventDefault();
            openPalette("files");
        } else if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === "f") {
            event.preventDefault();
            openPalette("text");
        } else if (event.key === "[" && bare) back();
        else if (event.key === "]" && bare) forward();
    }
    const markUsed = () => (lastUsed = token);
    onMounted(() => {
        lastUsed ??= token;
        document.addEventListener("keydown", pressed);
    });
    onUnmounted(() => {
        if (lastUsed === token) lastUsed = null;
        document.removeEventListener("keydown", pressed);
    });

    return {tabs, closeTab, selection, pick, editor, markUsed, rowsOf, failureOf, opened, toggle, reveal, open, back, forward, leaveFile, current, line, history, palette, query, shownHits, chosen, choose, openChosen, openPalette, readFolder};
}
