<script setup lang="ts">
/**
 * Facts about an account as names and values side by side, such as its state or a usage window.
 */
defineProps<{ facts: { term: string; value: string }[] }>();
</script>

<template>
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
        <template v-for="fact in facts" :key="fact.term">
            <dt class="text-text-3">{{ fact.term }}</dt>
            <dd class="min-w-0 [overflow-wrap:anywhere] text-text">
                {{ fact.value }}
            </dd>
        </template>
    </dl>
</template>
