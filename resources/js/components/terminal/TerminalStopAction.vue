<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/kit/Button.vue';
import { keyedPost } from '@/framework/keyedPost';
import { newRequestId } from '@/kit/requestId';
import { stop as stopSession } from '@/routes/agents';
import type { TerminalScreenIdentityData } from '@generated/types/core';

/**
 * Stops the agent whose terminal is shown, after a confirmation, whoever holds its input: the host fences the input
 * first and never sends the unfinished line. A refused or lost stop says Stop failed and offers Retry stop.
 */
const props = defineProps<{ agentId: string; identity: TerminalScreenIdentityData }>();

const state = ref<'idle' | 'confirming' | 'stopping' | 'failed'>('idle');
const reason = ref('');

function stop(): void {
    const requestId = newRequestId();
    state.value = 'stopping';
    keyedPost(
        stopSession.url(props.agentId),
        { requestId, sessionId: props.identity.sessionId, generation: props.identity.processGeneration },
        requestId,
        {
            onAccepted: () => undefined,
            onRefused: (refusal) => {
                state.value = 'failed';
                reason.value = refusal ?? '';
            },
            onUncertain: () => (state.value = 'failed'),
        },
    );
}
</script>

<template>
    <span class="inline-flex flex-wrap items-center gap-1.5">
        <template v-if="state === 'idle'">
            <Button variant="danger" size="sm" @click="state = 'confirming'">Stop</Button>
        </template>
        <template v-if="state === 'confirming'">
            <span class="text-small text-text-2">Stop this agent? Its unfinished line is not sent.</span>
            <Button variant="danger" size="sm" @click="stop">Stop the agent</Button>
            <Button variant="ghost" size="sm" @click="state = 'idle'">Cancel</Button>
        </template>
        <template v-if="state === 'stopping'">
            <span class="text-small text-text-2">Stopping…</span>
        </template>
        <template v-if="state === 'failed'">
            <span class="text-small text-danger">Stop failed{{ reason ? `: ${reason}` : '' }}</span>
            <Button variant="danger" size="sm" @click="stop">Retry stop</Button>
        </template>
    </span>
</template>
