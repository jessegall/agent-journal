<script setup>
import {computed} from "vue";
import {MARK_ICONS} from "./markIcons.js";

// One of the chat marks' own icons by its name, a dot for a name it does not know
const props = defineProps({name: {type: String, required: true}});
const shape = computed(() => MARK_ICONS[props.name] || MARK_ICONS.dot);
</script>

<template>
    <svg class="mark-icon" viewBox="0 0 16 16" aria-hidden="true" v-html="shape" />
</template>

<style scoped>
.mark-icon {
    flex: none;
    width: 13px;
    height: 13px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.4;
    stroke-linecap: round;
    stroke-linejoin: round;
}

.mark-icon :deep(.f) {
    fill: currentColor;
    stroke: none;
}
</style>
