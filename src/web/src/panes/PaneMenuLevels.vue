<script setup>
import PaneMenuBack from "./PaneMenuBack.vue";
import PaneMenuPick from "./PaneMenuPick.vue";

defineProps({levels: {type: Array, required: true}});
const emit = defineEmits(["back", "pick"]);
</script>

<template>
    <PaneMenuBack @click="emit('back')">Detail level</PaneMenuBack>
    <template v-for="l in levels" :key="l.value">
        <PaneMenuPick :icon="l.icon" :label="l.label" :current="l.current" @click="emit('pick', 'verbosity', l.value)" />
    </template>
</template>
