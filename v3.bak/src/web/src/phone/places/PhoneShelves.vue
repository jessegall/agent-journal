<script setup>
import {computed} from "vue";
import Chips from "../kit/Chips.vue";
import {LOOSE, onShelf} from "./shelves.js";

const props = defineProps({
    docs: {type: Array, required: true},
    collections: {type: Array, required: true},
    shelf: {type: String, default: ""},
});
const emit = defineEmits(["pick"]);
const shelves = computed(() => [
    {key: "", label: "All", count: props.docs.length},
    ...props.collections.map((one) => ({key: one.ref, label: one.title, count: one.holds.length})),
    {key: LOOSE, label: "Not in a collection", count: props.docs.filter(onShelf(LOOSE, props.collections)).length},
]);
</script>

<template>
    <Chips :options="shelves" :value="shelf" label="Collections" @pick="emit('pick', $event)" />
</template>
