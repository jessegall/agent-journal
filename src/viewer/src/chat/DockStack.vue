<script setup>
import {computed, inject, ref} from "vue";
import {useNow} from "../composables/now.js";
import {WINDOW_CONTEXT} from "../windows/windowContext.js";
import {pressButton} from "./markButtons.js";
import ChatDock, {DOCK_ARRIVAL_MS} from "../kit/ChatDock.vue";
import Btn from "../kit/Btn.vue";
import FoldSign from "../kit/FoldSign.vue";
import Icon from "../kit/Icon.vue";
import DockWrapper from "./DockWrapper.vue";
import RunChip from "./RunChip.vue";
import {dockDeclaration} from "../domain/dockRegistry.js";
import {dockFolded} from "../domain/dockFold.js";
import {dockedItems, groupedRuns, isLeaving, isRunItem, keptRuns} from "../domain/dockItems.js";
import {store} from "../state/store.js";
import {rememberedRef} from "../windows/rememberedState.js";

// the items docked at the bottom of the chat, above the composer: a card eases in when it docks and out when it leaves (kit/ChatDock.vue), a leaving item runs a countdown down its top edge, pointing at it holds it,
// and from three runs they share one row, which dissolves into single cards once fewer than two are still going
const props = defineProps({items: {type: Array, required: true}, folded: Boolean, collapsed: Boolean});
const now = useNow(500);
const held = ref(new Set());
const grouped = ref(false);
const opened = ref(false);

const context = inject(WINDOW_CONTEXT);
// a card leaves the moment its close is pressed, and comes back with the reason if the server refuses
const closed = ref(new Set());
const refusals = ref({});

async function undock(item, button) {
    refusals.value = {...refusals.value, [item.id]: ""};
    closed.value = new Set([...closed.value, item.id]);
    const answer = await pressButton(button, {id: item.target_id}, context.environment);
    if (answer?.ok !== false) return;
    closed.value = new Set([...closed.value].filter((id) => id !== item.id));
    refusals.value = {...refusals.value, [item.id]: `Could not dismiss this card: ${answer.error}`};
}

const docked = computed(() =>
    dockedItems(
        props.items.filter((item) => !closed.value.has(item.id)),
        now.value,
        held.value
    )
);
const runs = computed(() =>
    keptRuns(
        docked.value.filter((item) => isRunItem(item, dockDeclaration)),
        now.value
    )
);
const rows = computed(() => docked.value.filter((item) => !runs.value.includes(item) && !isRunItem(item, dockDeclaration)));
const going = computed(() => runs.value.filter((run) => !isLeaving(run)));
const sizeChoice = rememberedRef(`dock-size:${store.identity?.root || location.host}`, null);
const waitsOnPerson = (item) => Boolean(dockDeclaration(item.type)?.needs_user);
// a card that waits on the person, or the only card in the dock, docks open whatever the chat's scroll or the others' size choice says, until the person folds it
const handFolded = ref(new Set());
const alone = computed(() => docked.value.length === 1);
const opensUnfolded = (item) => waitsOnPerson(item) || alone.value;
const collapsedFor = (item) => opensUnfolded(item) ? handFolded.value.has(item.id) : sizeChoice.value ? sizeChoice.value.collapsed && !sizeChoice.value.opened.includes(item.id) : props.collapsed;
const anyCollapsed = computed(() => docked.value.some(collapsedFor));
const shared = computed(() => (grouped.value = groupedRuns(runs.value.length, grouped.value, going.value.length)) && !opened.value && !docked.value.some(collapsedFor));

function changeAll() {
    const folding = !anyCollapsed.value;
    sizeChoice.value = {collapsed: folding, opened: []};
    handFolded.value = new Set(folding ? docked.value.filter(waitsOnPerson).map((item) => item.id) : []);
}

function openCard(item) {
    if (!collapsedFor(item)) return;
    if (opensUnfolded(item)) return void (handFolded.value = new Set([...handFolded.value].filter((id) => id !== item.id)));
    const opened = sizeChoice.value?.collapsed ? sizeChoice.value.opened : [];
    sizeChoice.value = {collapsed: true, opened: [...opened, item.id]};
}

// a card the person folded or unfolded by hand keeps that, the rest follow the chat's scroll
const byHand = rememberedRef(`dock-folded:${store.identity?.root || location.host}`, {});
const foldedFor = (item) =>
    Boolean(dockDeclaration(item.type)?.folds) && dockFolded(byHand.value[item.id], isRunItem(item, dockDeclaration) || props.folded);
function fold(item) {
    byHand.value = {...byHand.value, [item.id]: !foldedFor(item)};
}

// a click on a chip opens that run's card and folds the others
function chooseRun(chosen) {
    byHand.value = {...byHand.value, ...Object.fromEntries(runs.value.map((run) => [run.id, run.id !== chosen.id]))};
    opened.value = true;
}

function foldRuns() {
    byHand.value = Object.fromEntries(Object.entries(byHand.value).filter(([id]) => !runs.value.some((run) => String(run.id) === id)));
    opened.value = false;
}

function hold(item) {
    held.value = new Set([...held.value, item.id]);
}

function release(item) {
    held.value = new Set([...held.value].filter((id) => id !== item.id));
}
</script>

<template>
    <TransitionGroup tag="div" name="dock" :duration="DOCK_ARRIVAL_MS" class="dock-stack">
        <div v-if="docked.length > 1" key="dock-all" class="dock-all">
            <Btn small bordered data-dock-all :aria-label="anyCollapsed ? 'Open all' : 'Collapse all'" @click="changeAll"><FoldSign :open="!anyCollapsed" /></Btn>
        </div>
        <template v-for="item in rows" :key="item.id">
            <DockWrapper
                :item="item"
                :class="{timed: isLeaving(item)}"
                :leaving="isLeaving(item) && !held.has(item.id)"
                :folded="foldedFor(item)"
                :collapsed="collapsedFor(item)"
                :refusal="refusals[item.id]"
                @open="openCard(item)"
                @fold="fold(item)"
                @undock="undock(item, $event)"
                @mouseenter="hold(item)"
                @mouseleave="release(item)"
            />
        </template>
        <template v-if="grouped && opened && !anyCollapsed">
            <div key="runs-head" class="dock-runs-head">
                <span>{{ runs.length }} runs</span>
                <Btn small bordered aria-expanded="true" data-dock-runs-fold @click="foldRuns">
                    Runs
                    <FoldSign open />
                </Btn>
            </div>
        </template>
        <template v-for="item in shared ? [] : runs" :key="item.id">
            <DockWrapper
                :item="item"
                :class="{timed: isLeaving(item)}"
                :leaving="isLeaving(item) && !held.has(item.id)"
                :folded="foldedFor(item)"
                :collapsed="collapsedFor(item)"
                :refusal="refusals[item.id]"
                @open="openCard(item)"
                @fold="fold(item)"
                @undock="undock(item, $event)"
                @mouseenter="hold(item)"
                @mouseleave="release(item)"
            />
        </template>
        <template v-if="shared">
            <ChatDock key="runs-row" :label="`${runs.length} runs`" type="dock-runs-row">
                <template #head>
                    <Icon name="runs" :size="14" />
                    <span class="dock-runs-title">{{ runs.length }} runs</span>
                </template>
                <template #foot>
                    <span class="dock-runs-chips">
                        <template v-for="run in runs" :key="run.id">
                            <RunChip :item="run" @click="chooseRun(run)" />
                        </template>
                    </span>
                    <Btn small bordered aria-expanded="false" data-dock-runs-open @click="opened = true">
                        Runs
                        <FoldSign />
                    </Btn>
                </template>
            </ChatDock>
        </template>
    </TransitionGroup>
</template>

<style scoped>
.dock-all {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    min-height: 28px;
    padding: 0 4px;
    background: var(--raised);
    /* the header stays at the top of the chat's foot while the cards scroll under it */
    position: sticky;
    top: 0;
    z-index: 2;
}

.dock-all :deep([data-dock-all]) {
    border: 0;
    background: none;
}

.dock-stack {
    display: flex;
    flex-direction: column;
    /* clip, not hidden: hidden would make the stack a scroll container and the sticky header would never stick */
    overflow: clip;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}

.dock-stack:empty {
    border: none;
}

.dock-stack > :first-child,
.dock-stack > :first-child :deep(.chat-dock-card) {
    border-top: none;
}

.dock-runs-chips {
    display: flex;
    flex: 1;
    gap: 4px;
    min-width: 0;
}

.dock-runs-head {
    display: flex;
    align-items: center;
    height: 32px;
    justify-content: space-between;
    padding: 0 14px 0 36px;
    border-top: 1px solid var(--border);
    background: var(--raised);
    color: var(--text-3);
    font-size: 12px;
}

.dock-runs-title {
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
}
</style>
