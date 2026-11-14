<script setup>
import {computed, ref} from "vue";
import DataTable from "../src/kit/DataTable.vue";
import {peekRef} from "../src/route.js";
import FilterBar from "./FilterBar.vue";
import {applyFilter, defaultFilter} from "./toggleFilter.js";

// rows that arrive as a log: search and the filter bar over the one DataTable. The columns are declared as data ({key, label}), a cell is the
// row's field of that key cut to one line, and a row that names a ref ("output:12") opens that row's inspector.
const props = defineProps({
    columns: {type: Array, required: true},
    rows: {type: Array, required: true},
    fields: {type: Array, default: () => []},
    empty: {type: String, default: "No match"},
    pick: {type: Function, default: null},
    active: {type: [String, Number], default: ""},
});
const value = ref(defaultFilter(props.fields));
const words = ref("");
const shown = computed(() => applyFilter(props.rows, props.fields, value.value, words.value, props.columns.map((column) => column.key)));
const labels = computed(() => props.columns.map((column) => column.label));
const widths = computed(() => (props.columns.some((column) => column.width) ? props.columns.map((column) => column.width ?? "1fr") : []));
// a row with a mark is chosen in place through pick, as the request log shows the chosen request beside its table
const open = (row) => row.ref ?? (props.pick && row.mark !== undefined ? String(row.mark) : "");
const lines = computed(() => shown.value.map((row) => ({cells: props.columns.map((column) => row[column.key] ?? ""), open: open(row), tone: row.tone ?? "", mark: row.mark, active: props.active !== "" && row.mark === props.active})));
const opens = (ref) => (props.pick ? props.pick(ref) : peekRef(ref));
</script>

<template>
    <div class="table-layout" data-table-layout>
        <FilterBar v-model="value" v-model:words="words" :fields="fields" :rows="rows" :shown="shown.length" />
        <div class="table-layout-body">
            <DataTable :columns="labels" :widths="widths" :rows="lines" :empty="empty" @open="opens" />
        </div>
    </div>
</template>

<style scoped>
.table-layout {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
}

.table-layout-body {
    flex: 1;
    overflow-y: auto;
    padding: 0 var(--inset);
}
</style>
