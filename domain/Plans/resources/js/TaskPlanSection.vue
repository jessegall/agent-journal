<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { phase as phaseRoute, plan as planRoute } from '@generated/routes/plans';
import type { TaskPlanData } from '@generated/types/plans';

/**
 * The task's plan beside its facts in Tasks' reader: Plan 12 · Phase 2, each a link, or Not in a plan.
 */
defineProps<{ data: TaskPlanData }>();
</script>

<template>
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 text-small">
        <dt class="text-text-3">Plan</dt>
        <dd class="text-text-2">
            <template
                v-if="data.planNumber !== undefined && data.phaseNumber !== undefined"
            >
                <Link
                    :href="planRoute.url({ plan: data.planNumber })"
                    class="underline-offset-2 hover:underline"
                    :title="data.planTitle"
                    >Plan {{ data.planNumber }}</Link
                >
                ·
                <Link
                    :href="
                        phaseRoute.url({
                            plan: data.planNumber,
                            phase: data.phaseNumber,
                        })
                    "
                    class="underline-offset-2 hover:underline"
                    :title="data.phaseTitle"
                    >Phase {{ data.phaseNumber }}</Link
                >
            </template>
            <template v-else>Not in a plan</template>
        </dd>
    </dl>
</template>
