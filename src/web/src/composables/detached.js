import {computed, effectScope, ref} from "vue";
import {usePaneLayout} from "./paneLayout.js";
import {listenViewTabs, openViewTab} from "./viewTabs.js";
import {clamp} from "../format/number.js";
import {hand, takeBack, whenPutBack} from "../platform/extension.js";
import {route} from "../route.js";
import {store} from "../state/store.js";
import {broughtBack, floated, forgotten, fronted, landed, reshaped, sentAway, unfloated} from "../domain/panes.js";

const LAND = 280;
const MIN_W = 260;
const MIN_H = 180;
const EDGE = 8;
const BAR = 40;

function shared() {
    const {layout, measured, apply, replace, stage} = usePaneLayout();
    const landing = ref({});
    const floats = computed(() => layout.value.floats || []);
    const find = (id) => floats.value.find((f) => f.id === id);
    const tabs = listenViewTabs({
        dock: (id) => replace(broughtBack(layout.value, id)),
        closed: (id) => replace(forgotten(layout.value, id)),
    });

    function detach(view, box) {
        const w = clamp(box.w, MIN_W, window.innerWidth - 2 * EDGE);
        const h = clamp(box.h, MIN_H, window.innerHeight - 2 * EDGE);
        const x = clamp(box.x, EDGE, window.innerWidth - w - EDGE);
        const y = clamp(box.y, EDGE, window.innerHeight - h - EDGE);
        replace(floated(layout.value, view, {x, y, w, h}));
        if (store.extension.here) hand(floats.value[floats.value.length - 1], route.value.env);
    }

    function move(id, to) {
        const f = find(id);
        if (f)
            replace(
                reshaped(layout.value, id, {
                    x: clamp(to.x, BAR - f.w, window.innerWidth - BAR),
                    y: clamp(to.y, 0, window.innerHeight - BAR),
                })
            );
    }

    function size(id, to) {
        const f = find(id);
        if (f)
            replace(
                reshaped(layout.value, id, {
                    w: clamp(to.w, MIN_W, window.innerWidth - f.x),
                    h: clamp(to.h, MIN_H, window.innerHeight - f.y),
                })
            );
    }

    const tune = (id, patch) => replace(reshaped(layout.value, id, patch));

    function front(id) {
        const last = floats.value[floats.value.length - 1];
        if (last && last.id !== id) replace(fronted(layout.value, id));
    }

    function close(id) {
        takeBack(id);
        replace(unfloated(layout.value, id));
    }

    function settle(id) {
        const rest = {...landing.value};
        delete rest[id];
        landing.value = rest;
        replace(unfloated(layout.value, id));
    }

    function dock(id) {
        const change = landed(layout.value, id);
        if (!change) return;
        takeBack(id);
        apply(change);
        const box = stage.value && stage.value.getBoundingClientRect();
        if (!box) return close(id);
        const r = measured.value.rects[change.target];
        landing.value = {
            ...landing.value,
            [id]: {x: box.left + r.x * box.width, y: box.top + r.y * box.height, w: r.w * box.width, h: r.h * box.height},
        };
        setTimeout(() => settle(id), LAND);
    }

    function sendAway(id, env) {
        const f = find(id);
        if (!f) return null;
        takeBack(id);
        openViewTab(env, f.view, id);
        replace(sentAway(layout.value, id));
        return f;
    }

    function bringBack(id) {
        tabs.recall(id);
        replace(broughtBack(layout.value, id));
    }

    whenPutBack(dock);
    const drawn = computed(() => floats.value.filter((f) => !store.extension.held.includes(f.id)));

    return {floats, drawn, landing, detach, move, size, tune, front, close, dock, sendAway, bringBack};
}

let one = null;

export function useDetached() {
    one = one || effectScope(true).run(shared);
    return one;
}
