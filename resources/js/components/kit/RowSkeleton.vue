<script setup lang="ts">
/**
 * What a list shows while its first read is pending: placeholder rows with the height and padding of a ListRow, in the
 * selection colour, three by default. The wrapper is aria-busy and one status line carries the label, so a screen
 * reader hears it once. The rows are still under reduced motion.
 */
withDefaults(defineProps<{ rows?: number; label: string; busy?: boolean }>(), { rows: 3, busy: true });
</script>

<template>
    <div :aria-busy="busy">
        <p role="status" class="sr-only">{{ busy ? label : '' }}</p>
        <template v-for="row in rows" :key="row">
            <div aria-hidden="true" class="flex items-center gap-2.5 border-b border-line px-3 py-[7px]">
                <span class="h-3.5 w-10 shrink-0 rounded-button bg-sel motion-safe:animate-pulse"></span>
                <span class="h-3.5 flex-1 rounded-button bg-sel motion-safe:animate-pulse"></span>
                <span class="h-3.5 w-16 shrink-0 rounded-button bg-sel motion-safe:animate-pulse"></span>
            </div>
        </template>
    </div>
</template>
