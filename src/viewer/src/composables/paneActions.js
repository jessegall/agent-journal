import {computed, ref} from "vue";
import {activated, aimAt, holding, leaves, measure, ordered, paneClosed, placed, tabClosed, tuned} from "../domain/panes.js";
import {useDetached} from "./detached.js";
import {usePaneDrag} from "./paneDrag.js";

const HINTS = {
    tabs: "Add to these tabs",
    center: "Add as a tab",
    left: "Split to the left",
    right: "Split to the right",
    top: "Split above",
    bottom: "Split below",
};

// what a pane stage does with its layout store: tab strips and edges aim a held tab, a drop lands it, and tabs close,
// pick and reopen; `area` is the ref to the pane grid
export function usePaneActions({store, area, catalogue, counts, environment}) {
    const layout = () => store.layout.value;
    const offer = ref(null);
    const detached = useDetached(store, catalogue, environment);

    function stripAt(x, y) {
        for (const strip of area.value.element.querySelectorAll("[data-tabs-of]")) {
            const box = strip.getBoundingClientRect();
            if (x < box.left || x > box.right || y < box.top || y > box.bottom) continue;
            const tabs = [...strip.querySelectorAll("[data-tab]")].map((tab) => tab.getBoundingClientRect());
            return {id: Number(strip.dataset.tabsOf), zone: "tabs", index: tabs.filter((tab) => tab.left + tab.width / 2 < x).length};
        }
        return null;
    }

    function aim(x, y, grip) {
        const strip = stripAt(x, y);
        if (strip) return strip.id === grip.from && layout().panes[grip.from].tabs.length === 1 ? null : strip;
        const box = area.value.element.getBoundingClientRect();
        return aimAt(layout(), box, x, y, grip.from);
    }

    function land(grip, target) {
        if (grip.from === null && target.zone === "center" && layout().panes[target.id].tabs.length) {
            offer.value = {id: target.id, view: grip.view};
            return;
        }
        if (target.zone !== "tabs") return store.apply(placed(layout(), grip.view, target.id, target.zone, grip.from));
        const before = layout().panes[target.id].tabs.filter((tab) => tab !== grip.view)[target.index];
        if (target.id !== grip.from) store.apply(placed(layout(), grip.view, target.id, "center", grip.from));
        store.replace(ordered(layout(), target.id, grip.view, before));
    }

    const {drag, grab} = usePaneDrag(aim, land);
    const aimed = computed(() => drag.value?.target || null);

    const grabTab = (event, id, view) => grab(event, {view, from: id, click: () => pick(id, view)});
    const pick = (id, view) => store.apply(activated(layout(), id, view));
    const closeTab = (id, view) => store.apply(tabClosed(layout(), id, view));
    const closePane = (id) => store.apply(paneClosed(layout(), id));

    const tabsOf = (id, pane) =>
        pane.tabs.map((name) => {
            const entry = catalogue.window(name);
            return {
                key: name,
                title: entry?.title || pane.titles?.[name] || name,
                icon: entry?.icon || "window",
                gone: !entry,
                count: counts.value[name]?.count,
                hot: Boolean(counts.value[name]?.warm),
                on: name === pane.active,
                lifting: drag.value?.view === name && drag.value.from === id,
            };
        });

    const ghost = computed(() => {
        if (!drag.value) return null;
        const entry = catalogue.window(drag.value.view);
        const pane = layout().panes[drag.value.from];
        return {
            x: drag.value.x,
            y: drag.value.y,
            icon: entry?.icon || "window",
            title: entry?.title || pane?.titles?.[drag.value.view] || drag.value.view,
            hint: drag.value.target ? HINTS[drag.value.target.zone] : "",
        };
    });

    const full = ref(null);
    const menu = ref(null);

    function keyed(event) {
        if (event.key === "Escape" && full.value !== null) full.value = null;
        const strip = event.target.closest?.("[data-tabs-of]");
        if (event.key === "f" && strip) full.value = full.value === null ? Number(strip.dataset.tabsOf) : null;
    }

    const toggleMenu = (id) => (menu.value = menu.value === id ? null : id);
    const split = (id, zone) => {
        const pane = layout().panes[id];
        store.apply(placed(layout(), pane.active, id, zone, id));
        menu.value = null;
    };
    const moveTo = (id, target) => {
        store.apply(placed(layout(), layout().panes[id].active, target, "center", id));
        menu.value = null;
    };
    const others = (id) =>
        leaves(layout().tree)
            .filter((other) => other !== id)
            .map((other) => ({id: other, title: tabsOf(other, layout().panes[other]).find((tab) => tab.on)?.title || "Empty pane"}));

    const closedWindows = computed(() => !layout() ? [] : catalogue.windows.value.filter((window) => !store.open.value.has(window.name)));

    // a window joins the pane holding it, else the largest pane
    function openView(name) {
        const at = holding(layout(), name);
        if (at !== null) return pick(at, name);
        const {rects} = measure(layout().tree);
        const area = (id) => rects[id].w * rects[id].h;
        const largest = leaves(layout().tree).reduce((best, id) => (area(id) > area(best) ? id : best));
        store.apply(placed(layout(), name, largest, "center"));
    }

    const offerText = computed(() => {
        const entry = offer.value && catalogue.window(offer.value.view);
        return `${entry?.title || offer.value?.view} can sit beside this pane or join its tabs.`;
    });

    function answer(zone) {
        const {id, view} = offer.value;
        offer.value = null;
        if (zone) store.apply(placed(layout(), view, id, zone, null));
    }

    const detach = (id) => {
        detached.detach(id);
        menu.value = null;
    };

    const setOption = (id, key, value) => store.replace(tuned(layout(), id, {options: {...(layout().panes[id].options || {}), [key]: value}}));

    const grabWindow = (event, view) => grab(event, {view, from: null});

    return {detached, detach, setOption, full, menu, keyed, toggleMenu, split, moveTo, others, drag, aimed, ghost, grabTab, pick, closeTab, closePane, tabsOf, closedWindows, openView, grabWindow, offer, offerText, answer};
}
