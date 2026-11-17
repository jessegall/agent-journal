<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import Icon from '@kit/Icon';
import type { PlanCardData } from '@generated/types/plans';
import { kindIcon, progressText, stateLook } from './planLooks';

/**
 * One plan card (doc 4, 7.3 and choice 16): kind, number, focus and state, the title, a progress bar and the foot.
 */
const props = defineProps<{
    card: PlanCardData;
    href: string;
    selected?: boolean;
}>();

const state = computed(() => stateLook[props.card.state]);
const progress = computed(() =>
    props.card.totalTasks === 0
        ? 0
        : (props.card.doneTasks / props.card.totalTasks) * 100,
);
</script>

<template>
    <Link
        :href="href"
        preserve-scroll
        :aria-current="selected ? 'true' : undefined"
        class="flex flex-col gap-2 rounded-menu border border-border bg-raised px-3 py-2.5 text-text transition-colors duration-(--duration-hover) hover:border-border-2 hover:bg-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        :class="{ 'border-brand': card.focused, 'bg-sel': selected }"
    >
        <span class="flex items-center gap-1.5 text-small text-text-3">
            <Icon :name="kindIcon[card.kind]" :size="12" />
            <span>Plan</span>
            <span class="font-mono tabular-nums">{{ card.id }}</span>
            <template v-if="card.focused">
                <span class="text-brand-text">Focus</span>
            </template>
            <span class="ml-auto" :class="state.tone">{{ state.label }}</span>
        </span>
        <span class="truncate text-body font-medium">{{ card.title }}</span>
        <span
            class="h-1 overflow-hidden rounded-full bg-bar-track"
            aria-hidden="true"
        >
            <span
                class="block h-full bg-brand"
                :style="{ width: `${progress}%` }"
            />
        </span>
        <span
            class="flex items-center gap-1 text-small text-text-3 tabular-nums"
        >
            <span>{{ progressText(card) }}</span>
            <template v-if="card.holder">
                <span
                    class="ml-auto inline-flex min-w-0 items-center gap-1"
                    :title="`Held by the ${card.holder.kind} ${card.holder.name}`"
                >
                    <Icon
                        :name="card.holder.kind === 'user' ? 'users' : 'agents'"
                        :size="12"
                    />
                    <span class="truncate">{{ card.holder.name }}</span>
                </span>
            </template>
        </span>
    </Link>
</template>
