import {computed} from "vue";
import {listenViewTabs, openViewTab} from "./viewTabs.js";
import {clamp} from "../format/number.js";
import {broughtBack, floated, fronted, landed, reshaped, sentAway, tabClosed, unfloated} from "../domain/panes.js";

const MIN_W = 260;
const MIN_H = 180;
const EDGE = 8;
const BAR = 40;
const START = 80;
const SIZE = {w: 480, h: 360};

// the floating and sent-away windows of a layout store: a pane's window detached at the size it declares, moved, sized,
// docked back into a pane, sent to a browser window of its own and brought back from there
export function useDetached(store, catalogue, environment) {
    const layout = () => store.layout.value;
    const floats = computed(() => layout()?.floats || []);
    const find = (id) => floats.value.find((f) => f.id === id);
    const tabs = listenViewTabs({
        dock: (id) => store.replace(broughtBack(layout(), id)),
        closed: (id) => {
            store.replace(broughtBack(layout(), id));
            dock(id);
        },
    });

    function detach(pane) {
        const view = layout().panes[pane].active;
        const entry = catalogue.window(view);
        const w = clamp(entry?.float_width || SIZE.w, MIN_W, window.innerWidth - 2 * EDGE);
        const h = clamp(entry?.float_height || SIZE.h, MIN_H, window.innerHeight - 2 * EDGE);
        const change = tabClosed(layout(), pane, view);
        store.apply({...change, layout: floated(change.layout, view, {x: START, y: START, w, h})});
    }

    function move(id, to) {
        const f = find(id);
        if (f) store.replace(reshaped(layout(), id, {x: clamp(to.x, BAR - f.w, window.innerWidth - BAR), y: clamp(to.y, 0, window.innerHeight - BAR)}));
    }

    function size(id, to) {
        const f = find(id);
        if (f) store.replace(reshaped(layout(), id, {w: clamp(to.w, MIN_W, window.innerWidth - f.x), h: clamp(to.h, MIN_H, window.innerHeight - f.y)}));
    }

    const tune = (id, patch) => store.replace(reshaped(layout(), id, patch));

    function front(id) {
        const last = floats.value[floats.value.length - 1];
        if (last && last.id !== id) store.replace(fronted(layout(), id));
    }

    function dock(id) {
        const change = landed(layout(), id);
        if (!change) return;
        store.apply(change);
        store.replace(unfloated(layout(), id));
    }

    function sendAway(id) {
        const f = find(id);
        if (!f) return null;
        if (!openViewTab(f.view, id, environment)) return null;
        store.replace(sentAway(layout(), id));
        return f;
    }

    function bringBack(id) {
        tabs.recall(id);
        store.replace(broughtBack(layout(), id));
    }

    return {floats, detach, move, size, tune, front, dock, sendAway, bringBack};
}
