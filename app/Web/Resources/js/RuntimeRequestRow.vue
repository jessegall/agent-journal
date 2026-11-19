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
            <button v-if="request.canRetry" type="button" @click="run('retry', 'Why send this request again?')">
                Retry
            </button>
            <button v-if="request.canCancel" type="button" @click="run('cancel', 'Why cancel this request?')">
                Cancel
            </button>
            <button
                v-if="request.canResolve"
                type="button"
                @click="run('resolve', 'What evidence shows the delivery arrived?', { applied: true })"
            >
                Resolve as arrived
            </button>
            <button
                v-if="request.canResolve"
                type="button"
                @click="run('resolve', 'What evidence shows the delivery never arrived?', { applied: false })"
            >
                Resolve as not arrived
            </button>
            <button
                v-if="request.canResumeScript"
                type="button"
                @click="run('resume-script', 'Why resume this key script?')"
            >
                Resume
            </button>
            <button
                v-if="request.canCancelScript"
                type="button"
                @click="run('cancel-script', 'Why cancel this key script?')"
            >
                Cancel script
            </button>
        </td>
    </tr>
</template>
