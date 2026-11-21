<script setup lang="ts">
/**
 * A record's facts as labelled pairs, each label beside its value, read in order; the caller gives the words.
 */
defineProps<{ facts: { label: string; value: string }[] }>();
</script>

<template>
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-small">
        <template v-for="fact in facts" :key="fact.label">
            <dt class="text-text-3">{{ fact.label }}</dt>
            <dd class="text-text-2 [overflow-wrap:anywhere]">{{ fact.value }}</dd>
        </template>
    </dl>
</template>
