<script setup lang="ts">
/**
 * A placeholder of the Notes fixture module: it only shows that a module outside app renders through the same flow.
 */
defineProps<{ data: { texts: string[] } }>();
</script>

<template>
    <ul><li v-for="text in data.texts" :key="text">{{ text }}</li></ul>
</template>
