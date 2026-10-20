<script setup>
import {ref} from "vue";
import {LOCK_WHY} from "../domain/workflowLocks.js";
import Btn from "../kit/Btn.vue";
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
const over = ref(0);
// the order is changed in a mode of its own, so a stray drag while reading moves nothing
const editing = ref(false);

// a workflow dropped on another takes its place in the run order
function dropOn(row) {
    const from = dragging.value;
    dragging.value = 0;
    over.value = 0;
    if (from && from !== row.id) emit("move", from, row);
}

function ended() {
    dragging.value = 0;
    over.value = 0;
}

// the order moves only while editing, never by a stray drag while reading
function titleOf(row, filtered, editing) {
    if (row.locked) return "Locked: this one always runs here";
    if (!editing) return "Click Change the order to drag it";
    return filtered ? "Pick Every state to drag the order" : "Drag to change the order";
}

// the ghost of the workflow being dragged, shown where it would land
function ghostBefore(row, rows) {
    return dragging.value && over.value === row.id && dragging.value !== row.id ? rows.find((r) => r.id === dragging.value) : null;
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
        <Btn kind="ghost" small class="chart-order-toggle" :class="{on: editing}" @click="editing = !editing">
            {{ editing ? "Done changing the order" : "Change the order" }}
        </Btn>
        <template v-if="!loaded">
            <Skeleton :count="5" label="Loading the workflows" />
        </template>
        <template v-else-if="!rows.length">
            <p class="chart-list-empty">Nothing answers {{ eventTitle.toLowerCase() }} yet.</p>
        </template>
        <template v-for="row in loaded ? rows : []" :key="row.id">
            <template v-if="ghostBefore(row, rows)">
                <div class="chart-row chart-item chart-ghost" aria-hidden="true">
                    <span class="chart-item-place" />
                    <span class="chart-item-words">
                        <span class="chart-row-name">{{ ghostBefore(row, rows).title }}</span>
                    </span>
                </div>
            </template>
            <button
                type="button"
                :class="['chart-row', 'chart-item', row.mark, {on: row.id === current, dragging: dragging === row.id, locked: row.locked}]"
                :aria-current="row.id === current ? 'true' : null"
                :draggable="editing && !row.locked && !stateFilter"
                :title="titleOf(row, Boolean(stateFilter), editing)"
                @dragstart="dragging = row.id"
                @dragend="ended"
                @dragover.prevent="over = row.id"
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
                    <template v-if="row.also.length">
                        <span class="chart-row-sub chart-row-also">also on {{ row.also.join(", ") }}</span>
                    </template>
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

.chart-ghost {
    border: 1px dashed var(--line);
    opacity: 0.55;
    cursor: grabbing;
}

.chart-row-also {
    color: var(--text-3);
    font-size: 11.5px;
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

.chart-order-toggle {
    align-self: flex-start;
    margin: 2px 4px 6px;
}
</style>
