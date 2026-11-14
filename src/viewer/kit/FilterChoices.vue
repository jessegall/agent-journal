<script setup>
import MenuItem from "../src/kit/MenuItem.vue";
import Segmented from "../src/kit/Segmented.vue";
import {countOf} from "./toggleFilter.js";

// the choices of one filter field: is or is not, then each value with how many rows have it
const props = defineProps({field: {type: Object, required: true}, rows: {type: Array, required: true}, modelValue: {type: Object, default: null}});
const emit = defineEmits(["update:modelValue"]);
const WAYS = [
    {key: "is", label: "is"},
    {key: "not", label: "is not"},
];
const entry = () => props.modelValue ?? {not: false, values: []};
const say = (next) => emit("update:modelValue", next.values.length ? next : null);
const way = (key) => say({...entry(), not: key === "not"});
const toggle = (option) => say({...entry(), values: entry().values.includes(option) ? entry().values.filter((value) => value !== option) : [...entry().values, option]});
</script>

<template>
    <div class="filter-ways"><Segmented :options="WAYS" :value="entry().not ? 'not' : 'is'" @pick="way" /></div>
    <template v-for="[option, label] in field.options" :key="option">
        <MenuItem :checked="entry().values.includes(option)" :data-filter-option="option" @click="toggle(option)">{{ label }} <span class="filter-count">{{ countOf(field, rows, option) }}</span></MenuItem>
    </template>
</template>

<style scoped>
.filter-ways {
    padding: 2px 8px 6px;
}

.filter-count {
    margin-left: auto;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}
</style>
