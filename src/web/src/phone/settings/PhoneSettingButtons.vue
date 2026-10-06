<script setup>
import Cell from "../kit/Cell.vue";

defineProps({row: {type: Object, required: true}, tone: {type: String, default: "accent"}});
const emit = defineEmits(["act"]);

function press(button) {
    if (button.href) return window.open(button.href, "_blank");
    emit("act", button.key);
}
</script>

<template>
    <template v-if="!row.buttons.length">
        <Cell :label="row.label" :sub="row.hint" still />
    </template>
    <template v-for="button in row.buttons" :key="button.key">
        <Cell :label="tone === 'danger' ? `${button.label}: ${row.label}` : button.label" :sub="row.hint" :tone="tone" :chevron="false" @pick="press(button)" />
    </template>
</template>
