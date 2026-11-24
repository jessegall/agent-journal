<script setup lang="ts">
/**
 * A page's title with an optional count, and its buttons at the right end.
 */
defineProps<{ title: string; count?: number }>();
</script>

<template>
    <header class="flex items-center gap-3 px-4 pt-3.5 pb-3">
        <h1 class="text-title font-semibold text-text">{{ title }}</h1>
        <template v-if="count !== undefined">
            <span class="text-field text-text-3 tabular-nums">{{ count }}</span>
        </template>
        <div class="ml-auto flex items-center gap-2">
            <slot name="actions" />
        </div>
    </header>
</template>
