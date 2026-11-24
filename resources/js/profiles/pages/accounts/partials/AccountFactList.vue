<script setup lang="ts">
/**
 * Facts about an account as names and values side by side, such as its state or a usage window; a fact whose value
 * is more than text, such as a button or a list of links, fills the slot named by its term.
 */
defineProps<{ facts: { term: string; value: string }[] }>();
defineSlots<Record<string, () => unknown>>();
</script>

<template>
    <dl class="grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2">
        <template v-for="fact in facts" :key="fact.term">
            <dt class="text-text-3">{{ fact.term }}</dt>
            <dd class="min-w-0 [overflow-wrap:anywhere] text-text">
                <slot :name="fact.term">{{ fact.value }}</slot>
            </dd>
        </template>
    </dl>
</template>
