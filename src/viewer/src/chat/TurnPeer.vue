<script setup>
import BubbleHeader from "../kit/BubbleHeader.vue";

defineProps({label: {type: String, required: true}});
</script>

<template>
    <BubbleHeader icon="agents" :label="label" tone="muted" small />
</template>
