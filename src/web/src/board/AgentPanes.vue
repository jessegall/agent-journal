<script setup>
import {computed, ref} from "vue";
import DragGhost from "../kit/DragGhost.vue";
import DropCompass from "../kit/DropCompass.vue";
import {usePaneDrag} from "../composables/paneDrag.js";
import Icon from "../kit/Icon.vue";
import EmptyState from "../kit/EmptyState.vue";
import PaneGrid from "../kit/PaneGrid.vue";
import PaneTabs from "../kit/PaneTabs.vue";
import PaneMenu from "../pages/PaneMenu.vue";
import {useInspectorLayout} from "../composables/paneLayout.js";
import {
    INSPECTOR_SHAPE,
    activated,
    aimAt,
    arranged,
    leaves,
    ordered,
    paneClosed,
    placed,
    tabClosed,
    tuned,
    widthOf,
} from "../domain/panes.js";
import {levelChoices} from "../domain/verbosity.js";
import {narrow} from "../platform/view.js";

const props = defineProps({
    views: {type: Object, required: true},
    available: {type: Array, required: true},
    flushable: {type: Array, default: () => []},
});
const {layout, measured, panes, open: opened, apply, replace, resize} = useInspectorLayout();

const has = (key) => props.available.includes(key);
const shownTabs = (pane) => pane.tabs.filter(has);
const activeOf = (pane) => (has(pane.active) ? pane.active : shownTabs(pane)[0] || "");
const pick = (id, key) => apply(activated(layout.value, id, key));
const tune = (id, patch) => replace(tuned(layout.value, id, patch));

const grid = ref(null);
function tabSpot(x, y) {
    const row = document.elementFromPoint(x, y)?.closest("[data-inspector-tabs]");
    if (!row) return null;
    const tabs = [...row.querySelectorAll("[data-tab]")];
    const at = tabs.findIndex((t) => {
        const r = t.getBoundingClientRect();
        return x < r.left + r.width / 2;
    });
    return {id: Number(row.dataset.inspectorTabs), zone: "tabs", before: at < 0 ? null : tabs[at].dataset.tab};
}

function aim(x, y, grip) {
    const el = grid.value && grid.value.element;
    if (!el) return null;
    return tabSpot(x, y) || aimAt(layout.value, el.getBoundingClientRect(), x, y, grip.from);
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
    apply(placed(layout.value, grip.view, target.id, target.zone, grip.from));
}

const {drag, grab} = usePaneDrag(aim, land);
const grabTab = (e, id, key) => grab(e, {view: key, from: id, click: () => pick(id, key)});
const aimed = computed(() => (drag.value && drag.value.target) || null);
const SIDES = {left: "left", right: "right", top: "above", bottom: "below"};
const ghostHint = computed(() => {
    const target = aimed.value;
    if (!target) return "";
    if (target.zone === "tabs") return drag.value.from === target.id ? "Move here" : "Add as tab here";
    return target.zone === "center" ? "Add as tab" : `Split ${SIDES[target.zone]}`;
});
const tabsOf = (id, pane) =>
    shownTabs(pane).map((key) => ({
        key,
        title: props.views[key].title,
        icon: props.views[key].icon,
        on: key === activeOf(pane),
        lifting: !!drag.value && drag.value.from === id && drag.value.view === key,
    }));
const firstChat = (p) => (p.pane && shownTabs(p.pane).includes("chat") ? 0 : 1);

const menu = ref(null);
const menuPane = computed(() => menu.value && layout.value.panes[menu.value.id]);
const toggleMenu = (e, id) => (menu.value = menu.value && menu.value.id === id ? null : {id, anchor: e.currentTarget});
const menuTitle = computed(() => (menuPane.value && activeOf(menuPane.value) ? props.views[activeOf(menuPane.value)].title : ""));
const others = computed(() =>
    menuPane.value
        ? leaves(layout.value.tree)
              .filter((id) => id !== menu.value.id)
              .map((id) => {
                  const pane = layout.value.panes[id];
                  const shown = shownTabs(pane);
                  return {
                      id,
                      label: shown.map((key) => props.views[key].title).join(", ") || "Empty pane",
                      icon: shown.length ? props.views[activeOf(pane)].icon : "panel",
                  };
              })
        : []
);
const unopened = () => props.available.find((v) => !opened.value.has(v));

function splitPane(id, zone) {
    const pane = layout.value.panes[id];
    if (!pane) return;
    if (shownTabs(pane).length > 1) return apply(placed(layout.value, activeOf(pane), id, zone, id));
    if (unopened()) apply(placed(layout.value, unopened(), id, zone));
}

function moveTab(from, to) {
    const pane = layout.value.panes[from];
    if (pane && activeOf(pane) && layout.value.panes[to]) apply(placed(layout.value, activeOf(pane), to, "center", from));
}

const shape = (next) => apply(arranged(layout.value, next));
defineExpose({shape, layout});
</script>

<template>
    <div class="agent-panes">
        <PaneGrid ref="grid" :panes="panes" :splits="measured.splits" :stacked="narrow" :rank="firstChat" @resize="resize">
            <template #pane="{id, pane, state}">
                <PaneTabs
                    :tabs="tabsOf(id, pane)"
                    :data-inspector-tabs="id"
                    @grab="(e, key) => grabTab(e, id, key)"
                    @pick="(key) => pick(id, key)"
                    @close="(key) => apply(tabClosed(layout, id, key))"
                >
                    <span class="agent-pane-menu">
                        <button
                            type="button"
                            :class="['agent-pane-menu-btn', {on: menu && menu.id === id}]"
                            title="Pane menu"
                            @click.stop="toggleMenu($event, id)"
                        >
                            <Icon name="dots" />
                        </button>
                    </span>
                </PaneTabs>
                <div :class="['agent-pane-body', widthOf(pane)]">
                    <template v-if="activeOf(pane)">
                        <slot name="view" :view="activeOf(pane)" :pane="pane" :id="id" :tune="(patch) => tune(id, patch)" />
                    </template>
                    <template v-else>
                        <EmptyState title="Nothing for this agent here">
                            This pane holds views this agent does not have. Pick a preset or close the pane.
                        </EmptyState>
                    </template>
                </div>
                <template v-if="aimed && aimed.id === id && aimed.zone !== 'tabs' && state === 'live'">
                    <DropCompass :zone="aimed.zone" />
                </template>
            </template>
        </PaneGrid>
        <template v-if="drag">
            <DragGhost :x="drag.x" :y="drag.y" :icon="views[drag.view].icon" :title="views[drag.view].title" :hint="ghostHint" />
        </template>
        <template v-if="menuPane">
            <PaneMenu
                :pane="menu.id"
                :anchor="menu.anchor"
                :title="menuTitle"
                :width="widthOf(menuPane)"
                :levels="activeOf(menuPane) === 'terminal' ? levelChoices(menuPane) : []"
                :others="others"
                :floats="false"
                :flushable="flushable.includes(activeOf(menuPane))"
                :flush="!!menuPane.flush"
                :splittable="shownTabs(menuPane).length > 1 || !!unopened()"
                :closable="leaves(layout.tree).length > 1 || menuPane.tabs.length > 0"
                @close="menu = null"
                @split="splitPane"
                @move="moveTab"
                @shut="(id) => apply(paneClosed(layout, id))"
                @reset="shape(INSPECTOR_SHAPE)"
                @width="(id, width) => replace(tuned(layout, id, {width}))"
                @flush="(id, flush) => replace(tuned(layout, id, {flush}))"
                @verbosity="(id, verbosity) => replace(tuned(layout, id, {verbosity}))"
            />
        </template>
    </div>
</template>

<style scoped>
.agent-panes {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.agent-pane-menu {
    display: flex;
    align-items: center;
    margin-left: auto;
    padding-right: 4px;
}

.agent-pane-menu-btn {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.agent-pane-menu-btn:hover,
.agent-pane-menu-btn.on {
    background: var(--hover);
    color: var(--text);
}

.agent-pane-body {
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

.agent-pane-body.contained > * {
    width: min(100%, 760px);
    margin: 0 auto;
}
</style>
