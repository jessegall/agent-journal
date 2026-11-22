<script setup lang="ts">
/**
 * How far some work is, shared by the dock's cards and the pages: done against a known total as a named bar and its
 * words, such as 3 of 8, or with no total only its label, and no invented percentage.
 */
defineProps<{ label: string; completed?: number; total?: number }>();
</script>

<template>
    <template v-if="completed !== undefined && total !== undefined && total > 0">
        <div class="flex items-center gap-2 text-small text-text-3">
            <span
                role="progressbar"
                :aria-label="label"
                :aria-valuenow="completed"
                aria-valuemin="0"
                :aria-valuemax="total"
                :aria-valuetext="`${completed} of ${total}`"
                class="h-1 w-24 overflow-hidden rounded-full bg-bar-track"
            >
                <span
                    class="block h-full bg-progress"
                    :style="{ width: `${(completed / total) * 100}%` }"
                ></span>
            </span>
            <span>{{ completed }} of {{ total }}</span>
        </div>
    </template>
    <template v-else>
        <span role="status" class="text-small text-text-3">{{ label }}</span>
    </template>
</template>
