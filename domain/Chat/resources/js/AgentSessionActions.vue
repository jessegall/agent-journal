<script setup lang="ts">
import { Link, router } from '@inertiajs/vue3';
import { ref } from 'vue';
import Button from '@kit/Button';
import { postJson } from '@kit/jsonRequests';
import type { AgentOptionData } from '@generated/types/chat';
import type { AgentAction } from '@kit/CoreTypes';
import { recheck, retry, terminalPage } from '@kit/sessionStarts';
import SessionForm from './SessionForm.vue';

/**
 * What the chosen agent offers now, from Home's data: open its live session, start or resume one, switch it to
 * another driver, or retry or recheck the switch that last moved it. Start, Resume and Switch open their form.
 */
const props = defineProps<{ agent: AgentOptionData }>();

type FormMode = 'start' | 'resume' | 'switch';

const formMode = ref<FormMode | null>(null);
const refusal = ref<string | null>(null);
const labels: Record<AgentAction, string> = {
    open: 'Terminal',
    start: 'Start session',
    resume: 'Resume',
    switch: 'Switch',
    retry: 'Retry',
    recheck: 'Recheck',
};

async function settleSwitch(route: typeof retry): Promise<void> {
    if (props.agent.switchId === null) {
        return;
    }

    const reply = await postJson(route.url(props.agent.switchId));
    refusal.value = reply.ok ? null : reply.message;
    router.reload();
}

function act(action: AgentAction): void {
    if (action === 'retry') {
        void settleSwitch(retry);

        return;
    }

    if (action === 'recheck') {
        void settleSwitch(recheck);

        return;
    }

    if (action !== 'open') {
        formMode.value = action;
    }
}
</script>

<template>
    <div class="flex flex-wrap items-center gap-1.5" aria-label="Session actions">
        <template v-for="action in agent.actions" :key="action">
            <template v-if="action === 'open'">
                <Link
                    :href="terminalPage.url(agent.id)"
                    class="rounded-control border border-border-2 px-2.5 py-0.5 text-small text-text-2 hover:bg-hover hover:text-text"
                    >{{ labels.open }}</Link
                >
            </template>
            <template v-else>
                <Button variant="bordered" size="small" @click="act(action)">{{ labels[action] }}</Button>
            </template>
        </template>
        <template v-if="refusal">
            <p class="text-small text-danger" role="alert">{{ refusal }}</p>
        </template>
        <template v-if="formMode">
            <SessionForm :agent="agent" :mode="formMode" @close="formMode = null" />
        </template>
    </div>
</template>
