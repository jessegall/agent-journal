<script setup>
import {computed} from "vue";
import PaneMenuInner from "./PaneMenuInner.vue";

const props = defineProps({option: {type: Object, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);

const chosen = () => props.values[props.option.key] ?? props.option.default;
const items = computed(() => props.option.choices.map(([value, label]) => ({value, label, chosen: chosen() === value})));
</script>

<template>
    <PaneMenuInner :option-key="option.key" :label="option.label" :items="items" @pick="(item) => emit('set', option.key, item.value)" />
</template>
