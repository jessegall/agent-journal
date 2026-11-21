<script setup lang="ts">
import CountedProgress from '@kit/CountedProgress';
import Reader from '@kit/Reader';
import type { PhaseReaderData } from '@generated/types/plans';
import { currentPhaseRule, progressText } from './planLooks';

/**
 * One phase of a plan on its own page: the same counted progress the card and the plan show, the Current phase
 * marker in words, whether the caller may run checks now and the phase's latest check receipt, then its tasks in
 * their order, by number.
 */
defineProps<{ data: PhaseReaderData }>();
</script>

<template>
    <Reader :title="data.title">
        <template #meta>
            <span class="tabular-nums"
                >Plan {{ data.planNumber }}, phase {{ data.number }}</span
            >
            <span>{{ data.planTitle }}</span>
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
                    <template v-if="data.checkReceipt">
                        {{ data.checkReceipt.operation }},
                        {{ data.checkReceipt.outcome }},
                        <time :datetime="data.checkReceipt.recordedAt">{{
                            new Date(data.checkReceipt.recordedAt).toLocaleString()
                        }}</time>
                        ·
                        {{
                            data.checkReceipt.isAfterLastChange
                                ? 'after the last task change'
                                : 'before a later task change'
                        }}
                    </template>
                    <template v-else>None yet</template>
                </dd>
            </dl>
        </div>
        <template v-if="data.tasks.length > 0">
            <ol class="mt-4 flex flex-col gap-1">
                <template v-for="task in data.tasks" :key="task.number">
                    <li class="flex gap-2">
                        <span class="font-mono tabular-nums text-text-3"
                            >Task {{ task.number }}</span
                        >
                        <span>{{ task.title }}</span>
                    </li>
                </template>
            </ol>
        </template>
        <template v-else>
            <p class="mt-4 text-empty text-text-3">This phase has no tasks yet.</p>
        </template>
    </Reader>
</template>
