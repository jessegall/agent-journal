<script setup>
import {computed} from "vue";

const props = defineProps({columns: {type: Array, required: true}, rows: {type: Array, required: true}});
const emit = defineEmits(["open"]);
const grid = computed(() => ({gridTemplateColumns: `2fr repeat(${Math.max(0, props.columns.length - 1)}, 1fr)`}));
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
                :type="row.open ? 'button' : undefined"
                :class="['table-row', row.tone, {opens: row.open}]"
                :style="grid"
                @click="row.open && emit('open', row.open)"
            >
                <template v-for="(cell, column) in row.cells" :key="column">
                    <span class="cell">{{ cell }}</span>
                </template>
            </component>
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

.table-row.opens {
    cursor: pointer;
}

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
