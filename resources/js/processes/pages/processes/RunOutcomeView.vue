<script setup lang="ts">
import type { RunOutcomePageData } from '@generated/types/processes';
import { Link } from '@inertiajs/vue3';
import { useNotifications } from '@kit/notifications';
import PageHeader from '@kit/PageHeader';
import { onMounted } from 'vue';

/**
 * A run's outcome as a notification shows it: its label, attempt reference, result and time, never a command, path, log
 * or output; Open full run shows only when the reader may read it. Once shown, the reader's receipt becomes read.
 */
const props = defineProps<{ data: RunOutcomePageData }>();

const notifications = useNotifications();

onMounted(() => {
    if (props.data.summary !== undefined) {
        void notifications.markTargetRead('run', props.data.runId);
    }
});
</script>

<template>
    <div class="flex flex-col gap-4">
        <PageHeader title="Run outcome" />
        <template v-if="data.summary">
            <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-body">
                <dt class="text-text-3">Outcome</dt>
                <dd>{{ data.summary.label }}</dd>
                <dt class="text-text-3">Attempt</dt>
                <dd>{{ data.summary.attemptReference }}</dd>
                <dt class="text-text-3">Recorded</dt>
                <dd>{{ data.summary.completedAt }}</dd>
            </dl>
            <template v-if="data.summary.mayOpenFullRun">
                <Link :href="`/processes/runs/${data.runId}`" class="underline">Open full run</Link>
            </template>
        </template>
        <template v-else>
            <p class="text-text-3" role="status">This item is unavailable</p>
        </template>
    </div>
</template>
