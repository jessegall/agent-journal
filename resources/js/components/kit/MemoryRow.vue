<script setup lang="ts">
/**
 * One memory: its weight and its text, with its detail (where it came from, its keywords, how it fades) shown at once
 * or, in an expandable row, behind a button. A MemoryList moves between the buttons with Up and Down. Measures:
 * docs/designs/kit-components.md.
 */
defineProps<{ weight: number; text: string; detail?: string; expandable?: boolean }>();

const expanded = defineModel<boolean>('expanded', { default: false });
</script>

<template>
    <li class="border-b border-line">
        <button
            v-if="expandable"
            type="button"
            data-memory-row
            :aria-expanded="expanded"
            class="grid w-full grid-cols-[calc(var(--spacing)*4.5)_1fr] gap-x-2.5 px-3.5 py-2.25 text-left text-small transition-colors duration-(--duration-hover) hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
            @click="expanded = !expanded"
        >
            <span class="text-text-3 tabular-nums">{{ weight }}</span>
            <span class="min-w-0 text-text-2 [overflow-wrap:anywhere]">{{ text }}</span>
            <span v-if="expanded && detail" class="col-start-2 mt-1 text-badge text-text-3">{{ detail }}</span>
        </button>
        <div v-else class="grid grid-cols-[calc(var(--spacing)*4.5)_1fr] gap-x-2.5 px-3.5 py-2.25 text-small">
            <span class="text-text-3 tabular-nums">{{ weight }}</span>
            <span class="min-w-0 text-text-2 [overflow-wrap:anywhere]">{{ text }}</span>
            <span v-if="detail" class="col-start-2 mt-1 text-badge text-text-3">{{ detail }}</span>
        </div>
    </li>
</template>
