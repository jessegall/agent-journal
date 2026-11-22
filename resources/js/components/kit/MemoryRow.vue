<script setup lang="ts">
/**
 * One memory: a grid of the weight (18 wide, tabular) and the text, padding 9 14 and a --line rule below. An
 * expandable row is a button with aria-expanded that shows its detail (where it came from, its keywords, how it
 * fades) under the text; hover takes --hover and the ring sits inside at offset -2. A row that is not expandable shows
 * its detail at once. A MemoryList moves between the buttons with Up and Down.
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
