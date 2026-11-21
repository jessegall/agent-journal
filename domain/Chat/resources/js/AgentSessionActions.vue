<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import Button from '@kit/Button';
import { newRequestId } from '@kit/requestId';
import type { AgentOptionData } from '@generated/types/chat';
import type { AgentAction } from '@kit/CoreTypes';
import { recheck, retry, terminalPage } from '@kit/sessionStarts';
import { useSwitchOperation } from './composables/useSwitchOperation';
import SessionForm from './SessionForm.vue';

/**
 * What the chosen agent offers now, from Home's data: open its live session, start or resume one, switch it to
 * another driver, or retry or recheck the switch that last moved it. Start, Resume and Switch open their form.
 */
const props = defineProps<{ agent: AgentOptionData }>();

type FormMode = 'start' | 'resume' | 'switch';

const formMode = ref<FormMode | null>(null);
const switching = useSwitchOperation(() => props.agent);
const labels: Record<AgentAction, string> = {
    open: 'Terminal',
    start: 'Start session',
    resume: 'Resume',
    switch: 'Switch',
    retry: 'Retry',
    recheck: 'Recheck',
};

/**
 * Retries or rechecks the agent's switch once at a time; the switch is followed until it is over.
 */
function settleSwitch(route: typeof retry, label: 'Retrying' | 'Checking'): void {
    if (props.agent.switchId === null) {
        return;
    }

    switching.retry(route.url(props.agent.switchId), newRequestId(), label);
}

function act(action: AgentAction): void {
    if (action === 'retry') {
        settleSwitch(retry, 'Retrying');

        return;
    }

    if (action === 'recheck') {
        settleSwitch(recheck, 'Checking');

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
        <template v-if="switching.progress.value && switching.state.value !== 'idle'">
            <p class="text-small text-text-3" aria-live="polite">{{ switching.progress.value }}</p>
        </template>
        <template v-if="switching.refusal.value">
            <p class="text-small text-danger" role="alert">{{ switching.refusal.value }}</p>
        </template>
        <template v-if="formMode">
            <SessionForm :agent="agent" :mode="formMode" @close="formMode = null" />
        </template>
    </div>
</template>
