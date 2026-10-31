<script setup>
import EmptyState from "../kit/EmptyState.vue";

defineProps({name: {type: String, required: true}, reason: {type: String, required: true}});
</script>

<template>
    <EmptyState class="window-placeholder" :title="name">{{ reason }}</EmptyState>
</template>
