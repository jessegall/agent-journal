<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import Button from '@kit/Button';
import EmptyState from '@kit/EmptyState';
import FactItem from '@kit/FactItem';
import FactList from '@kit/FactList';
import StateBadge from '@kit/StateBadge';
import TextLink from '@kit/TextLink';
import Toggle from '@kit/Toggle';
import { useHostProp } from '@kit/hostProp';
import type { TaskGraph } from '@generated/types/tasks';
import Toast from '@kit/Toast';
import { overlayTarget } from '@kit/overlayLayer';
import TaskGraphCanvas from './partials/TaskGraphCanvas.vue';
import { bottlenecksOf, chainOf, diffOf, longestChainOf, maxConcurrencyOf } from '../../taskGraph';
import { taskStateLook } from '../../taskLooks';

/**
 * A plan's tasks as a graph: each task a node in the column of its wait depth, an arrow from every task that must
 * finish to the task that waits for it. Enter or Space on a node selects it, lights its whole chain both ways and fills
 * the inspector; Escape clears it and gives the focus back to the node; Show bottlenecks marks the tasks the most
 * others wait for. The inspector holds the task's facts, Open task, which returns here with the node selected, and
 * Close; a task whose waits the caller may not change keeps its facts readable and its change action disabled with the
 * reason. On a wide screen the canvas scrolls apart from the inspector; on a phone the inspector sits below.
 *
 * A suggestion is asked for only where the props give an address for it, and Suggest says why it is off otherwise. While
 * it is asked for, Now stays in view; if the ask fails Retry asks again. A suggestion draws Now and Suggested side by
 * side (stacked on a phone) with the waits it adds and removes marked by shape and label, and the longest chain and the
 * most tasks at once of each. Apply is there only with an address to apply to and the version the suggestion was made
 * from; when the waits changed meanwhile the comparison stays, says so and offers Reload and recompute. Undo is offered
 * in a toast only with an address for it, and Discard goes back to the plain graph.
 */
const props = defineProps<TaskGraph>();

const hostProp = useHostProp();
const selectedId = ref<string | null>(props.selectedId ?? null);
const showsBottlenecks = ref(false);
const root = useTemplateRef<HTMLElement>('root');
const step = ref<'plain' | 'asking' | 'failed' | 'comparing' | 'conflict' | 'applying' | 'failedApply'>(
    props.suggestion === undefined ? 'plain' : 'comparing',
);
const isApplied = ref(false);

const lit = computed(() => (selectedId.value === null ? new Set<string>() : chainOf(selectedId.value, props.edges)));
const bottlenecks = computed(() => (showsBottlenecks.value ? bottlenecksOf(props.nodes, props.edges) : new Set<string>()));
const selected = computed(() => props.nodes.find((node) => node.id === selectedId.value));
const hasWaits = computed(() => props.edges.length > 0);
const page = usePage<{ refusalCode?: string }>();
const canSuggest = computed(() => props.destinations?.suggest !== undefined);
const canApply = computed(() => props.destinations?.apply !== undefined && props.suggestion?.baseVersion !== undefined);
const isComparing = computed(
    () => props.suggestion !== undefined && ['comparing', 'conflict', 'applying', 'failedApply'].includes(step.value),
);
const diff = computed(() => diffOf(props.edges, props.suggestion?.edges ?? []));
const figures = computed(() => ({
    now: {
        chain: longestChainOf(props.nodes, props.edges),
        concurrency: maxConcurrencyOf(props.nodes, props.edges),
    },
    suggested: {
        chain: longestChainOf(props.nodes, props.suggestion?.edges ?? []),
        concurrency: maxConcurrencyOf(props.nodes, props.suggestion?.edges ?? []),
    },
}));

/**
 * One graph's figures as the comparison names them under its heading.
 */
function figuresLine(figure: { chain: number; concurrency: number }): string {
    return `Longest chain ${figure.chain}, most at once ${figure.concurrency}`;
}
const waitsFor = computed(() =>
    props.edges
        .filter((edge) => edge.dependentId === selectedId.value)
        .map((edge) => props.nodes.find((node) => node.id === edge.prerequisiteId))
        .filter((node) => node !== undefined),
);
const holdsUp = computed(() =>
    props.edges
        .filter((edge) => edge.prerequisiteId === selectedId.value)
        .map((edge) => props.nodes.find((node) => node.id === edge.dependentId))
        .filter((node) => node !== undefined),
);

function openHref(address: string, id: string): string {
    const separator = props.returnAddress.includes('?') ? '&' : '?';
    const back = `${props.returnAddress}${separator}node=${id}`;

    return `${address}?return=${encodeURIComponent(back)}`;
}

function select(id: string): void {
    selectedId.value = id;
}

async function clear(): Promise<void> {
    const id = selectedId.value;
    selectedId.value = null;

    if (id === null) {
        return;
    }

    await nextTick();
    root.value?.querySelector<HTMLElement>(`[data-node="${id}"]`)?.focus();
}

function suggest(): void {
    const address = props.destinations?.suggest;

    if (address === undefined) {
        return;
    }

    step.value = 'asking';
    router.post(
        address,
        { planId: props.planId, version: props.version },
        {
            only: [hostProp],
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => (step.value = 'comparing'),
            onError: () => (step.value = 'failed'),
            onNetworkError: () => {
                step.value = 'failed';

                return false;
            },
            onHttpException: () => {
                step.value = 'failed';

                return false;
            },
        },
    );
}

function apply(): void {
    const address = props.destinations?.apply;

    if (address === undefined || props.suggestion === undefined) {
        return;
    }

    step.value = 'applying';
    router.post(
        address,
        { planId: props.planId, baseVersion: props.suggestion.baseVersion },
        {
            only: [hostProp, 'refusalCode'],
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                step.value = 'plain';
                isApplied.value = true;
            },
            // A refused apply comes back as a form error with its refusal's code: a changed graph is the conflict.
            onError: () => {
                step.value = page.props.refusalCode === 'task-graph-changed' ? 'conflict' : 'failedApply';
            },
            onNetworkError: () => {
                step.value = 'failedApply';

                return false;
            },
            onHttpException: (response) => {
                step.value = response.status === 409 ? 'conflict' : 'failedApply';

                return false;
            },
        },
    );
}

function recompute(): void {
    router.reload({
        only: [hostProp],
        onSuccess: suggest,
    });
}

function undo(): void {
    const address = props.destinations?.undo;

    if (address !== undefined) {
        router.post(address, { planId: props.planId, version: props.version }, { only: [hostProp], preserveScroll: true });
    }
}
</script>

<template>
    <section ref="root" class="flex flex-col gap-3" aria-label="Task graph" @keydown.escape="clear">
        <template v-if="nodes.length === 0">
            <EmptyState title="This plan has no tasks" text="Add a task to the plan to see how its tasks wait for each other." />
        </template>
        <template v-else>
            <div class="flex flex-wrap items-center gap-3 text-small text-text-2">
                <label class="flex items-center gap-2">
                    <Toggle v-model="showsBottlenecks" label="Show bottlenecks" :disabled="!hasWaits" />
                    Show bottlenecks
                </label>
                <template v-if="!hasWaits">
                    <span role="status">No task waits for another yet.</span>
                </template>
                <template v-if="step === 'plain' || step === 'failed'">
                    <span class="flex items-center gap-2">
                        <Button
                            variant="bordered"
                            size="small"
                            :disabled="!canSuggest"
                            aria-describedby="graph-suggest-reason"
                            @click="suggest"
                            >Suggest</Button
                        >
                        <template v-if="!canSuggest">
                            <span id="graph-suggest-reason" class="text-text-3">You may not change the waits of this plan.</span>
                        </template>
                    </span>
                </template>
                <template v-if="step === 'asking'">
                    <span role="status" aria-live="polite">Looking for a better order. Now stays as it is.</span>
                </template>
                <template v-if="step === 'failed'">
                    <span role="alert" class="flex items-center gap-2">
                        The suggestion could not be made.
                        <Button variant="bordered" size="small" @click="suggest">Retry</Button>
                    </span>
                </template>
            </div>
            <template v-if="isComparing && suggestion !== undefined">
                <div class="flex flex-col gap-3 @2xl:flex-row" data-compare>
                    <div class="flex min-w-0 flex-1 flex-col gap-2">
                        <h3 class="text-text">Now</h3>
                        <p class="text-small text-text-3">
                            {{ figuresLine(figures.now) }}
                        </p>
                        <TaskGraphCanvas
                            label="Now"
                            :nodes="nodes"
                            :edges="edges"
                            :lit="lit"
                            :selected-id="selectedId"
                            :bottlenecks="bottlenecks"
                            @select="select"
                        />
                    </div>
                    <div class="flex min-w-0 flex-1 flex-col gap-2">
                        <h3 class="text-text">Suggested</h3>
                        <p class="text-small text-text-3">
                            {{ figuresLine(figures.suggested) }}
                        </p>
                        <TaskGraphCanvas
                            label="Suggested"
                            :nodes="nodes"
                            :edges="suggestion.edges"
                            :lit="lit"
                            :selected-id="selectedId"
                            :bottlenecks="new Set<string>()"
                            :added="diff.added"
                            :removed="diff.removed"
                            @select="select"
                        />
                    </div>
                </div>
                <template v-if="step === 'conflict'">
                    <p role="alert" class="flex flex-wrap items-center gap-2 text-text">
                        Waits changed since this suggestion was made. The comparison is kept.
                        <Button variant="bordered" size="small" @click="recompute">Reload and recompute</Button>
                    </p>
                </template>
                <template v-if="step === 'failedApply'">
                    <p role="alert" class="text-text">The suggestion could not be applied. Nothing changed.</p>
                </template>
                <div class="sticky bottom-0 flex flex-wrap items-center gap-2 border-t border-line bg-bg py-2" data-action-bar>
                    <template v-if="canApply">
                        <Button variant="primary" :pending="step === 'applying'" @click="apply">Apply</Button>
                    </template>
                    <Button variant="ghost" @click="step = 'plain'">Discard</Button>
                </div>
            </template>
            <template v-else>
                <div class="flex min-h-0 flex-col gap-3 @2xl:flex-row">
                    <TaskGraphCanvas
                        label="Task graph"
                        :nodes="nodes"
                        :edges="edges"
                        :lit="lit"
                        :selected-id="selectedId"
                        :bottlenecks="bottlenecks"
                        @select="select"
                    />
                    <template v-if="selected !== undefined">
                        <aside
                            aria-label="Selected task"
                            class="flex w-full shrink-0 flex-col gap-3 overflow-y-auto rounded-card border border-line p-3 @2xl:w-72"
                        >
                            <h3 class="text-text">Task {{ selected.number }}: {{ selected.title }}</h3>
                            <FactList>
                                <FactItem term="State">
                                    <StateBadge v-bind="taskStateLook[selected.state]" outlined />
                                </FactItem>
                                <FactItem term="Waits for">
                                    <template v-if="waitsFor.length === 0">nothing</template>
                                    <template v-for="(other, index) in waitsFor" :key="other.id">
                                        <template v-if="index > 0">, </template>
                                        <TextLink :href="openHref(other.address, other.id)">{{ other.number }}</TextLink>
                                    </template>
                                </FactItem>
                                <FactItem term="Holds up">
                                    <template v-if="holdsUp.length === 0">nothing</template>
                                    <template v-for="(other, index) in holdsUp" :key="other.id">
                                        <template v-if="index > 0">, </template>
                                        <TextLink :href="openHref(other.address, other.id)">{{ other.number }}</TextLink>
                                    </template>
                                </FactItem>
                            </FactList>
                            <div class="flex flex-wrap items-center gap-2">
                                <Button variant="bordered" :href="openHref(selected.address, selected.id)">Open task</Button>
                                <Button variant="ghost" @click="clear">Close</Button>
                            </div>
                            <template v-if="!selected.mayEditWaits">
                                <span class="flex flex-col gap-1">
                                    <Button variant="bordered" disabled aria-describedby="graph-change-reason">Change waits</Button>
                                    <span id="graph-change-reason" class="text-small text-text-3">{{ selected.reason }}</span>
                                </span>
                            </template>
                        </aside>
                    </template>
                </div>
            </template>
        </template>
        <template v-if="isApplied">
            <Teleport :to="overlayTarget()">
                <div class="pointer-events-none fixed inset-0 z-(--z-toast)">
                    <Toast
                        class="pointer-events-auto"
                        text="The suggested waits are applied"
                        :undo="destinations?.undo !== undefined"
                        @undo="undo"
                        @close="isApplied = false"
                    />
                </div>
            </Teleport>
        </template>
    </section>
</template>
