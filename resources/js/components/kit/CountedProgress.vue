<script setup lang="ts">
import { computed } from 'vue';

/**
 * A counted progress: a bar labelled Tasks finished, named for whose progress it is, filled by the
 * finished share of the total, and the caller's words for the counts beside it, which are also the bar's spoken
 * value. With no total there is no bar and no percentage, only the words.
 */
const props = defineProps<{
    owner: string;
    finished: number;
    total: number;
    text: string;
}>();

const percent = computed(() =>
    props.total === 0 ? 0 : (props.finished / props.total) * 100,
);
</script>

<template>
    <div class="flex flex-col gap-1">
        <template v-if="total > 0">
            <div
                role="progressbar"
                :aria-label="`Tasks finished, ${owner}`"
                aria-valuemin="0"
                :aria-valuemax="total"
                :aria-valuenow="finished"
                :aria-valuetext="text"
                class="h-1 overflow-hidden rounded-full bg-bar-track"
            >
                <span
                    class="block h-full bg-brand"
                    :style="{ width: `${percent}%` }"
                />
            </div>
        </template>
        <span class="text-small text-text-3 tabular-nums">{{ text }}</span>
    </div>
</template>
