<script setup>
import {computed, onMounted, onUnmounted, provide, ref, watch} from "vue";
import {open} from "../domain/records.js";
import {route} from "../route.js";
import ThreadSkeleton from "../chat/ThreadSkeleton.vue";
import AgentBar from "../chat/AgentBar.vue";
import HomeView from "./HomeView.vue";
import PaneMenu from "./PaneMenu.vue";
import Btn from "../kit/Btn.vue";
import DragGhost from "../kit/DragGhost.vue";
import DropCompass from "../kit/DropCompass.vue";
import FloatWindow from "../kit/FloatWindow.vue";
import Icon from "../kit/Icon.vue";
import PaneGrid from "../kit/PaneGrid.vue";
import PaneTabs from "../kit/PaneTabs.vue";
import SplitOffer from "../kit/SplitOffer.vue";
import Toast from "../kit/Toast.vue";
import {useHomeViews} from "../composables/homeViews.js";
import {usePaneLayout} from "../composables/paneLayout.js";
import {usePaneDrag} from "../composables/paneDrag.js";
import {openViewTab, useViewTabs} from "../composables/viewTabs.js";
import {
    AGENT_VIEWS,
    DEFAULT_SHAPE,
    activated,
    aimAt,
    arranged,
    broughtBack,
    clamp,
    floated,
    forgotten,
    fronted,
    holding,
    landed,
    leaves,
    paneClosed,
    placed,
    reshaped,
    sentAway,
    tabClosed,
    unfloated,
} from "../domain/panes.js";

const ready = ref(false);
let frame = 0;
onMounted(() => {
    frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => (ready.value = true));
    });
});
onUnmounted(() => cancelAnimationFrame(frame));

const {views, usable} = useHomeViews();
const {layout, measured, panes, open: opened, apply, replace, resize} = usePaneLayout();
const grid = ref(null);
const offer = ref(null);
const menu = ref(null);
const toast = ref(null);
const landing = ref({});
const LAND = 280;
const MIN_W = 260;
const MIN_H = 180;

const area = () => {
    const el = grid.value && grid.value.element;
    return el ? el.getBoundingClientRect() : null;
};
const floats = computed(() => layout.value.floats || []);
const away = computed(() => layout.value.away || []);
const over = (box, f, x, y) => x >= box.left + f.x && x <= box.left + f.x + f.w && y >= box.top + f.y && y <= box.top + f.y + f.h;

function aim(x, y, grip) {
    const box = area();
    if (!box || floats.value.some((f) => over(box, f, x, y))) return null;
    return aimAt(layout.value, box, x, y, grip.from);
}

function land(grip, target) {
    const pane = layout.value.panes[target.id];
    if (target.zone === "center" && pane.tabs.includes(grip.view)) return apply(activated(layout.value, target.id, grip.view));
    if (target.zone === "center" && grip.from === null && pane.tabs.length) {
        offer.value = {id: target.id, view: grip.view};
        return;
    }
    apply(placed(layout.value, grip.view, target.id, target.zone, grip.from));
}

const {drag, grab} = usePaneDrag(aim, land);
const size = (r) => r.w * r.h;

function openView(view) {
    const at = holding(layout.value, view);
    if (at !== null) return apply(activated(layout.value, at, view));
    const {rects} = measured.value;
    const largest = leaves(layout.value.tree).sort((a, b) => size(rects[b]) - size(rects[a]))[0];
    apply(placed(layout.value, view, largest, "center"));
}

const offerStands = (asked) => {
    const pane = asked && layout.value.panes[asked.id];
    return !!pane && !!pane.active && !opened.value.has(asked.view);
};

watch([layout, offer], () => {
    if (offer.value && !offerStands(offer.value)) offer.value = null;
});

function answer(zone) {
    const asked = offer.value;
    offer.value = null;
    if (zone && offerStands(asked)) apply(placed(layout.value, asked.view, asked.id, zone));
}

const free = () => usable.value.find((v) => !opened.value.has(v));

function splitPane(id, zone) {
    const pane = layout.value.panes[id];
    if (!pane) return;
    if (pane.tabs.length > 1) return apply(placed(layout.value, pane.active, id, zone, id));
    if (free()) apply(placed(layout.value, free(), id, zone));
}

function floatPane(id) {
    const pane = layout.value.panes[id];
    const box = area();
    if (!pane || !pane.active || !box) return;
    const r = measured.value.rects[id];
    const w = clamp(r.w * box.width * 0.8, 320, 440);
    const h = clamp(r.h * box.height * 0.7, 240, 380);
    const x = clamp(r.x * box.width + 40, 8, box.width - w - 8);
    const y = clamp(r.y * box.height + 48, 8, box.height - h - 8);
    replace(floated(layout.value, pane.active, {x, y, w, h}));
}

function moveFloat(id, to) {
    const box = area();
    const f = floats.value.find((x) => x.id === id);
    if (!box || !f) return;
    replace(reshaped(layout.value, id, {x: clamp(to.x, 0, box.width - f.w), y: clamp(to.y, 0, box.height - 40)}));
}

function sizeFloat(id, to) {
    const box = area();
    const f = floats.value.find((x) => x.id === id);
    if (!box || !f) return;
    replace(reshaped(layout.value, id, {w: clamp(to.w, MIN_W, box.width - f.x), h: clamp(to.h, MIN_H, box.height - f.y)}));
}

function frontFloat(id) {
    const last = floats.value[floats.value.length - 1];
    if (last && last.id !== id) replace(fronted(layout.value, id));
}

function dockFloat(id) {
    const change = landed(layout.value, id);
    const box = area();
    if (!change || !box) return;
    apply(change);
    const r = measured.value.rects[change.target];
    landing.value = {...landing.value, [id]: {x: r.x * box.width, y: r.y * box.height, w: r.w * box.width, h: r.h * box.height}};
    setTimeout(() => {
        const rest = {...landing.value};
        delete rest[id];
        landing.value = rest;
        replace(unfloated(layout.value, id));
    }, LAND);
}

function sendAway(id) {
    const f = floats.value.find((x) => x.id === id);
    if (!f) return;
    openViewTab(route.value.env, f.view, id);
    replace(sentAway(layout.value, id));
    toast.value = {text: `${views.value[f.view].title} opened in another tab`, label: "Bring back", action: () => bringBack(id)};
}

const tabs = useViewTabs({
    dock: (id) => replace(broughtBack(layout.value, id)),
    closed: (id) => replace(forgotten(layout.value, id)),
});

function bringBack(id) {
    tabs.recall(id);
    replace(broughtBack(layout.value, id));
}

const shown = computed(() => floats.value.map((f) => ({...f, ...(landing.value[f.id] || {}), landing: !!landing.value[f.id]})));

const lifted = (key) => (drag.value && drag.value.from === null && drag.value.view === key) || (offer.value && offer.value.view === key);

provide("views", {
    items: computed(() =>
        usable.value.map((key) => ({
            key,
            group: AGENT_VIEWS.includes(key) ? "agent" : "panel",
            title: views.value[key].title,
            icon: views.value[key].icon,
            open: opened.value.has(key),
            lifting: lifted(key),
        }))
    ),
    away: computed(() => away.value.map((f) => ({id: f.id, title: views.value[f.view].title, icon: views.value[f.view].icon}))),
    grab: (e, key) => grab(e, {view: key, from: null, click: () => openView(key)}),
    back: bringBack,
});

function tabsOf(id, pane) {
    return pane.tabs
        .filter((key) => usable.value.includes(key))
        .map((key) => ({
            key,
            title: views.value[key].title,
            icon: views.value[key].icon,
            count: views.value[key].count,
            hot: !!(views.value[key].count && views.value[key].warm),
            on: key === pane.active,
            lifting: !!drag.value && drag.value.from === id && drag.value.view === key,
        }));
}

const grabTab = (e, id, key) => grab(e, {view: key, from: id, click: () => apply(activated(layout.value, id, key))});

const menuPane = computed(() => menu.value && !menu.value.floating && layout.value.panes[menu.value.id]);
const menuOpen = computed(
    () => !!menu.value && (menu.value.floating ? floats.value.some((f) => f.id === menu.value.id) : !!menuPane.value)
);
const menuOthers = computed(() =>
    menuPane.value
        ? leaves(layout.value.tree)
              .filter((id) => id !== menu.value.id)
              .map((id) => {
                  const pane = layout.value.panes[id];
                  return {
                      id,
                      label: pane.tabs.map((key) => views.value[key].title).join(", ") || "Empty pane",
                      icon: pane.active ? views.value[pane.active].icon : "panel",
                  };
              })
        : []
);

function toggleMenu(e, id, floating = false) {
    const same = menu.value && menu.value.id === id && menu.value.floating === floating;
    menu.value = same ? null : {id, anchor: e.currentTarget, floating};
}

const aimed = computed(() => (drag.value && drag.value.target) || null);

const ghostHint = computed(() => {
    const target = aimed.value;
    if (!target) return "";
    const pane = layout.value.panes[target.id];
    if (target.zone !== "center") return `Split ${{left: "left", right: "right", top: "above", bottom: "below"}[target.zone]}`;
    if (!pane.tabs.length) return "Open here";
    return drag.value.from === null && !pane.tabs.includes(drag.value.view) ? "Split or add" : "Add as tab";
});

const offerText = (id) => {
    const pane = layout.value.panes[id];
    if (!offerStands(offer.value) || !pane) return "";
    return `Put ${views.value[offer.value.view].title} beside ${views.value[pane.active].title} in two panes, or add it here as a tab.`;
};

const moveTab = (from, to) => {
    const pane = layout.value.panes[from];
    if (pane && pane.active && layout.value.panes[to]) apply(placed(layout.value, pane.active, to, "center", from));
};
const shutPane = (id) => layout.value.panes[id] && apply(paneClosed(layout.value, id));

watch(
    () => open("question").map((q) => q.n),
    (now, before) => {
        if (!now.some((n) => !(before || []).includes(n))) return;
        const at = holding(layout.value, "question");
        if (at !== null && layout.value.panes[at].active !== "question") apply(activated(layout.value, at, "question"));
    }
);
</script>

<template>
    <div class="home">
        <template v-if="!ready">
            <div class="home-loading">
                <ThreadSkeleton />
            </div>
        </template>
        <template v-else>
            <AgentBar />
            <PaneGrid ref="grid" :panes="panes" :splits="measured.splits" @resize="resize">
                <template #pane="{id, pane, state}">
                    <PaneTabs
                        :tabs="tabsOf(id, pane)"
                        @grab="(e, key) => grabTab(e, id, key)"
                        @pick="(key) => apply(activated(layout, id, key))"
                        @close="(key) => apply(tabClosed(layout, id, key))"
                    >
                        <button
                            type="button"
                            :class="['pane-menu-btn', {on: menu && !menu.floating && menu.id === id}]"
                            title="Pane menu"
                            @click.stop="toggleMenu($event, id)"
                        >
                            <Icon name="dots" />
                        </button>
                    </PaneTabs>
                    <div class="pane-body">
                        <template v-if="pane.active">
                            <HomeView :view="pane.active" />
                        </template>
                        <template v-else>
                            <div class="pane-empty">
                                <p class="pane-empty-title">No views open</p>
                                <p class="pane-empty-text">Open one here, or drag one in from the icons in the agent bar above.</p>
                                <div class="pane-empty-views">
                                    <template v-for="key in usable.filter((v) => !opened.has(v))" :key="key">
                                        <Btn @click="apply(placed(layout, key, id, 'center'))">
                                            <Icon :name="views[key].icon" :size="13" />
                                            {{ views[key].title }}
                                        </Btn>
                                    </template>
                                </div>
                                <Btn @click="apply(arranged(layout, DEFAULT_SHAPE))">Reset layout</Btn>
                            </div>
                        </template>
                        <template v-if="offer && offer.id === id">
                            <SplitOffer :text="offerText(id)" @pick="answer" />
                        </template>
                    </div>
                    <template v-if="aimed && aimed.id === id && state === 'live'">
                        <DropCompass :zone="aimed.zone" />
                    </template>
                </template>
                <TransitionGroup name="float">
                    <template v-for="f in shown" :key="f.id">
                        <FloatWindow
                            :x="f.x"
                            :y="f.y"
                            :w="f.w"
                            :h="f.h"
                            :title="views[f.view].title"
                            :icon="views[f.view].icon"
                            :landing="f.landing"
                            @front="frontFloat(f.id)"
                            @move="(to) => moveFloat(f.id, to)"
                            @size="(to) => sizeFloat(f.id, to)"
                            @dock="dockFloat(f.id)"
                            @menu="(e) => toggleMenu(e, f.id, true)"
                        >
                            <HomeView :view="f.view" />
                        </FloatWindow>
                    </template>
                </TransitionGroup>
            </PaneGrid>
            <template v-if="menuOpen">
                <PaneMenu
                    :pane="menu.id"
                    :anchor="menu.anchor"
                    :floating="menu.floating"
                    :title="menuPane && menuPane.active ? views[menuPane.active].title : ''"
                    :others="menuOthers"
                    :splittable="!!menuPane && (menuPane.tabs.length > 1 || (menuPane.tabs.length > 0 && !!free()))"
                    :closable="!!menuPane && (leaves(layout.tree).length > 1 || menuPane.tabs.length > 0)"
                    @close="menu = null"
                    @split="splitPane"
                    @move="moveTab"
                    @float="floatPane"
                    @shut="shutPane"
                    @reset="apply(arranged(layout, DEFAULT_SHAPE))"
                    @dock="dockFloat"
                    @away="sendAway"
                    @unfloat="(id) => replace(unfloated(layout, id))"
                />
            </template>
            <template v-if="drag">
                <DragGhost :x="drag.x" :y="drag.y" :icon="views[drag.view].icon" :title="views[drag.view].title" :hint="ghostHint" />
            </template>
            <Toast :toast="toast" @done="toast = null" />
        </template>
    </div>
</template>

<style scoped>
.home {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
}

.home-loading {
    flex: 1;
    min-height: 0;
    display: flex;
}

.pane-body {
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.pane-menu-btn {
    align-self: center;
    display: grid;
    place-items: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
}

.pane-menu-btn :deep(.ico) {
    color: inherit;
}

.pane-menu-btn:hover,
.pane-menu-btn.on {
    background: var(--hover);
    color: var(--text);
}

.pane-empty {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 24px;
    text-align: center;
}

.pane-empty-title {
    margin: 0;
    color: var(--text-2);
    font-size: 14px;
    font-weight: 500;
}

.pane-empty-text {
    max-width: 340px;
    margin: 0;
    color: var(--text-4);
    font-size: 12.5px;
    text-wrap: pretty;
}

.pane-empty-views {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    max-width: 480px;
}

.float-enter-active,
.float-leave-active {
    transition:
        opacity 0.22s ease,
        transform 0.22s var(--ease);
}

.float-enter-from {
    opacity: 0;
    transform: translateY(8px) scale(0.97);
}

.float-leave-to {
    opacity: 0;
    transform: scale(0.97);
}

@media (prefers-reduced-motion: reduce) {
    .float-enter-active,
    .float-leave-active {
        transition: none;
    }
}
</style>
