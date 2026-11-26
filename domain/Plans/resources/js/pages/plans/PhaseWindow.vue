<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';
import CountedProgress from '@kit/CountedProgress';
import Reader from '@kit/Reader';
import { plan as planRoute } from '@generated/routes/plans';
import type { PhaseReaderData } from '@generated/types/plans';
import PhaseTaskList from './partials/PhaseTaskList.vue';
import { currentPhaseRule, progressText } from '../../planLooks';
import { usePhasePages } from '../../usePhasePages';

/**
 * One phase of a plan on its own page: its counted progress, the Current phase marker, whether checks may run now and
 * its latest check receipt, then its tasks a page at a time. A link leads back to the plan, also for an empty phase.
 */
const props = defineProps<{ data: PhaseReaderData }>();
const checkReceipt = computed(() => props.data.checkReceipt);

const { phases: pages, loadMore, retry } = usePhasePages(
    () => props.data.tasks,
    false,
);
</script>

<template>
    <Reader :title="data.title">
        <template #meta>
            <span class="tabular-nums"
                >Plan {{ data.planNumber }}, phase {{ data.number }}</span
            >
            <Link
                :href="planRoute.url({ plan: data.planNumber })"
                class="underline-offset-2 hover:underline"
                >{{ data.planTitle }}</Link
            >
        </template>
        <div class="mt-3 flex flex-col gap-2">
            <template v-if="data.isCurrent">
                <p class="text-small text-text-3">
                    <span class="font-medium text-text-2">Current phase</span>
                    <span class="block text-text-4">{{ currentPhaseRule }}</span>
                </p>
            </template>
            <CountedProgress
                :owner="`phase ${data.number}`"
                :finished="data.finishedTasks"
                :total="data.totalTasks"
                :text="progressText(data)"
            />
            <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-small">
                <dt class="text-text-3">Can run checks</dt>
                <dd class="text-text-2">
                    {{
                        data.canRunChecks
                            ? 'Yes'
                            : 'Not yet: open or started tasks hold them'
                    }}
                </dd>
                <dt class="text-text-3">Check receipt</dt>
                <dd class="text-text-2">
                    <template v-if="checkReceipt">
                        {{ checkReceipt.operation }},
                        {{ checkReceipt.outcome }},
                        <time :datetime="checkReceipt.recordedAt">{{
                            new Date(checkReceipt.recordedAt).toLocaleString()
                        }}</time>
                        ·
                        {{
                            checkReceipt.isAfterLastChange
                                ? 'after the last task change'
                                : 'before a later task change'
                        }}
                    </template>
                    <template v-else>None yet</template>
                </dd>
            </dl>
        </div>
        <div class="mt-4">
            <template v-for="phasePages in [pages.get(data.number)]">
                <template v-if="phasePages !== undefined">
                    <PhaseTaskList
                        :pages="phasePages"
                        :phase-name="`phase ${data.number}`"
                        @load-more="loadMore(data.number)"
                        @retry="retry(data.number)"
                    />
                </template>
            </template>
            <template v-if="data.totalTasks === 0">
                <Link
                    :href="planRoute.url({ plan: data.planNumber })"
                    class="mt-2 text-small underline"
                    >Back to its plan</Link
                >
            </template>
        </div>
    </Reader>
</template>
