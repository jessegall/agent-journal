<script setup>
import {computed} from "vue";
import PaneMenuInner from "./PaneMenuInner.vue";

const props = defineProps({option: {type: Object, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);

const isChosen = (preset) => Object.entries(preset.options).every(([key, shown]) => (props.values[key] ?? true) === shown);
const items = computed(() => props.option.presets.map((preset) => ({value: preset.key, label: preset.label, chosen: isChosen(preset), preset})));

function choose(item) {
    Object.entries(item.preset.options).forEach(([key, shown]) => emit("set", key, shown));
}
</script>

<template>
    <PaneMenuInner :option-key="option.key" :label="option.label" :items="items" @pick="choose" />
</template>
