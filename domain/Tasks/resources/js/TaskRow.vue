<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import ActionsMenu from '@kit/ActionsMenu';
import ActionsMenuItem from '@kit/ActionsMenuItem';
import Icon from '@kit/Icon';
import StateBadge from '@kit/StateBadge';
import type { TaskRowData } from '@generated/types/tasks';
import { taskStateLook } from './taskLooks';

/**
 * One task row: the record link reading Task 31 and the title, then the state and Unassigned or the holder, and a
 * separate actions menu beside the link. The open record is the current link with the quiet selected surface.
 */
const props = defineProps<{
    task: TaskRowData;
    href: string;
    selected?: boolean;
}>();

const state = computed(() => taskStateLook[props.task.state]);
const holderText = computed(() =>
    props.task.holder ? props.task.holder.name : 'Unassigned',
);
const linkName = computed(
    () =>
        `Task ${props.task.number}: ${props.task.title}, ${state.value.label}, ${props.task.holder ? `held by ${holderText.value}` : 'Unassigned'}`,
);
</script>

<template>
    <div
        class="flex flex-wrap items-start gap-2 rounded-menu border px-3 py-2.5 text-text transition-colors duration-(--duration-hover)"
        :class="
            selected
                ? 'border-brand bg-sel'
                : 'border-border bg-raised hover:border-border-2 hover:bg-hover'
        "
    >
        <Link
            :href="href"
            preserve-scroll
            :aria-current="selected ? 'true' : undefined"
            :aria-label="linkName"
            class="flex min-w-0 flex-[1_1_14rem] flex-col gap-1.5 rounded-control outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text"
        >
            <span class="text-small text-text-3 tabular-nums"
                >Task {{ task.number }}</span
            >
            <span class="text-body font-medium [overflow-wrap:anywhere]">{{
                task.title
            }}</span>
            <span class="flex flex-wrap items-center gap-2 text-small text-text-3">
                <StateBadge v-bind="state" outlined />
                <span class="inline-flex min-w-0 items-center gap-1">
                    <Icon
                        :name="task.holder?.type === 'user' ? 'users' : 'agents'"
                        :size="12"
                    />
                    <span class="[overflow-wrap:anywhere]">{{ holderText }}</span>
                </span>
            </span>
        </Link>
        <ActionsMenu :label="`Actions for task ${task.number}`" class="shrink-0">
            <ActionsMenuItem :href="href" preserve-scroll>
                <Icon name="arrow" :size="12" />
                <span>Open task</span>
            </ActionsMenuItem>
        </ActionsMenu>
    </div>
</template>
