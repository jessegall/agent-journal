<script setup lang="ts">
/**
 * A placeholder of the Notes fixture module: it only shows that a module outside app renders through the same flow.
 */
defineProps<{ data: { collection: string; texts: string[] } }>();
</script>

<template>
    <section><h2>{{ data.collection }}</h2></section>
</template>
