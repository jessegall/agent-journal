<script setup lang="ts">
import type { DriverRequestStatus, RuntimeStatus } from '@/types/generated';
import { recover } from './runtimeRecovery';
import RuntimeRequestRow from './RuntimeRequestRow.vue';

/**
 * One agent runtime as stored: its program, activity, hold, settings and latest driver requests, with a button that
 * releases a hold the owner may release.
 */
const props = defineProps<{ status: RuntimeStatus; requests: DriverRequestStatus[] }>();

function releaseHold(): void {
    recover(
        `${props.status.sessionId}/release-hold`,
        { agentId: props.status.agentId, hold: props.status.hold },
        'Why release this hold?',
    );
}

function age(seconds: number | null): string {
    return seconds === null ? 'never observed' : `${seconds}s ago`;
}
</script>

<template>
    <section class="flex flex-col gap-2 rounded border border-line p-4">
        <header class="flex flex-wrap items-baseline gap-3">
            <span class="font-mono">{{ status.program }}</span>
            <span>{{ status.activity }}</span>
            <span class="text-text-3">hold: {{ status.hold }}</span>
            <template v-if="status.canReleaseHold">
                <button type="button" @click="releaseHold">Release hold</button>
            </template>
            <span :class="status.isStale ? 'text-warn' : 'text-text-3'">
                observed {{ age(status.observationAgeSeconds) }}{{ status.isStale ? ', stale' : '' }}
            </span>
        </header>
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 text-sm">
            <dt class="text-text-3">model</dt>
            <dd>
                observed {{ status.model.observed ?? 'unknown' }}, staged {{ status.model.staged ?? 'none' }},
                requested {{ status.model.requested ?? 'none' }}
            </dd>
            <dt class="text-text-3">effort</dt>
            <dd>
                observed {{ status.effort.observed ?? 'unknown' }}, staged {{ status.effort.staged ?? 'none' }},
                requested {{ status.effort.requested ?? 'none' }}
            </dd>
        </dl>
        <table class="text-sm">
            <thead class="text-left text-text-3">
                <tr>
                    <th>#</th>
                    <th>operation</th>
                    <th>progress</th>
                    <th>expected</th>
                    <th>script</th>
                    <th>recover</th>
                </tr>
            </thead>
            <tbody>
                <template v-for="request in requests" :key="request.requestId">
                  <RuntimeRequestRow :request="request" />
                </template>
            </tbody>
        </table>
    </section>
</template>
