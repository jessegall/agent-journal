<script setup>
import PaneMenuChoice from "./PaneMenuChoice.vue";
import PaneMenuMainOnly from "./PaneMenuMainOnly.vue";
import PaneMenuPreset from "./PaneMenuPreset.vue";
import PaneMenuToggle from "./PaneMenuToggle.vue";

const CONTROLS = {toggle: PaneMenuToggle, main: PaneMenuMainOnly, preset: PaneMenuPreset, choice: PaneMenuChoice};

defineProps({declared: {type: Array, required: true}, values: {type: Object, default: () => ({})}});
const emit = defineEmits(["set"]);
</script>

<template>
    <template v-for="option in declared" :key="option.key">
        <component :is="CONTROLS[option.control]" :option="option" :values="values" @set="(key, value) => emit('set', key, value)" />
    </template>
</template>
