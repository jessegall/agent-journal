<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import Reader from '@kit/Reader';
import { plan as planRoute } from '@generated/routes/plans';
import type { PhaseReaderData } from '@generated/types/plans';

/**
 * One phase of a plan on its own page: its tasks in their order, by number; an empty phase keeps its title and leads
 * back to its plan.
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
            <Link :href="planRoute.url({ plan: data.planNumber })" class="mt-2 text-small underline">Back to its plan</Link>
        </template>
    </Reader>
</template>
