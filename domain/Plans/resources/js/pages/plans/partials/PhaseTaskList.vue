<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { nextTick, ref, useTemplateRef, watch } from 'vue';
import Button from '@kit/Button';
import { onInspectorClosed, useInspectorLink } from '@kit/inspectorLink';
import StateBadge from '@kit/StateBadge';
import type { PhasePages } from '../../../usePhasePages';

/**
 * A phase's tasks in their order, a page at a time, each row's link 'Task 31 · title' opening that task's reader in
 * the inspector by its number, the phase and its cursor staying as they are; closing the reader gives the focus back
 * to that link. A task that waits on others also offers View prerequisites, opening its reader on its waits. Load
 * more appends the next page once and moves the focus to its first row; when the last page brings
 * nothing it says so to its parent, which gives the focus back to the phase's heading. A failed page keeps the rows
 * and offers Retry of the same page.
 */
const props = defineProps<{ pages: PhasePages; phaseName: string }>();
const emit = defineEmits<{ loadMore: []; retry: []; ended: [] }>();

const items = useTemplateRef<HTMLElement[]>('items');
const isWaitingForMore = ref(false);
const inspectorLink = useInspectorLink();
const openedLink = ref<HTMLElement | null>(null);

onInspectorClosed(() => {
    openedLink.value?.focus();
    openedLink.value = null;
});

function remember(event: MouseEvent): void {
    openedLink.value = event.currentTarget as HTMLElement;
}

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
        const first =
            items.value?.[props.pages.firstNewRow]?.querySelector<HTMLElement>(
                'a',
            ) ?? null;

        if (first === null) {
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
                <li ref="items" class="flex flex-wrap items-center gap-2 px-1 py-0.5">
                    <Link
                        :href="inspectorLink('tasks.task', { task: task.number })"
                        preserve-state
                        preserve-scroll
                        class="min-w-0 rounded-control text-text underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text [overflow-wrap:anywhere]"
                        @click="remember"
                        ><span class="font-mono text-small tabular-nums text-text-3"
                            >Task {{ task.number }}</span
                        >
                        · {{ task.title }}</Link
                    >
                    <StateBadge :label="task.stateLabel" outlined />
                    <template v-if="task.hasWaits">
                        <Link
                            :href="
                                inspectorLink('tasks.task', {
                                    task: task.number,
                                    section: 'waits',
                                })
                            "
                            preserve-state
                            preserve-scroll
                            class="text-small text-text-2 underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                            @click="remember"
                            >View prerequisites for task {{ task.number }}</Link
                        >
                    </template>
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
