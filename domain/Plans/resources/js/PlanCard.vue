<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import ActionsMenu from '@kit/ActionsMenu';
import ActionsMenuItem from '@kit/ActionsMenuItem';
import Icon from '@kit/Icon';
import StateBadge from '@kit/StateBadge';
import type { PlanCardData } from '@generated/types/plans';
import { planHeading, planName, progressText, stateLook, typeIcon } from './planLooks';
import StartPlanForm from './StartPlanForm.vue';

/**
 * One plan row (doc 93, U6-U7): the record link with its number and type, the wrapping title and holder, the outlined
 * state and the progress, then a separate actions menu beside it. The server's focus shows as Focused plan; the open
 * record has the quiet selected surface and is the current link, named Selected plan. Neither looks like the
 * keyboard focus outline.
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
const name = computed(() => planName(props.card));
const linkName = computed(() =>
    [
        `${name.value.charAt(0).toUpperCase()}${name.value.slice(1)}: ${props.card.title}`,
        state.value.label,
        props.card.holder ? `held by ${props.card.holder.name}` : '',
        props.card.focused ? 'Focused plan' : '',
        props.selected ? 'Selected plan' : '',
    ]
        .filter((part) => part !== '')
        .join(', '),
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
            class="flex min-w-0 flex-[1_1_14rem] flex-col gap-2 rounded-control outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text"
        >
            <span class="flex items-center gap-1.5 text-small text-text-3">
                <Icon :name="typeIcon[card.type]" :size="12" />
                <span class="tabular-nums">{{ planHeading(card) }}</span>
            </span>
            <span class="text-body font-medium [overflow-wrap:anywhere]">{{
                card.title
            }}</span>
            <template v-if="card.holder">
                <span
                    class="inline-flex min-w-0 items-center gap-1 text-small text-text-3"
                >
                    <Icon
                        :name="card.holder.type === 'user' ? 'users' : 'agents'"
                        :size="12"
                    />
                    <span class="[overflow-wrap:anywhere]">{{
                        card.holder.name
                    }}</span>
                </span>
            </template>
            <span class="flex flex-wrap items-center gap-1.5">
                <StateBadge v-bind="state" outlined />
                <template v-if="card.focused">
                    <span
                        class="inline-flex items-center gap-1 text-small font-medium text-text-2"
                    >
                        <Icon name="star-filled" :size="12" />
                        <span>Focused plan</span>
                    </span>
                </template>
            </span>
            <span
                class="h-1 overflow-hidden rounded-full bg-bar-track"
                aria-hidden="true"
            >
                <span
                    class="block h-full bg-brand"
                    :style="{ width: `${progress}%` }"
                />
            </span>
            <span class="text-small text-text-3 tabular-nums">{{
                progressText(card)
            }}</span>
        </Link>
        <ActionsMenu :label="`Actions for ${name}`" class="shrink-0">
            <template v-if="card.start">
                <StartPlanForm
                    :key="card.start.planId"
                    :start="card.start"
                >
                    <template #default="{ pending }">
                        <ActionsMenuItem type="submit" :pending="pending">
                            <Icon name="start" :size="12" />
                            <span>Start plan</span>
                        </ActionsMenuItem>
                    </template>
                    <template #unknown="{ check }">
                        <p class="px-2 py-1 text-small text-text-2">
                            Outcome unknown
                        </p>
                        <ActionsMenuItem @click="check">
                            <Icon name="search" :size="12" />
                            <span>Check plan</span>
                        </ActionsMenuItem>
                    </template>
                </StartPlanForm>
            </template>
            <ActionsMenuItem :href="href" preserve-scroll>
                <Icon name="arrow" :size="12" />
                <span>Open plan</span>
            </ActionsMenuItem>
        </ActionsMenu>
    </div>
</template>
