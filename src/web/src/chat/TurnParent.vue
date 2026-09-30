<script setup>
import BubbleHeader from "../kit/BubbleHeader.vue";

defineProps({label: {type: String, required: true}});
const emit = defineEmits(["open"]);
</script>

<template>
    <BubbleHeader icon="bubble" :label="`Comment on ${label}`" tone="blocking" clickable @click="emit('open')" />
</template>
