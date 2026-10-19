<script setup>
import DropList from "../kit/DropList.vue";
import Skeleton from "../kit/Skeleton.vue";

defineProps({
    loaded: {type: Boolean, required: true},
    rows: {type: Array, required: true},
    picked: {type: String, required: true},
    addable: {type: Array, required: true},
});
const emit = defineEmits(["pick"]);

// an event's mark: failed, off, answered by a workflow, or answered by none
function markOf(row) {
    if (row.failed) return "failed";
    if (row.off) return "off";
    return row.count ? "default" : "none";
}
</script>

<template>
    <aside class="chart-col chart-events" aria-label="Event">
        <h2 class="chart-col-head">Event</h2>
        <template v-if="!loaded">
            <Skeleton :count="8" label="Loading the events" />
        </template>
        <template v-for="row in loaded ? rows : []" :key="row.key">
            <button
                type="button"
                :class="['chart-row', 'chart-event', {on: row.key === picked, none: !row.count}]"
                :aria-current="row.key === picked ? 'true' : null"
                @click="emit('pick', row.key)"
            >
                <span :class="['chart-mark', markOf(row)]" aria-hidden="true" />
                <span class="chart-row-name">{{ row.title }}</span>
                <template v-if="row.count">
                    <span class="chart-row-words">{{ row.count }}</span>
                </template>
                <template v-else-if="row.claudeOnly">
                    <span class="chart-row-words">Claude only</span>
                </template>
            </button>
        </template>
        <DropList
            class="chart-add-event"
            label="Add an event"
            icon="plus"
            :items="addable"
            :menu-width="300"
            searchable
            @pick="emit('pick', $event.key)"
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

.chart-events {
    width: 268px;
    background: color-mix(in oklab, var(--bg-2) 60%, var(--bg));
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

.chart-event {
    align-items: center;
    min-height: 32px;
    padding-top: 0;
    padding-bottom: 0;
}

.chart-event.none .chart-row-name {
    color: var(--text-3);
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

.chart-mark.default::before {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-2);
}

.chart-mark.off::before {
    width: 8px;
    height: 8px;
    border: 1.5px solid var(--text-2);
    border-radius: 50%;
}

.chart-mark.off::after {
    width: 1.5px;
    height: 11px;
    background: var(--text-2);
    transform: rotate(45deg);
}

.chart-mark.failed::before {
    width: 8px;
    height: 8px;
    border: 2px solid var(--danger-soft);
    border-radius: 50%;
}

.chart-mark.none::before {
    width: 6px;
    height: 2px;
    border-radius: 1px;
    background: var(--text-3);
}

.chart-add-event {
    margin-top: 8px;
}
</style>
