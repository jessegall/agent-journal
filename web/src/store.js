import {computed, reactive, ref, watch} from "vue";
import * as http from "./api.js";
import {onOutboxChange, startOutbox} from "./chat/outbox.js";
import {go, route} from "./route.js";
import {visible} from "./text/index.js";

export function remembered(key, fallback) {
    try {
        const got = localStorage.getItem(key);
        return got === null ? fallback : JSON.parse(got);
    } catch (e) {
        return fallback;
    }
}

export const store = reactive({
    spec: null,
    identity: null,
    rows: {},
    events: [],
    settings: null,
    agents: [],
    pages: [],
    stream: null,
    booted: false,
    activity: remembered("journal.activity", true),
    wide: remembered("journal.wide", false),
    focus: "",
    detached: false,
    extension: {here: false, holding: false, pending: false, everywhere: false},
    chatWindow: remembered("journal.window", {
        x: Math.max(16, window.innerWidth - 468),
        y: 84,
        w: 440,
        h: Math.min(680, Math.max(360, window.innerHeight - 140)),
    }),
});

function extensionMessage(kind) {
    window.postMessage({source: "journal-page", kind}, window.location.origin);
}

function extensionReply(e) {
    if (e.source !== window || e.origin !== window.location.origin || !e.data || e.data.source !== "journal-extension") return;
    if (e.data.kind === "here") {
        store.extension.here = true;
        store.extension.holding = !!e.data.holding;
        store.detached = store.detached || store.extension.holding;
    }
    if (e.data.kind === "detached") {
        store.extension.pending = false;
        store.extension.holding = true;
        store.extension.everywhere = e.data.everywhere !== false;
        store.detached = true;
    }
    if (e.data.kind === "attached") {
        store.extension.pending = false;
        store.extension.holding = false;
        store.detached = false;
    }
    if (e.data.kind === "failed") {
        store.extension.pending = false;
        store.extension.holding = false;
    }
}

window.addEventListener("message", extensionReply);
extensionMessage("hello");

export function detach(on) {
    if (on) {
        store.detached = true;
        if (store.extension.here) {
            store.extension.pending = true;
            extensionMessage("detach");
        }
    } else {
        store.detached = false;
        store.extension.pending = false;
        if (store.extension.here && store.extension.holding) extensionMessage("attach");
        store.extension.holding = false;
    }
}

export function keepChatWindow() {
    try {
        localStorage.setItem("journal.window", JSON.stringify(store.chatWindow));
    } catch (e) {}
}

watch(
    () => store.activity,
    (on) => {
        try {
            localStorage.setItem("journal.activity", JSON.stringify(on));
        } catch (e) {}
    }
);

watch(
    () => store.wide,
    (on) => {
        try {
            localStorage.setItem("journal.wide", JSON.stringify(on));
        } catch (e) {}
    }
);

export const types = computed(() => (store.spec ? store.spec.priority.map((t) => ({name: t, ...store.spec.types[t]})) : []));
export const navTypes = (scope) => types.value.filter((t) => t.nav && t.scope === scope);
export const meta = (type) => store.spec.types[type];
export const word = (type, method) => meta(type).names[method] || method;
export const label = (type, field, fallback) => meta(type).labels[field] || fallback;

export function rows(type) {
    return store.rows[type] || [];
}

const ENDED = ["done", "abandoned"];
export const GROUPS = {started: "In progress", blocked: "Blocked", waiting: "Waiting on others", asked: "Waiting on you", open: "Open"};

export function waitsOn(r) {
    return [].concat(r.data.after || []).filter((ref) => {
        const [type, n] = ref.split(":");
        const other = rows(type).find((x) => x.n === Number(n));
        return other && !other.deleted && (type === "plan" ? !ENDED.includes(other.data.status) : !other.completed);
    });
}

export function groupOf(r) {
    if (r.data.blocked) return "blocked";
    if (waitsOn(r).length) return "waiting";
    if (r.data.status === "started") return "started";
    return rows("question").some((q) => !q.completed && q.refs.includes(r.ref)) ? "asked" : "open";
}

const PAGE = 100;
const PAGED = new Set(["message", "comment", "notification"]);
export const paging = reactive({size: {}, more: {}});

export async function load(type) {
    if (!PAGED.has(type) || paging.size[type] === Infinity) {
        store.rows[type] = await http.all(route.value.env, type);
        return store.rows[type];
    }
    const size = paging.size[type] || PAGE;
    const got = await http.recent(route.value.env, type, size);
    store.rows[type] = got.rows;
    paging.size[type] = size;
    paging.more[type] = got.more;
    return store.rows[type];
}

export async function earlier(...types) {
    const growing = types.filter((type) => paging.more[type]);
    growing.forEach((type) => (paging.size[type] = (paging.size[type] || PAGE) + PAGE));
    await Promise.all(growing.map(load));
    return growing.length > 0;
}

export async function whole(type) {
    if (!PAGED.has(type)) return rows(type);
    paging.size[type] = Infinity;
    return load(type);
}

export async function trim(type) {
    if (!PAGED.has(type)) return rows(type);
    paging.size[type] = PAGE;
    return load(type);
}

http.onWrite(() => reload());
onOutboxChange(() => reload());

let reloadTask = null;
let reloadAgain = false;

export async function reload() {
    if (reloadTask) {
        reloadAgain = true;
        return reloadTask;
    }
    reloadTask = (async () => {
        do {
            reloadAgain = false;
            const env = route.value.env;
            const [events, settings, agents] = await Promise.all([http.events(env, 0, RECENT), http.settings(env), http.all(env, "agent")]);
            store.events = events;
            store.settings = settings;
            store.agents = agents;
            await Promise.all(Object.keys(store.rows).map(load));
        } while (reloadAgain);
    })().finally(() => (reloadTask = null));
    return reloadTask;
}

export function listen() {
    if (store.stream) store.stream.close();
    const env = route.value.env;
    startOutbox(env);
    store.stream = new EventSource(`/api/${env}/stream`);
    store.stream.onmessage = () => reload();
    poll();
}

const RECENT = 100;
let ticking = 0;
let ticks = 0;

function poll() {
    clearInterval(ticking);
    ticks = 0;
    ticking = setInterval(async () => {
        ticks += 1;
        const env = route.value.env;
        store.agents = await http.all(env, "agent");
        if (ticks % 5) return;
        store.pages = await http.api("GET", "/pages");
        const last = store.events.length ? store.events[store.events.length - 1].id : 0;
        const fresh = await http.events(env, last);
        if (fresh.length) await reload();
        if (ticks % 30 === 0) await rebuilt();
    }, 1000);
}

async function rebuilt() {
    const loaded = (document.querySelector("script[type=module]") || {}).src || "";
    const served = ((await fetch("/", {cache: "no-store"}).then((r) => r.text())).match(/src="([^"]+)"/) || [])[1] || "";
    const typing = document.activeElement && document.activeElement.matches("textarea, input") && document.activeElement.value;
    if (served && loaded && !loaded.endsWith(served) && !typing) location.reload();
}

export async function boot() {
    [store.spec, store.identity] = await Promise.all([http.manifest(), http.identity()]);
    if (!route.value.env) {
        go(store.spec.environment);
        return boot();
    }
    await Promise.all(types.value.filter((t) => t.name !== "nudge").map((t) => load(t.name)));
    store.pages = await http.api("GET", "/pages");
    await reload();
    store.booted = true;
    listen();
}

export const open = (type) => rows(type).filter((r) => !r.completed);
export const unreadByUser = (type) => open(type).filter((r) => !r.seen.includes("user"));
export const agent = computed(
    () => [...store.agents].filter((a) => !a.data.parent).sort((a, b) => (b.data.at || 0) - (a.data.at || 0))[0] || null
);
export const autoOn = computed(() => !!(store.settings && store.settings.features.auto));

export function age(at) {
    if (!at) return "";
    const s = Math.max(0, Date.now() / 1000 - at);
    if (s < 60) return "now";
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}h`;
    return `${Math.floor(s / 86400)}d`;
}

export const linkedTo = (ref) => types.value.flatMap((t) => rows(t.name).filter((r) => r.refs.includes(ref) && !r.deleted));

export function byRef(ref) {
    const [type, n] = ref.split(":");
    return rows(type).find((r) => r.n === Number(n)) || null;
}

export function clock(at) {
    if (!at) return "";
    const d = new Date(at * 1000);
    const today = new Date().toDateString() === d.toDateString();
    const time = d.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: false});
    return today ? time : `${d.toLocaleDateString([], {day: "numeric", month: "short"})} ${time}`;
}

export function quoted(text) {
    const lines = visible(text).split("\n");
    const quote = [];
    while (lines.length && lines[0].startsWith(">")) quote.push(lines.shift().replace(/^> ?/, ""));
    return {quote: quote.join("\n"), text: lines.join("\n").trim()};
}

export function withQuote(quote, text) {
    return quote ? `> ${quote.replace(/\n/g, "\n> ")}\n\n${text}` : text;
}

export function span(seconds) {
    const s = Math.max(0, Math.floor(seconds));
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    return h < 24 ? `${h}h ${m}m` : `${Math.floor(h / 24)}d ${h % 24}h`;
}

export const laidOut = ref(0);
let resizing = 0;
window.addEventListener("resize", () => {
    clearTimeout(resizing);
    resizing = setTimeout(() => (laidOut.value += 1), 120);
});

export const lightbox = reactive({pictures: [], at: -1});

export function openPictures(pictures, at) {
    lightbox.pictures = pictures;
    lightbox.at = at;
}

export const away = reactive({open: false, since: 0, back: 0, left: 0});
export const flash = reactive({at: Date.now()});
const FLASH_AFTER = 1000;

function left() {
    away.left = away.left || Date.now();
}

async function back() {
    if (document.visibilityState !== "visible" || !away.left) return;
    const since = away.left;
    away.left = 0;
    if (Date.now() - since >= FLASH_AFTER) flash.at = Date.now();
    if (Date.now() - since < 60000) return;
    await reload();
    Object.assign(away, {open: true, since, back: Date.now()});
}
document.addEventListener("visibilitychange", () => (document.hidden ? left() : back()));
window.addEventListener("blur", left);
window.addEventListener("focus", back);

export function showAway() {
    Object.assign(away, {open: true, since: away.since || Date.now() - 86400000, back: Date.now()});
}

export function focusTurn(ref) {
    const el = document.querySelector(`[data-ref="${ref}"]`);
    if (!el) return false;
    store.focus = ref;
    el.scrollIntoView({behavior: "smooth", block: "center"});
    setTimeout(() => (store.focus = store.focus === ref ? "" : store.focus), 1800);
    return true;
}
