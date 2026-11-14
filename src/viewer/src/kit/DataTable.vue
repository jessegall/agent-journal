<script setup>
import {computed} from "vue";
import {copying, short} from "../domain/contextItems.js";
import {vContext} from "../../kit/vContext.js";

const props = defineProps({columns: {type: Array, required: true}, rows: {type: Array, required: true}, empty: {type: String, default: ""}, widths: {type: Array, default: () => []}});
const emit = defineEmits(["open"]);
// a table that names its column widths gets them; otherwise the first column takes twice the room of the others
const grid = computed(() => ({gridTemplateColumns: props.widths.length ? props.widths.join(" ") : `2fr repeat(${Math.max(0, props.columns.length - 1)}, 1fr)`}));
// the menu of a right click on a row: open it where it opens, copy its first cell (its number) or the whole row
const place = (row) => {
    const line = row.cells.join(" ").replace(/\s+/g, " ").trim();
    return {
        head: short(line, 40),
        items: [
            {label: "Open", group: "open", disabled: !row.open, reason: "Nothing to open", run: () => emit("open", row.open)},
            {label: "Copy number", group: "copy", run: ({say}) => copying(String(row.cells[0] ?? ""), "", say)},
            {label: "Copy line", group: "copy", run: ({say}) => copying(line, "the line", say)},
        ],
    };
};
</script>

<template>
    <div class="table">
        <div class="table-row head" :style="grid">
            <template v-for="column in columns" :key="column">
                <span class="cell">{{ column }}</span>
            </template>
        </div>
        <template v-for="(row, at) in rows" :key="at">
            <component
                :is="row.open ? 'button' : 'div'"
                v-context="() => place(row)"
                :type="row.open ? 'button' : undefined"
                :class="['table-row', row.tone, {opens: row.open, active: row.active}]"
                :style="grid"
                :data-table-row="row.mark"
                @click="row.open && emit('open', row.open)"
            >
                <template v-for="(cell, column) in row.cells" :key="column">
                    <span class="cell">{{ cell }}</span>
                </template>
            </component>
        </template>
        <template v-if="!rows.length && empty">
            <div class="table-row empty">{{ empty }}</div>
        </template>
    </div>
</template>

<style scoped>
.table {
    display: flex;
    flex-direction: column;
}

.table-row {
    display: grid;
    gap: 12px;
    padding: 6px 8px;
    border: 0;
    border-bottom: 1px solid var(--line);
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 13px;
    text-align: left;
}

.table-row.head {
    color: var(--text-3);
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.table-row.empty {
    display: block;
    color: var(--text-3);
}

.table-row.opens {
    cursor: pointer;
}

.table-row.active,
.table-row.opens:hover {
    background: var(--hover);
}

.danger {
    color: var(--tone-danger);
}

.warn {
    color: var(--tone-warn);
}

.cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
