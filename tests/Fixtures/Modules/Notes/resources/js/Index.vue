<script setup lang="ts">
/**
 * A placeholder of the Notes fixture module: it only shows that a module outside app renders through the same flow.
 */
defineProps<{ data: { texts: string[] } }>();
</script>

<template>
    <ul>
        <template v-for="text in data.texts" :key="text">
            <li>{{ text }}</li>
        </template>
    </ul>
</template>
