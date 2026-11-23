<script setup lang="ts">
import Button from '@kit/Button';
import type { DriverRequestStatus, RuntimeStatus } from '@/types/generated';
import { recover } from './runtimeRecovery';
import RuntimeSettingDetail from './RuntimeSettingDetail.vue';
import RuntimeRequestRow from './RuntimeRequestRow.vue';

/**
 * The live controls of one agent runtime, a native part under its summary card: a button that releases a hold the
 * owner may release, its settings and its latest driver requests with their recovery buttons.
 */
const props = defineProps<{
    status: RuntimeStatus;
    requests: DriverRequestStatus[];
}>();

function releaseHold(): void {
    recover(
        `${props.status.sessionId}/release-hold`,
        { agentId: props.status.agentId, hold: props.status.hold },
        'Why release this hold?',
    );
}
</script>

<template>
    <section class="flex flex-col gap-2">
        <template v-if="status.canReleaseHold">
            <Button variant="bordered" class="self-start" @click="releaseHold">
                Release hold
            </Button>
        </template>
        <dl class="grid grid-cols-[auto_1fr] gap-x-4 text-sm">
            <dt class="text-text-3">model</dt>
            <RuntimeSettingDetail :setting="status.model" />
            <dt class="text-text-3">effort</dt>
            <RuntimeSettingDetail :setting="status.effort" />
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
