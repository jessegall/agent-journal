import {onUnmounted, reactive, ref, watch} from "vue";
import {rowList} from "./useRows.js";
import {usePoll} from "./usePoll.js";
import {matches} from "../src/windows/windowSubscriptions.js";

const RELOAD_JOIN_MS = 50;
const REFRESH_EVENT = "refresh";
const TIMER_TICK_MS = 1000;
const REQUESTED = "requested";
const AFTER_WINDOW = "after_window";
const DEFAULT_PAGE_SIZE = 50;
const ID_KEY_SUFFIX = ".*";
const namesOf = (only) => (typeof only === "string" ? [only] : (Array.isArray(only) ? only : (only?.only ?? [])));

// a window's props, as its module declares them: the first read asks for what is on screen, reload asks for the props it names, and
// each prop reloads itself on the events and the timer its window declares; a prop not on screen is read when its tab comes into focus
export function useWindowData(context) {
    const held = {};
    const state = reactive({});
    const asked = [];
    const waiting = new Set();
    const joined = {names: new Set(), answer: null};
    const readNumbers = {};
    let declared = {};
    let join = 0;
    let latestRead = 0;

    function propOf(name) {
        const key = () => declared[name] ?? declared[`${name.slice(0, name.lastIndexOf("."))}.*`] ?? {};
        const data = ref(undefined);
        const list = rowList(context, async (flags) => {
            const result = await readKey(name, flags);
            if (result.ok && !Object.keys(flags).length) data.value = result.value;
            return result;
        }, () => key().page_size || DEFAULT_PAGE_SIZE, () => Boolean(key().page_size), () => Boolean(key().reads_ids));
        return (held[name] = {...list, data, readAt: 0});
    }
    const props = new Proxy({}, {get: (_, name) => (typeof name !== "string" || name.startsWith("__v") ? undefined : (held[name] ?? propOf(name)))});
    const isOnScreen = (name) => (declared[name].loading !== REQUESTED || name.endsWith(ID_KEY_SUFFIX)) && (!declared[name].tab || declared[name].tab === state.tab);

    // the reads of a page of a prop asked for at the same moment go in one request
    function readKey(name, flags = {}) {
        return new Promise((resolve) => {
            asked.push({name, flags, resolve});
            if (asked.length === 1) setTimeout(sendAsked);
        });
    }

    // the same key with other flags, such as two pages of it, cannot share a request, so it goes in the next
    async function sendAsked() {
        const flagsByName = new Map();
        const sending = asked.splice(0).filter((entry) => {
            const flags = JSON.stringify(entry.flags);
            if (!flagsByName.has(entry.name)) flagsByName.set(entry.name, flags);
            if (flagsByName.get(entry.name) === flags) return true;
            asked.push(entry);
            return false;
        });
        if (asked.length) setTimeout(sendAsked);
        const flagState = Object.fromEntries(sending.flatMap(({name, flags}) => Object.entries(flags).map(([flag, value]) => [`${name}.${flag}`, value])));
        const answer = await context.readKeys({only: [...new Set(sending.map(({name}) => name))], state: {...state, ...flagState}});
        sending.forEach(({name, resolve}) => resolve(answer.ok ? answer.value.keys[name] : answer));
    }

    async function read(only) {
        const number = ++latestRead;
        const names = only.length ? only : Object.keys(declared).filter((name) => !name.endsWith(ID_KEY_SUFFIX) && declared[name].loading === "first" && isOnScreen(name));
        names.forEach((name) => (readNumbers[name] = number));
        const answer = await context.readKeys({only, state: {...state}});
        if (!answer.ok) {
            if (answer.failure !== "cancelled") (only.length ? only : Object.keys(held)).filter((name) => (readNumbers[name] ?? 0) <= number).forEach((name) => props[name].showFirst(answer));
            return false;
        }
        follow(answer.value.declared);
        Object.entries(answer.value.keys).forEach(([name, result]) => {
            if ((readNumbers[name] ?? 0) > number) return;
            readNumbers[name] = number;
            props[name].readAt = Date.now();
            if (result.ok) props[name].data.value = result.value;
            props[name].showFirst(result);
        });
        return true;
    }

    // reloads what it names, and the names asked for at the same moment go in one request
    function reload(only) {
        const names = namesOf(only);
        if (!names.length) return read([]);
        names.forEach((name) => joined.names.add(name));
        return (joined.answer ??= new Promise((resolve) => setTimeout(() => {
            const sending = [...joined.names];
            joined.names.clear();
            joined.answer = null;
            resolve(read(sending));
        })));
    }

    function reloadSoon(names) {
        names.forEach((name) => waiting.add(name));
        clearTimeout(join);
        join = setTimeout(() => {
            const only = [...waiting];
            waiting.clear();
            if (only.length) read(only);
        }, RELOAD_JOIN_MS);
    }

    // a key with ids, such as rounds.*, reloads the ids that were read
    const loadedNames = (name) => (name.endsWith(ID_KEY_SUFFIX) ? Object.keys(held).filter((heldName) => heldName.startsWith(name.slice(0, -1)) && held[heldName].readAt) : [name]);

    const reloadSecondsOf = (name) => (declared[name] ?? declared[`${name.split(".")[0]}.*`]).reload_seconds;

    function heard(event) {
        const names = Object.keys(declared).filter((name) => event.event === REFRESH_EVENT || declared[name].events.some((pattern) => matches(pattern, event.event)));
        names.filter((name) => declared[name].page_size).forEach((name) => props[name].heard(event));
        const ownNames = names.filter((name) => !declared[name].page_size);
        ownNames.filter((name) => !isOnScreen(name)).forEach((name) => (props[name].readAt = 0));
        reloadSoon(ownNames.filter(isOnScreen).flatMap(loadedNames));
    }

    function follow(listed) {
        if (Object.keys(declared).length) return;
        declared = listed;
        const patterns = [...new Set(Object.values(listed).flatMap((key) => key.events))];
        if (patterns.length) context.follow(patterns, heard);
        const afterWindow = Object.keys(listed).filter((name) => listed[name].loading === AFTER_WINDOW);
        if (afterWindow.length) read(afterWindow);
    }

    watch(() => state.tab, () => {
        const only = Object.keys(declared).filter((name) => !name.endsWith(ID_KEY_SUFFIX) && isOnScreen(name) && !props[name].readAt);
        if (only.length) read(only);
    });
    onUnmounted(() => clearTimeout(join));
    function reloadDueKeys() {
        const now = Date.now();
        const due = Object.keys(declared).filter((name) => declared[name].reload_seconds > 0 && isOnScreen(name)).flatMap(loadedNames).filter((name) => now - props[name].readAt >= reloadSecondsOf(name) * 1000);
        if (due.length) reloadSoon(due);
    }
    usePoll(reloadDueKeys, () => context.visible.value, TIMER_TICK_MS);
    queueMicrotask(() => read([]));
    return {props, state, reload, readKey};
}
