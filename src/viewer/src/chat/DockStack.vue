<script setup>
import {computed, ref} from "vue";
import {useNow} from "../composables/now.js";
import ChatDock, {DOCK_ARRIVAL_MS} from "../kit/ChatDock.vue";
import FoldSign from "../kit/FoldSign.vue";
import MarkIcon from "../kit/MarkIcon.vue";
import DockWrapper from "./DockWrapper.vue";
import RunChip from "./RunChip.vue";
import {dockDeclaration} from "../domain/dockRegistry.js";
import {dockFolded} from "../domain/dockFold.js";
import {dockedItems, groupedRuns, isLeaving, isRunItem, keptRuns} from "../domain/dockItems.js";

// the items docked at the bottom of the chat, above the composer: a card eases in when it docks and out when it leaves (kit/ChatDock.vue), a leaving item runs a countdown down its top edge, pointing at it holds it,
// and from three runs they share one row, which dissolves into single cards once fewer than two are still going
const props = defineProps({items: {type: Array, required: true}, folded: Boolean});
const now = useNow(500);
const held = ref(new Set());
const grouped = ref(false);
const opened = ref(false);

const docked = computed(() => dockedItems(props.items, now.value, held.value));
const runs = computed(() => keptRuns(docked.value.filter((item) => isRunItem(item, dockDeclaration)), now.value));
const rows = computed(() => docked.value.filter((item) => !runs.value.includes(item) && !isRunItem(item, dockDeclaration)));
const going = computed(() => runs.value.filter((run) => !isLeaving(run)));
const shared = computed(() => (grouped.value = groupedRuns(runs.value.length, grouped.value, going.value.length)) && !opened.value);

// a card the person folded or unfolded by hand keeps that, the rest follow the chat's scroll
const byHand = ref({});
const foldedFor = (item) => dockFolded(byHand.value[item.id], props.folded);
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
        <template v-for="item in rows" :key="item.id">
            <DockWrapper :item="item" :class="{timed: isLeaving(item)}" :leaving="isLeaving(item) && !held.has(item.id)" :folded="foldedFor(item)" @fold="fold(item)" @mouseenter="hold(item)" @mouseleave="release(item)" />
        </template>
        <template v-if="grouped && opened">
            <div key="runs-head" class="dock-runs-head">
                <button type="button" class="dock-runs-toggle" aria-expanded="true" title="Fold the runs into one line" data-dock-runs-fold @click="foldRuns">{{ runs.length }} runs <FoldSign open /></button>
            </div>
        </template>
        <template v-for="item in shared ? [] : runs" :key="item.id">
            <DockWrapper :item="item" :class="{timed: isLeaving(item)}" :leaving="isLeaving(item) && !held.has(item.id)" :folded="foldedFor(item)" @fold="fold(item)" @mouseenter="hold(item)" @mouseleave="release(item)" />
        </template>
        <template v-if="shared">
            <ChatDock key="runs-row" :label="`${runs.length} runs`" kind="dock-runs-row">
                <template #head>
                    <button type="button" class="dock-runs-toggle" aria-expanded="false" title="Show each run as its own card" data-dock-runs-open @click="opened = true"><MarkIcon name="runs" /> {{ runs.length }} runs <FoldSign /></button>
                    <span class="dock-runs-chips">
                        <template v-for="run in runs" :key="run.id">
                            <RunChip :item="run" @click="chooseRun(run)" />
                        </template>
                    </span>
                </template>
            </ChatDock>
        </template>
    </TransitionGroup>
</template>

<style scoped>
.dock-stack {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.dock-runs-toggle {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
}

.dock-runs-toggle :deep(.mark-icon) {
    color: var(--text-3);
}

.dock-runs-chips {
    display: flex;
    flex: 1;
    gap: 4px;
    min-width: 0;
    margin-left: 10px;
}

.dock-runs-head {
    display: flex;
    align-items: center;
    height: 20px;
    margin-bottom: -2px;
}

.dock-runs-head .dock-runs-toggle {
    padding: 0 4px;
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
