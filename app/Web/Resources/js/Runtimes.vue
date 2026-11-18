<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import type { RuntimesData } from '@/types/generated';

/**
 * The read-only runtime status: each agent runtime's activity, hold, settings and latest requests, as stored. It
 * offers no action; changes go through the console commands.
 */
defineProps<{ data: RuntimesData }>();

function age(seconds: number | null): string {
    return seconds === null ? 'never observed' : `${seconds}s ago`;
}
</script>

<template>
    <Head title="Runtimes" />
    <div class="flex flex-col gap-6 p-6">
        <h1 class="text-lg font-semibold">Runtimes</h1>
        <p v-if="data.runtimes.length === 0" class="text-text-3">No agent runtime is open.</p>
        <section
            v-for="entry in data.runtimes"
            :key="entry.status.runtimeId"
            class="flex flex-col gap-2 rounded border border-line p-4"
        >
            <header class="flex flex-wrap items-baseline gap-3">
                <span class="font-mono">{{ entry.status.program }}</span>
                <span>{{ entry.status.activity }}</span>
                <span class="text-text-3">hold: {{ entry.status.hold }}</span>
                <span :class="entry.status.isStale ? 'text-warn' : 'text-text-3'">
                    observed {{ age(entry.status.observationAgeSeconds) }}{{ entry.status.isStale ? ', stale' : '' }}
                </span>
            </header>
            <dl class="grid grid-cols-[auto_1fr] gap-x-4 text-sm">
                <dt class="text-text-3">model</dt>
                <dd>
                    observed {{ entry.status.model.observed ?? 'unknown' }}, staged {{ entry.status.model.staged ?? 'none' }},
                    requested {{ entry.status.model.requested ?? 'none' }}
                </dd>
                <dt class="text-text-3">effort</dt>
                <dd>
                    observed {{ entry.status.effort.observed ?? 'unknown' }}, staged
                    {{ entry.status.effort.staged ?? 'none' }}, requested {{ entry.status.effort.requested ?? 'none' }}
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
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="request in entry.requests" :key="request.requestId">
                        <td class="font-mono">{{ request.sequence }}</td>
                        <td>{{ request.operation }}</td>
                        <td>{{ request.progress }}{{ request.outcome ? ` (${request.outcome})` : '' }}</td>
                        <td>{{ request.expectedTiming }}</td>
                        <td>
                            <template v-if="request.script">
                                {{ request.script }} step {{ request.scriptStep ?? 0 }}: {{ request.scriptEvidence ?? '' }}
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>
