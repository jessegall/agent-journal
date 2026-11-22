<script setup lang="ts">
/**
 * A line above a plain form or a sequence editor that names the agent that drafted the fields below, so the person
 * knows they are a draft to read and edit, not a saved record.
 */
defineProps<{ agent: string }>();
</script>

<template>
    <p
        role="status"
        class="rounded-card border border-line bg-sel px-3 py-2 text-small text-text-2"
    >
        Drafted by {{ agent }}. Nothing is saved until you submit.
    </p>
</template>
