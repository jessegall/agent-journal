import {computed, reactive, watch} from "vue";
import * as http from "./api.js";
import {go, route} from "./route.js";

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
    rows: {},
    events: [],
    settings: null,
    agents: [],
    stream: null,
    activity: remembered("journal.activity", true),
    focus: "",
    detached: false,
});

let popup = null;

export function detach(on) {
    if (on) {
        popup = window.open(`${location.origin}/?chat${location.hash}`, "journal-chat", "popup,width=430,height=620");
        store.detached = !!popup;
        const watch = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(watch);
                store.detached = false;
            }
        }, 800);
    } else {
        if (popup && !popup.closed) popup.close();
        popup = null;
        store.detached = false;
    }
}

watch(
    () => store.activity,
    (on) => {
        try {
            localStorage.setItem("journal.activity", JSON.stringify(on));
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

export async function load(type) {
    store.rows[type] = await http.all(route.value.env, type);
    return store.rows[type];
}

http.onWrite(() => reload());

export async function reload() {
    const env = route.value.env;
    const [events, settings, agents] = await Promise.all([http.events(env), http.settings(env), http.all(env, "agent")]);
    store.events = events;
    store.settings = settings;
    store.agents = agents;
    await Promise.all(Object.keys(store.rows).map(load));
}

export function listen() {
    if (store.stream) store.stream.close();
    const env = route.value.env;
    store.stream = new EventSource(`/api/${env}/stream`);
    store.stream.onmessage = () => reload();
    poll();
}

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
        const last = store.events.length ? store.events[store.events.length - 1].id : 0;
        const fresh = await http.events(env, last);
        if (fresh.length) await reload();
    }, 1000);
}

export async function boot() {
    store.spec = await http.manifest();
    if (!route.value.env) {
        go(store.spec.environment);
        return boot();
    }
    await Promise.all(types.value.filter((t) => t.name !== "nudge").map((t) => load(t.name)));
    await reload();
    listen();
}

export const open = (type) => rows(type).filter((r) => !r.completed);
export const unreadByUser = (type) => open(type).filter((r) => !r.seen.includes("user"));
export const agent = computed(() => [...store.agents].sort((a, b) => (b.data.at || 0) - (a.data.at || 0))[0] || null);
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
    const lines = (text || "").split("\n");
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

export const lightbox = reactive({pictures: [], at: -1});

export function openPictures(pictures, at) {
    lightbox.pictures = pictures;
    lightbox.at = at;
}

export const away = reactive({open: false, since: 0, back: 0, left: 0});

function left() {
    away.left = away.left || Date.now();
}

async function back() {
    if (document.visibilityState !== "visible" || !away.left) return;
    const since = away.left;
    away.left = 0;
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
