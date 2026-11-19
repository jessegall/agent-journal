<script setup lang="ts">
import type { DriverRequestStatus } from '@/types/generated';

/**
 * One driver request of a runtime: its place, operation, progress, expected timing and the key script it runs.
 */
defineProps<{ request: DriverRequestStatus }>();
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
    </tr>
</template>
