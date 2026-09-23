<script setup>
import {computed, onMounted, onUnmounted, provide, ref, watch} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import {open, unreadByUser} from "../domain/records.js";
import {detach} from "../platform/extension.js";
import {agent, feedOn, meta, store, types} from "../state/store.js";
import Thread from "../chat/Thread.vue";
import ThreadSkeleton from "../chat/ThreadSkeleton.vue";
import Notice from "../chat/Notice.vue";
import AgentBar from "../chat/AgentBar.vue";
import FileFeed from "../chat/FileFeed.vue";
import TerminalWindow from "../chat/TerminalWindow.vue";
import RailWaiting from "./RailWaiting.vue";
import RailTodos from "./RailTodos.vue";
import PaneMenu from "./PaneMenu.vue";
import Btn from "../kit/Btn.vue";
import DragGhost from "../kit/DragGhost.vue";
import DropCompass from "../kit/DropCompass.vue";
import EmptyState from "../kit/EmptyState.vue";
import Icon from "../kit/Icon.vue";
import PaneGrid from "../kit/PaneGrid.vue";
import PaneTabs from "../kit/PaneTabs.vue";
import SplitOffer from "../kit/SplitOffer.vue";
import {usePaneLayout} from "../composables/paneLayout.js";
import {usePaneDrag} from "../composables/paneDrag.js";
import {
    AGENT_VIEWS,
    DEFAULT_SHAPE,
    VIEWS,
    activated,
    aimAt,
    arranged,
    holding,
    leaves,
    paneClosed,
    placed,
    tabClosed,
} from "../domain/panes.js";

const ready = ref(false);
let frame = 0;
onMounted(() => {
    frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => (ready.value = true));
    });
});
onUnmounted(() => cancelAnimationFrame(frame));

const notices = computed(() => open("notice"));
const OWN_TABS = ["question", "suggestion"];
const views = computed(() => ({
    chat: {title: "Chat", icon: "chat"},
    feed: {title: "File feed", icon: "edits"},
    terminal: {title: "Terminal", icon: "terminal"},
    waiting: {
        title: "Notifications",
        icon: "bell",
        count: types.value.filter((t) => t.needs_attention && !OWN_TABS.includes(t.name)).flatMap((t) => unreadByUser(t.name)).length,
        warm: true,
    },
    question: {title: "Questions", icon: meta("question").icon, count: open("question").length, warm: true},
    suggestion: {title: "Suggestions", icon: meta("suggestion").icon, count: open("suggestion").length, warm: true},
    todos: {title: "To-dos", icon: meta("todo").icon, count: open("todo").length, warm: false},
}));
const usable = computed(() => VIEWS.filter((v) => v !== "feed" || feedOn.value));
const feedKey = computed(() => (agent.value ? `${agent.value.n}:${agent.value.data.transcript}` : ""));

const {layout, measured, panes, open: docked, apply, resize} = usePaneLayout();
const grid = ref(null);
const offer = ref(null);
const menu = ref(null);

function aim(x, y, grip) {
    const el = grid.value && grid.value.element;
    return el ? aimAt(layout.value, el.getBoundingClientRect(), x, y, grip.from) : null;
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
    return !!pane && !!pane.active && !docked.value.has(asked.view);
};

watch([layout, offer], () => {
    if (offer.value && !offerStands(offer.value)) offer.value = null;
});

function answer(zone) {
    const asked = offer.value;
    offer.value = null;
    if (zone && offerStands(asked)) apply(placed(layout.value, asked.view, asked.id, zone));
}

const free = () => usable.value.find((v) => !docked.value.has(v));

function splitPane(id, zone) {
    const pane = layout.value.panes[id];
    if (!pane) return;
    if (pane.tabs.length > 1) return apply(placed(layout.value, pane.active, id, zone, id));
    if (free()) apply(placed(layout.value, free(), id, zone));
}

const lifted = (key) => (drag.value && drag.value.from === null && drag.value.view === key) || (offer.value && offer.value.view === key);

provide("views", {
    items: computed(() =>
        usable.value.map((key) => ({
            key,
            group: AGENT_VIEWS.includes(key) ? "agent" : "panel",
            title: views.value[key].title,
            icon: views.value[key].icon,
            open: docked.value.has(key),
            lifting: lifted(key),
        }))
    ),
    grab: (e, key) => grab(e, {view: key, from: null, click: () => openView(key)}),
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
const menuOthers = computed(() =>
    menu.value
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
                            :class="['pane-menu-btn', {on: menu && menu.id === id}]"
                            title="Pane menu"
                            @click.stop="toggleMenu($event, id)"
                        >
                            <Icon name="dots" />
                        </button>
                    </PaneTabs>
                    <div :class="['pane-body', pane.active || 'empty']">
                        <SwitchCase :value="pane.active || 'empty'">
                            <template #chat>
                                <TransitionGroup name="act">
                                    <template v-for="x in notices" :key="x.n">
                                        <Notice :notice="x" />
                                    </template>
                                </TransitionGroup>
                                <template v-if="store.detached">
                                    <div class="home-away">
                                        <p>
                                            {{
                                                store.extension.holding
                                                    ? "The chat is following you through the extension."
                                                    : "The chat is floating over this page."
                                            }}
                                        </p>
                                        <Btn @click="detach(false)">Put it back here</Btn>
                                    </div>
                                </template>
                                <template v-else>
                                    <Thread view="chat" />
                                </template>
                            </template>
                            <template #feed>
                                <template v-if="agent">
                                    <FileFeed :key="feedKey" :agent="agent.n" />
                                </template>
                                <template v-else>
                                    <EmptyState title="No agent yet">The file feed shows an agent's edits as it makes them.</EmptyState>
                                </template>
                            </template>
                            <template #terminal><TerminalWindow /></template>
                            <template #waiting><RailWaiting /></template>
                            <template #question><RailWaiting type="question" /></template>
                            <template #suggestion><RailWaiting type="suggestion" /></template>
                            <template #todos><RailTodos /></template>
                            <template #default>
                                <div class="pane-empty">
                                    <p class="pane-empty-title">No views open</p>
                                    <p class="pane-empty-text">Open one here, or drag one in from the icons in the agent bar above.</p>
                                    <div class="pane-empty-views">
                                        <template v-for="key in usable.filter((v) => !docked.has(v))" :key="key">
                                            <Btn @click="apply(placed(layout, key, id, 'center'))">
                                                <Icon :name="views[key].icon" :size="13" />
                                                {{ views[key].title }}
                                            </Btn>
                                        </template>
                                    </div>
                                    <Btn @click="apply(arranged(layout, DEFAULT_SHAPE))">Reset layout</Btn>
                                </div>
                            </template>
                        </SwitchCase>
                        <template v-if="offer && offer.id === id">
                            <SplitOffer :text="offerText(id)" @pick="answer" />
                        </template>
                    </div>
                    <template v-if="aimed && aimed.id === id && state === 'live'">
                        <DropCompass :zone="aimed.zone" />
                    </template>
                </template>
            </PaneGrid>
            <template v-if="menuPane">
                <PaneMenu
                    :pane="menu.id"
                    :anchor="menu.anchor"
                    :title="menuPane.active ? views[menuPane.active].title : ''"
                    :others="menuOthers"
                    :splittable="menuPane.tabs.length > 1 || (menuPane.tabs.length > 0 && !!free())"
                    :closable="leaves(layout.tree).length > 1 || menuPane.tabs.length > 0"
                    @close="menu = null"
                    @split="splitPane"
                    @move="moveTab"
                    @shut="shutPane"
                    @reset="apply(arranged(layout, DEFAULT_SHAPE))"
                />
            </template>
            <template v-if="drag">
                <DragGhost :x="drag.x" :y="drag.y" :icon="views[drag.view].icon" :title="views[drag.view].title" :hint="ghostHint" />
            </template>
        </template>
    </div>
</template>

<style scoped>
.act-enter-active {
    transition:
        opacity 0.24s ease-out,
        transform 0.24s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.act-enter-from {
    opacity: 0;
    transform: translateY(-8px);
}

.act-leave-active {
    transition: opacity 0.18s ease-in;
}

.act-leave-to {
    opacity: 0;
}

.act-move {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

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
    --home-gutter: 24px;
    --rail-gutter: 14px;
    position: relative;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
}

.pane-body > :deep(.thread) {
    padding: 0 var(--home-gutter);
}

.pane-body > :deep(.thread) > :is(.dump, .terminal) {
    margin: 0 calc(-1 * var(--home-gutter));
}

.pane-body:is(.waiting, .question, .suggestion, .todos) {
    overflow-y: auto;
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

.home-away {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--text-3);
}

.home-away p {
    margin: 0;
}
</style>
