<script setup lang="ts">
/**
 * The log line a search opened the Logs tab at, marked apart above the entries: its run and line, then its text.
 */
import type { TaskStreamEntryData } from '@generated/types/tasks';

defineProps<{ run: string; entry: TaskStreamEntryData }>();
</script>

<template>
    <section aria-label="Log line found by search" class="flex flex-col gap-0.5 border-l-2 border-brand pl-2">
        <span class="flex flex-wrap gap-x-2 text-small text-text-3">
            <span>Found by search</span>
            <span class="tabular-nums">{{ run }}</span>
        </span>
        <p class="text-body whitespace-pre-wrap text-text-2 [overflow-wrap:anywhere]" v-text="entry.text" />
    </section>
</template>
