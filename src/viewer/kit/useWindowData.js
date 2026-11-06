import {onUnmounted, reactive, watch} from "vue";
import {usePoll} from "./usePoll.js";
import {useWindow} from "./windowContextKey.js";
import {matches} from "../src/windows/windowSubscriptions.js";

const RELOAD_JOIN_MS = 50;
const REFRESH_EVENT = "refresh";
const TIMER_TICK_MS = 1000;

// a window's data by its keys: the first load asks for what is on screen, reload({only}) asks for those keys alone, and each key
// reloads itself on the events and the timer its window declares; a key not on screen is read when its tab comes into focus
export function useWindowData({state = () => ({}), tab = () => ""} = {}) {
    const context = useWindow();
    const data = reactive({});
    const handlers = {};
    const waiting = new Set();
    let declared = {};
    let join = 0;

    const part = (name) => (data[name] ??= {value: undefined, failure: "", loaded: false, readAt: 0});
    const isOnScreen = (name) => !declared[name].tab || declared[name].tab === tab();
    const currentState = () => (tab() ? {...state(), tab: tab()} : state());

    // a key a part of the window handles itself, such as a list of rows: its first answer and its events go to that part
    function handle(name, heardEvent, showFirst) {
        handlers[name] = {heardEvent, showFirst, isFirst: true};
    }

    async function readKey(name, flags) {
        const state = Object.fromEntries(Object.entries(flags).map(([flag, value]) => [`${name}.${flag}`, value]));
        const answer = await context.readKeys({only: [name], state: {...currentState(), ...state}});
        return answer.ok ? answer.value.keys[name] : answer;
    }

    function showAnswer(name, result) {
        const handler = handlers[name];
        if (!handler) return;
        if (handler.isFirst || !result.ok) handler.showFirst(result);
        handler.isFirst = false;
    }

    async function reload({only = []} = {}) {
        const answer = await context.readKeys({only, state: currentState()});
        if (!answer.ok) {
            if (answer.failure !== "cancelled") Object.keys(handlers).forEach((name) => showAnswer(name, answer));
            if (answer.failure !== "cancelled") only.forEach((name) => (part(name).failure = answer.error));
            return false;
        }
        Object.entries(answer.value.keys).forEach(([name, result]) => {
            part(name).failure = result.ok ? "" : result.error;
            part(name).loaded = true;
            part(name).readAt = Date.now();
            if (result.ok) part(name).value = result.value;
            showAnswer(name, result);
        });
        follow(answer.value.declared);
        return true;
    }

    function reloadSoon(names) {
        names.forEach((name) => waiting.add(name));
        clearTimeout(join);
        join = setTimeout(() => {
            const only = [...waiting];
            waiting.clear();
            if (only.length) reload({only});
        }, RELOAD_JOIN_MS);
    }

    function heard(event) {
        const names = Object.keys(declared).filter((name) => event.event === REFRESH_EVENT || declared[name].events.some((pattern) => matches(pattern, event.event)));
        names.filter((name) => handlers[name]).forEach((name) => handlers[name].heardEvent(event));
        const ownNames = names.filter((name) => !handlers[name]);
        ownNames.filter((name) => !isOnScreen(name)).forEach((name) => (part(name).loaded = false));
        reloadSoon(ownNames.filter(isOnScreen));
    }

    function follow(listed) {
        if (Object.keys(declared).length) return;
        declared = listed;
        const patterns = [...new Set(Object.values(listed).flatMap((key) => key.events))];
        if (patterns.length) context.follow(patterns, heard);
    }

    watch(tab, () => {
        const only = Object.keys(declared).filter((name) => isOnScreen(name) && !part(name).loaded);
        if (only.length) reload({only});
    });
    onUnmounted(() => clearTimeout(join));
    function reloadDueKeys() {
        const now = Date.now();
        const due = Object.keys(declared).filter((name) => declared[name].reload_seconds > 0 && isOnScreen(name) && now - part(name).readAt >= declared[name].reload_seconds * 1000);
        if (due.length) reloadSoon(due);
    }
    usePoll(reloadDueKeys, () => context.visible.value, TIMER_TICK_MS);
    queueMicrotask(reload);
    return {data, reload, readKey, handle};
}
