<script setup>
import {narrow} from "../platform/view.js";
import {computed, onMounted, onUnmounted, provide, ref, watch} from "vue";
import {api} from "../api/client.js";
import {open} from "../domain/records.js";
import ThreadSkeleton from "../chat/ThreadSkeleton.vue";
import AgentBar from "../chat/AgentBar.vue";
import HomeView from "./HomeView.vue";
import DumpWindow from "../chat/DumpWindow.vue";
import {store} from "../state/store.js";
import PaneMenu from "./PaneMenu.vue";
import HintBubble from "../kit/HintBubble.vue";
import {useMenuHint} from "../composables/menuHint.js";
import Btn from "../kit/Btn.vue";
import DragGhost from "../kit/DragGhost.vue";
import DropCompass from "../kit/DropCompass.vue";
import Icon from "../kit/Icon.vue";
import PaneGrid from "../kit/PaneGrid.vue";
import PaneTabs from "../kit/PaneTabs.vue";
import SplitOffer from "../kit/SplitOffer.vue";
import TourStep from "../kit/TourStep.vue";
import {useHomeViews} from "../composables/homeViews.js";
import {usePaneLayout} from "../composables/paneLayout.js";
import {usePaneDrag} from "../composables/paneDrag.js";
import {useDetached} from "../composables/detached.js";
import {clamp} from "../format/number.js";
import {FULLSCREEN_KEYS} from "../platform/fullscreen.js";
import {useTour} from "../composables/tour.js";
import {saveViewerSetting, viewerSetting} from "../composables/viewerSetting.js";
import {schemeChoices, schemeColors, windowSchemes} from "../domain/schemes.js";
import {levelChoices, levelOf} from "../domain/verbosity.js";
import {
    AGENT_VIEWS,
    DEFAULT_SHAPE,
    PRESETS,
    activated,
    aimAt,
    arranged,
    holding,
    leaves,
    matches,
    paneClosed,
    ordered,
    placed,
    shapeViews,
    snapshot,
    tabClosed,
    thumbnail,
    schemed,
    tuned,
    widthOf,
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
const {layout, measured, panes, open: opened, apply, replace, resize, stage} = usePaneLayout();
const {floats, detach, bringBack} = useDetached();
const grid = ref(null);
watch(grid, (g) => (stage.value = g ? g.element : null));
onUnmounted(() => (stage.value = null));
const offer = ref(null);
const menu = ref(null);

const area = () => {
    const el = grid.value && grid.value.element;
    return el ? el.getBoundingClientRect() : null;
};
const away = computed(() => layout.value.away || []);
const over = (f, x, y) => x >= f.x && x <= f.x + f.w && y >= f.y && y <= f.y + f.h;

function tabSpot(x, y, grip) {
    const row = grip.from !== null && document.elementFromPoint(x, y)?.closest("[data-tabs-of]");
    if (!row) return null;
    const tabs = [...row.querySelectorAll("[data-tab]")];
    const at = tabs.findIndex((t) => {
        const r = t.getBoundingClientRect();
        return x < r.left + r.width / 2;
    });
    const index = at < 0 ? tabs.length : at;
    return {id: Number(row.dataset.tabsOf), zone: "tabs", index, before: at < 0 ? null : tabs[at].dataset.tab};
}

function aim(x, y, grip) {
    const box = area();
    if (!box || floats.value.some((f) => over(f, x, y))) return null;
    return tabSpot(x, y, grip) || aimAt(layout.value, box, x, y, grip.from);
}

function land(grip, target) {
    if (target.zone === "tabs" && grip.from === target.id) return replace(ordered(layout.value, target.id, grip.view, target.before));
    if (target.zone === "tabs") {
        const change = placed(layout.value, grip.view, target.id, "center", grip.from);
        change.layout = ordered(change.layout, target.id, grip.view, target.before);
        return apply(change);
    }
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
    detach(pane.active, {x: box.left + r.x * box.width + 40, y: box.top + r.y * box.height + 48, w, h});
}

const lifted = (key) => (drag.value && drag.value.from === null && drag.value.view === key) || (offer.value && offer.value.view === key);

const paneColors = (pane) => schemeColors(pane && pane.scheme, layout.value.scheme);

const savedPresets = computed(() => viewerSetting("presets", []));
const everyPreset = computed(() => [...PRESETS, ...savedPresets.value.map((p) => ({...p, text: "Saved layout", saved: true}))]);
const keepPresets = (list) => saveViewerSetting("presets", list);

function saveLayout(name) {
    keepPresets([
        ...savedPresets.value,
        {key: `saved-${Date.now()}`, name, shape: snapshot(layout.value), scheme: layout.value.scheme || ""},
    ]);
}

const updatePreset = (key) =>
    keepPresets(
        savedPresets.value.map((p) => (p.key === key ? {...p, shape: snapshot(layout.value), scheme: layout.value.scheme || ""} : p))
    );
const layoutOf = (preset) => ({name: preset.name, shape: preset.shape, scheme: preset.scheme || ""});
const linkPreset = async (key, lasting) => {
    const preset = savedPresets.value.find((p) => p.key === key);
    return (await api.shareLayout(preset.name, layoutOf(preset), lasting)).abstract;
};
const readLayoutLink = (url) => api.layoutFrom(url);
const sharePreset = (key) => {
    const preset = savedPresets.value.find((p) => p.key === key);
    if (!preset) return;
    const file = new Blob([JSON.stringify(layoutOf(preset), null, 2)], {
        type: "application/json",
    });
    const link = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(file),
        download: `${preset.name.replace(/[^\w-]+/g, "-")}.layout.json`,
    });
    link.click();
    URL.revokeObjectURL(link.href);
};
const importPreset = (preset) =>
    keepPresets([...savedPresets.value, {key: `saved-${Date.now()}`, name: preset.name, shape: preset.shape, scheme: preset.scheme || ""}]);
const renamePreset = (key, name) => keepPresets(savedPresets.value.map((p) => (p.key === key ? {...p, name} : p)));
const removePreset = (key) => keepPresets(savedPresets.value.filter((p) => p.key !== key));

const presets = computed(() =>
    everyPreset.value
        .filter((p) => shapeViews(p.shape).every((v) => usable.value.includes(v)))
        .map((p) => ({
            key: p.key,
            name: p.name,
            text: p.text,
            cells: thumbnail(p.shape),
            current: matches(layout.value, p.shape),
            saved: !!p.saved,
        }))
);

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
    presets,
    preset: applyPreset,
    saveLayout,
    renamePreset,
    updatePreset,
    removePreset,
    sharePreset,
    importPreset,
    linkPreset,
    readLayoutLink,
    schemes: computed(() => schemeChoices(layout.value.scheme)),
    scheme: (key) => replace(schemed(layout.value, key)),
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

const menuPane = computed(() => menu.value && layout.value.panes[menu.value.id]);
const menuOpen = computed(() => !!menuPane.value);
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

function toggleMenu(e, id) {
    menu.value = menu.value && menu.value.id === id ? null : {id, anchor: e.currentTarget};
    if (menu.value) menuSeen(layout.value.panes[id] && layout.value.panes[id].active);
}

const aimed = computed(() => (drag.value && drag.value.target) || null);

const ghostHint = computed(() => {
    const target = aimed.value;
    if (!target) return "";
    const pane = layout.value.panes[target.id];
    if (target.zone === "tabs") return drag.value.from === target.id ? "Move here" : "Add as tab here";
    if (target.zone !== "center") return `Split ${{left: "left", right: "right", top: "above", bottom: "below"}[target.zone]}`;
    if (!pane.tabs.length) return "Open here";
    return drag.value.from === null && !pane.tabs.includes(drag.value.view) ? "Split or add" : "Add as tab";
});

const offerText = (id) => {
    const pane = layout.value.panes[id];
    if (!offerStands(offer.value) || !pane) return "";
    return `Put ${views.value[offer.value.view].title} beside ${views.value[pane.active].title} in two panes, or add it here as a tab.`;
};

function applyPreset(key) {
    const preset = everyPreset.value.find((p) => p.key === key);
    if (!preset) return;
    const change = arranged(layout.value, preset.shape);
    if (preset.scheme !== undefined) change.layout.scheme = preset.scheme;
    apply(change);
}

const TOUR = [
    {
        target: ".agent-view:not(.gone)",
        fallback: ".agent-actions",
        title: "Drag a view onto a pane",
        text: "Every view has an icon here. Drag one onto a pane to open it there. The icon comes back when you close that view.",
    },
    {
        target: ".agent-presets",
        title: "Pick a preset",
        text: "Presets opens a list of ready layouts, such as Default, Zen and Hacker, and arranges every pane in one step.",
    },
    {
        target: '.menu-panel [data-step="split"]',
        menu: true,
        title: "Split a pane",
        text: "Each pane has this menu. Split right or Split below opens a second view beside this one.",
    },
    {
        target: '.menu-panel [data-step="detach"]',
        menu: true,
        title: "Detach a view",
        text: "Detach opens this view in a window of its own that stays on screen on every page, and in other tabs with the extension. Dock it back from its menu.",
    },
    {
        target: '[data-step="fullscreen"]',
        title: "Full screen",
        text: `This button, or ${FULLSCREEN_KEYS}, hides the sidebar and the top bar so the panes fill the screen. Esc brings them back.`,
    },
];

function tourMenu() {
    const ids = leaves(layout.value.tree);
    const id = ids.find((at) => layout.value.panes[at] && layout.value.panes[at].active) ?? ids[0];
    const button = document.querySelector(`[data-pane-menu="${id}"]`);
    if (button) menu.value = {id, anchor: button};
}

const {
    step: tourStep,
    rect: tourRect,
    next: tourNext,
    end: tourEnd,
} = useTour(TOUR, {
    isOpen: () => !!menu.value,
    open: tourMenu,
    close: () => (menu.value = null),
});
const tourNow = computed(() => TOUR[tourStep.value] || null);
const {hinted, focus: focusWindow, opened: menuSeen} = useMenuHint(() => tourStep.value >= 0);

const moveTab = (from, to) => {
    const pane = layout.value.panes[from];
    if (pane && pane.active && layout.value.panes[to]) apply(placed(layout.value, pane.active, to, "center", from));
};
const chatFirst = (p) => (p.pane && p.pane.tabs.includes("chat") ? 0 : 1);
const shutPane = (id) => layout.value.panes[id] && apply(paneClosed(layout.value, id));

const pageOpened = Date.now() / 1000;
watch(
    () =>
        open("question")
            .filter((q) => q.created > pageOpened)
            .map((q) => q.n),
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
            <div class="home-panes">
                <PaneGrid
                    ref="grid"
                    :panes="panes"
                    :splits="measured.splits"
                    :colors="paneColors"
                    :stacked="narrow"
                    :rank="chatFirst"
                    @resize="resize"
                >
                    <template #pane="{id, pane, state}">
                        <PaneTabs
                            :tabs="tabsOf(id, pane)"
                            :data-tabs-of="id"
                            :insert-at="aimed && aimed.zone === 'tabs' && aimed.id === id ? aimed.index : -1"
                            @grab="(e, key) => grabTab(e, id, key)"
                            @pick="(key) => apply(activated(layout, id, key))"
                            @close="(key) => apply(tabClosed(layout, id, key))"
                        >
                            <span class="pane-menu-anchor">
                                <button
                                    type="button"
                                    :class="['pane-menu-btn', {on: menu && menu.id === id, hinted: hinted === id}]"
                                    :data-pane-menu="id"
                                    title="Pane menu"
                                    @click.stop="toggleMenu($event, id)"
                                >
                                    <Icon name="dots" />
                                </button>
                                <template v-if="hinted === id">
                                    <HintBubble text="More for this window here: detach it, split it, dock it and more." />
                                </template>
                            </span>
                        </PaneTabs>
                        <div :class="['pane-body', widthOf(pane)]" @pointerdown="focusWindow(id, pane.active)">
                            <template v-if="pane.active">
                                <HomeView
                                    :view="pane.active"
                                    :level="levelOf(pane)"
                                    :flush="!!pane.flush"
                                    :feed="pane.feed || null"
                                    :hidden="pane.hide || []"
                                    @feed="(feed) => replace(tuned(layout, id, {feed}))"
                                />
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
                        <template v-if="aimed && aimed.id === id && aimed.zone !== 'tabs' && state === 'live'">
                            <DropCompass :zone="aimed.zone" />
                        </template>
                    </template>
                </PaneGrid>
                <Transition name="home-dump">
                    <div v-if="store.dumping" class="home-dump">
                        <DumpWindow />
                    </div>
                </Transition>
            </div>
            <template v-if="menuOpen">
                <PaneMenu
                    :pane="menu.id"
                    :anchor="menu.anchor"
                    :title="menuPane && menuPane.active ? views[menuPane.active].title : ''"
                    :all="menuPane && menuPane.active ? views[menuPane.active].all : null"
                    :width="widthOf(menuPane)"
                    :schemes="menuPane ? windowSchemes(menuPane.scheme, layout.scheme) : []"
                    :levels="menuPane && menuPane.active === 'terminal' ? levelChoices(menuPane) : []"
                    :chat="!!menuPane && menuPane.active === 'chat'"
                    :agents="!!menuPane && menuPane.active === 'agents'"
                    :hidden="(menuPane && menuPane.hide) || []"
                    :flushable="!!(menuPane && menuPane.active && views[menuPane.active].canFlush)"
                    :flush="!!(menuPane && menuPane.flush)"
                    :others="menuOthers"
                    :splittable="!!menuPane && (menuPane.tabs.length > 1 || (menuPane.tabs.length > 0 && !!free()))"
                    :closable="!!menuPane && (leaves(layout.tree).length > 1 || menuPane.tabs.length > 0)"
                    @close="menu = null"
                    @split="splitPane"
                    @move="moveTab"
                    @float="floatPane"
                    @shut="shutPane"
                    @reset="apply(arranged(layout, DEFAULT_SHAPE))"
                    @width="(id, width) => replace(tuned(layout, id, {width}))"
                    @scheme="(id, scheme) => replace(tuned(layout, id, {scheme}))"
                    @flush="(id, flush) => replace(tuned(layout, id, {flush}))"
                    @verbosity="(id, verbosity) => replace(tuned(layout, id, {verbosity}))"
                    @hide="(id, hide) => replace(tuned(layout, id, {hide}))"
                />
            </template>
            <template v-if="drag">
                <DragGhost :x="drag.x" :y="drag.y" :icon="views[drag.view].icon" :title="views[drag.view].title" :hint="ghostHint" />
            </template>
            <template v-if="tourNow && tourRect">
                <TourStep
                    :rect="tourRect"
                    :beside="!!tourNow.menu"
                    :count="`${tourStep + 1} of ${TOUR.length}`"
                    :title="tourNow.title"
                    :text="tourNow.text"
                    :last="tourStep === TOUR.length - 1"
                    @next="tourNext"
                    @skip="tourEnd"
                />
            </template>
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

.home-panes {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.home-dump {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    flex-direction: column;
    background: var(--bg);
}

.home-dump-enter-active,
.home-dump-leave-active {
    transition:
        opacity 0.3s var(--ease),
        transform 0.4s var(--ease);
}

.home-dump-enter-from,
.home-dump-leave-to {
    opacity: 0;
    transform: scale(0.99);
}

@media (prefers-reduced-motion: reduce) {
    .home-dump-enter-active,
    .home-dump-leave-active {
        transition: opacity 0.2s;
    }

    .home-dump-enter-from,
    .home-dump-leave-to {
        transform: none;
    }
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

.pane-body.contained > * {
    align-self: center;
    width: 100%;
    max-width: 880px;
}

.pane-menu-anchor {
    position: relative;
    display: grid;
    align-self: center;
}

.pane-menu-btn.hinted {
    color: var(--accent-text);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 45%, transparent);
    animation: menu-hint 1.6s var(--ease) infinite;
}

@keyframes menu-hint {
    50% {
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 20%, transparent);
    }
}

@media (prefers-reduced-motion: reduce) {
    .pane-menu-btn.hinted {
        animation: none;
    }
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
</style>
