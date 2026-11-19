<script setup lang="ts">
import type { DriverRequestStatus } from '@/types/generated';
import { recover } from './runtimeRecovery';

/**
 * One driver request of a runtime: its place, operation, progress, expected timing and the key script it runs, with
 * the recoveries the owner may run on it now.
 */
const props = defineProps<{ request: DriverRequestStatus }>();

function run(action: string, question: string, extra: Record<string, unknown> = {}): void {
    const body = { rowVersion: props.request.rowVersion, ...extra };

    recover(`requests/${props.request.requestId}/${action}`, body, question);
}
</script>

<template>
    <tr>
        <td class="font-mono">{{ request.sequence }}</td>
        <td>{{ request.operation }}</td>
        <td>{{ request.progress }}{{ request.outcome ? ` (${request.outcome})` : '' }}</td>
        <td>{{ request.expectedTiming }}</td>
        <td>
            <template v-if="request.script">
                {{ request.script }} step {{ request.scriptStep ?? 0 }}: {{ request.scriptEvidence ?? '' }}
            </template>
        </td>
        <td class="flex gap-2">
            <template v-if="request.canRetry">
                <button type="button" @click="run('retry', 'Why send this request again?')">
                    Retry
                </button>
            </template>
            <template v-if="request.canCancel">
                <button type="button" @click="run('cancel', 'Why cancel this request?')">
                    Cancel
                </button>
            </template>
            <template v-if="request.canResolve">
                <button
                    type="button"
                    @click="run('resolve', 'What evidence shows the delivery arrived?', { applied: true })"
                >
                    Resolve as arrived
                </button>
                <button
                    type="button"
                    @click="run('resolve', 'What evidence shows the delivery never arrived?', { applied: false })"
                >
                    Resolve as not arrived
                </button>
            </template>
            <template v-if="request.canResumeScript">
                <button
                    type="button"
                    @click="run('resume-script', 'Why resume this key script?')"
                >
                    Resume
                </button>
            </template>
            <template v-if="request.canCancelScript">
                <button
                    type="button"
                    @click="run('cancel-script', 'Why cancel this key script?')"
                >
                    Cancel script
                </button>
            </template>
        </td>
    </tr>
</template>
