<script setup lang="ts">
import { ref } from 'vue';
import { dock as dockRoute } from '@generated/routes/chat';
import type { DockAnswerData } from '@generated/types/chat';
import type { SourceActionData } from '@kit/CoreTypes';
import { postJson } from '@kit/jsonRequests';

/**
 * The action the backend offers on a source, docking it in this conversation; each press is its own request, and the
 * answer says whether it was added, was there already, or is not available.
 */
const props = defineProps<{ action: SourceActionData; sourceId: string; agentId: string }>();

const answers: Record<DockAnswerData['outcome'], string> = {
    added: 'Added to the chat',
    present: 'Already in the chat',
    removed: 'Removed from the chat',
    unavailable: 'Not available',
};
const answer = ref<string | null>(null);

async function press(): Promise<void> {
    const reply = await postJson<DockAnswerData>(dockRoute().url, {
        agent: props.agentId,
        type: props.action.type,
        id: props.sourceId,
    });
    answer.value = reply.ok ? answers[reply.value.outcome] : reply.message;
}
</script>

<template>
    <button type="button" class="underline" @click="press">{{ action.label }}</button>
    <template v-if="answer !== null">
        <span role="status">{{ answer }}</span>
    </template>
</template>
