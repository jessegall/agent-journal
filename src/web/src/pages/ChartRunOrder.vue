<script setup>
import {ref} from "vue";
import {LOCK_WHY} from "../domain/workflowLocks.js";
import DropList from "../kit/DropList.vue";
import Icon from "../kit/Icon.vue";
import Skeleton from "../kit/Skeleton.vue";

defineProps({
    loaded: {type: Boolean, required: true},
    rows: {type: Array, required: true},
    current: {type: Number, required: true},
    eventTitle: {type: String, required: true},
    filterLabel: {type: String, required: true},
    filterItems: {type: Array, required: true},
    stateFilter: {type: String, required: true},
    newItems: {type: Array, required: true},
});
const emit = defineEmits(["filter", "pick", "move", "start"]);
const dragging = ref(0);

// a workflow dropped on another takes its place in the run order
function dropOn(row) {
    const from = dragging.value;
    dragging.value = 0;
    if (from && from !== row.id) emit("move", from, row);
}

function titleOf(row, filtered) {
    if (row.locked) return "Locked: this one always runs here";
    return filtered ? "Pick Every state to drag the order" : "Drag to change the order";
}
</script>

<template>
    <aside class="chart-col chart-list" aria-label="Workflows, in the order they run">
        <div class="chart-col-top">
            <h2 class="chart-col-head">Run order</h2>
            <DropList
                :label="filterLabel"
                :items="filterItems"
                :picked="stateFilter"
                :menu-width="220"
                @pick="emit('filter', $event.key)"
            />
        </div>
        <template v-if="!loaded">
            <Skeleton :count="5" label="Loading the workflows" />
        </template>
        <template v-else-if="!rows.length">
            <p class="chart-list-empty">Nothing answers {{ eventTitle.toLowerCase() }} yet.</p>
        </template>
        <template v-for="row in loaded ? rows : []" :key="row.id">
            <button
                type="button"
                :class="['chart-row', 'chart-item', row.mark, {on: row.id === current, dragging: dragging === row.id, locked: row.locked}]"
                :aria-current="row.id === current ? 'true' : null"
                :draggable="!row.locked && !stateFilter"
                :title="titleOf(row, Boolean(stateFilter))"
                @dragstart="dragging = row.id"
                @dragend="dragging = 0"
                @dragover.prevent
                @drop.prevent="dropOn(row)"
                @click="emit('pick', row.id)"
            >
                <span class="chart-item-place">{{ row.place }}</span>
                <template v-if="row.locked">
                    <Icon name="lock" :size="11" class="chart-item-lock" :title="LOCK_WHY" />
                </template>
                <span class="chart-item-words">
                    <span class="chart-row-name">{{ row.title }}</span>
                    <span class="chart-row-sub">
                        {{ row.who }}
                        <template v-if="row.words">· {{ row.words }}</template>
                    </span>
                </span>
                <span :class="['chart-mark', row.mark]" aria-hidden="true" />
            </button>
        </template>
        <DropList
            class="chart-add-event"
            label="New workflow"
            icon="plus"
            :items="newItems"
            :menu-width="260"
            @pick="emit('start', $event.key)"
        />
    </aside>
</template>

<style scoped>
.chart-col {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 1px;
    padding: 12px 8px;
    overflow: auto;
    border-right: 1px solid var(--line);
}

.chart-list {
    width: 272px;
}

.chart-col-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-right: 4px;
}

.chart-col-top .chart-col-head {
    margin: 0;
}

.chart-list-empty {
    margin: 8px 10px;
    color: var(--text-3);
    font-size: 12.5px;
}

.chart-item {
    align-items: center;
    gap: 10px;
    cursor: grab;
}

.chart-item[draggable="false"] {
    cursor: pointer;
}

.chart-item.dragging {
    opacity: 0.5;
}

.chart-item-place {
    flex: none;
    width: 18px;
    color: var(--text-3);
    font-size: 11.5px;
    text-align: right;
}

.chart-item-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.chart-col-head {
    margin: 0 0 8px;
    padding: 0 10px;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
}

.chart-row {
    display: flex;
    gap: 6px;
    width: 100%;
    padding: 8px 10px;
    border: 0;
    border-left: 2px solid transparent;
    border-radius: 7px;
    background: none;
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.chart-row:hover {
    background: var(--hover);
}

.chart-row.on {
    border-left-color: var(--accent-text);
    background: var(--sel);
}

.chart-row-name {
    display: flex;
    flex: 1;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow: hidden;
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.chart-mark {
    position: relative;
    display: inline-block;
    flex: none;
    width: 10px;
    height: 10px;
}

.chart-mark::before,
.chart-mark::after {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
}

.chart-add-event {
    margin-top: 8px;
}
</style>
