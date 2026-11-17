<script setup lang="ts">
/**
 * A placeholder of the Notes fixture module: it only shows that a module outside app renders through the same flow.
 */
defineProps<{ data: { count: number } }>();
</script>

<template>
    <p>{{ data.count }}</p>
</template>
