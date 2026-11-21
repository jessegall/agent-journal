<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue';
import Button from '@kit/Button';
import StateBadge from '@kit/StateBadge';
import type { PhasePages } from './usePhasePages';

/**
 * A phase's tasks in their order, a page at a time: Load more appends the next page once and moves the focus to its
 * first row; when the last page brings nothing it says so to its parent, which gives the focus back to the phase's
 * heading. A failed page keeps the rows and offers Retry of the same page.
 */
const props = defineProps<{ pages: PhasePages; phaseName: string }>();
const emit = defineEmits<{ loadMore: []; retry: []; ended: [] }>();

const items = useTemplateRef<HTMLElement[]>('items');
const isWaitingForMore = ref(false);

function askMore(): void {
    isWaitingForMore.value = true;
    emit('loadMore');
}

watch(
    () => [props.pages.status, props.pages.rows.length] as const,
    async ([status]) => {
        if (!isWaitingForMore.value || status !== 'shown') {
            return;
        }

        isWaitingForMore.value = false;
        await nextTick();
        const first = items.value?.[props.pages.firstNewRow];

        if (first === undefined) {
            emit('ended');

            return;
        }

        first.focus();
    },
);
</script>

<template>
    <div class="flex flex-col gap-1">
        <template v-if="pages.rows.length === 0 && pages.status === 'shown'">
            <p class="text-small text-text-3">This phase has no tasks yet.</p>
        </template>
        <ol class="flex flex-col gap-1" :aria-label="`Tasks of ${phaseName}`">
            <template v-for="task in pages.rows" :key="task.number">
                <li
                    ref="items"
                    tabindex="-1"
                    class="flex flex-wrap items-center gap-2 rounded-control px-1 py-0.5 outline-none focus-visible:outline-2 focus-visible:outline-text"
                >
                    <span class="font-mono text-small tabular-nums text-text-3"
                        >Task {{ task.number }}</span
                    >
                    <span class="[overflow-wrap:anywhere]">{{ task.title }}</span>
                    <StateBadge :label="task.stateLabel" outlined />
                </li>
            </template>
        </ol>
        <template v-if="pages.status === 'failed'">
            <p role="alert" class="flex items-center gap-2 text-small text-text-2">
                <span>These tasks could not be read.</span>
                <Button size="small" variant="bordered" @click="emit('retry')"
                    >Retry</Button
                >
            </p>
        </template>
        <template v-else-if="pages.nextAfter !== undefined">
            <div>
                <Button
                    size="small"
                    variant="bordered"
                    :pending="pages.status === 'loading'"
                    @click="askMore"
                    >Load more</Button
                >
            </div>
        </template>
    </div>
</template>
