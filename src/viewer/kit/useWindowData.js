import {onUnmounted, reactive, watch} from "vue";
import {useWindow} from "./windowContextKey.js";
import {matches} from "../src/windows/windowSubscriptions.js";

const RELOAD_JOIN_MS = 50;
const REFRESH_EVENT = "refresh";

// a window's data by its keys: the first load asks for what is on screen, reload({only}) asks for those keys alone, and each key
// reloads itself on the events and the timer its window declares; a key not on screen is read when its tab comes into focus
export function useWindowData({state = () => ({}), tab = () => ""} = {}) {
    const context = useWindow();
    const data = reactive({});
    const waiting = new Set();
    const timers = [];
    let declared = {};
    let join = 0;

    const part = (name) => (data[name] ??= {value: undefined, failure: "", loaded: false});
    const isOnScreen = (name) => !declared[name].tab || declared[name].tab === tab();
    const currentState = () => (tab() ? {...state(), tab: tab()} : state());

    async function reload({only = []} = {}) {
        const answer = await context.readKeys({only, state: currentState()});
        if (!answer.ok) {
            if (answer.failure !== "cancelled") only.forEach((name) => (part(name).failure = answer.error));
            return false;
        }
        Object.entries(answer.value.keys).forEach(([name, result]) => {
            part(name).failure = result.ok ? "" : result.error;
            part(name).loaded = true;
            if (result.ok) part(name).value = result.value;
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
        names.filter((name) => !isOnScreen(name)).forEach((name) => (part(name).loaded = false));
        reloadSoon(names.filter(isOnScreen));
    }

    function follow(listed) {
        if (Object.keys(declared).length) return;
        declared = listed;
        const patterns = [...new Set(Object.values(listed).flatMap((key) => key.events))];
        if (patterns.length) context.follow(patterns, heard);
        Object.entries(listed).filter(([, key]) => key.every_seconds > 0).forEach(([name, key]) => {
            timers.push(setInterval(() => {
                if (context.visible.value && isOnScreen(name)) reloadSoon([name]);
            }, key.every_seconds * 1000));
        });
    }

    watch(tab, () => {
        const only = Object.keys(declared).filter((name) => isOnScreen(name) && !part(name).loaded);
        if (only.length) reload({only});
    });
    onUnmounted(() => {
        clearTimeout(join);
        timers.forEach(clearInterval);
    });
    reload();
    return {data, reload};
}
