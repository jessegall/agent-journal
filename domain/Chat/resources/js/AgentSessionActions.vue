<script setup lang="ts">
import { Link, router, useHttp } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import { newRequestId } from '@kit/requestId';
import type { AgentOptionData, StatusActionData } from '@generated/types/chat';
import {
    accountsPage,
    cancelLaunch,
    capacity,
    dismissLaunchOutcome,
    recheck,
    retry,
    interruptTurn,
    stopSession,
    terminalPage,
} from '@kit/sessionStarts';
import { keyedPost } from '@kit/keyedPost';
import { useSwitchOperation } from './composables/useSwitchOperation';
import SessionAction from './SessionAction.vue';
import SessionForm from './SessionForm.vue';
import StopConfirmation from './StopConfirmation.vue';

/**
 * What the chosen agent's status offers now, from the server's projection: each action maps to its route or dialog.
 * Start and Resume open the session form, Switch its switch form; Retry and Check and continue switch follow the
 * switch; Check status reads the agent again; Check capacity reads the host's room without reserving; Sign in opens
 * Accounts; Dismiss hides the launch outcome for this viewer; Cancel start cancels the launch.
 */
const props = defineProps<{ agent: AgentOptionData }>();

const emit = defineEmits<{ dialog: [isOpen: boolean] }>();

type FormMode = 'start' | 'resume' | 'switch';

type CapacityAnswer = { fits: boolean; resource?: string; explanation?: string; remedy?: string };

const formMode = ref<FormMode | null>(null);
const isStopAsked = ref(false);
// The button that opened a dialog, which gets the focus back when the dialog closes.
let opener: HTMLElement | null = null;
const notice = ref<string | null>(null);
const pendingType = ref<string | null>(null);
const switching = useSwitchOperation(() => props.agent);
const http = useHttp<{ requestId: string; version: string }, CapacityAnswer>({ requestId: '', version: '' });

watch([formMode, isStopAsked], ([mode, isAsked]) => emit('dialog', mode !== null || isAsked));

function rememberOpener(): void {
    opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
}

function returnFocus(): void {
    opener?.focus();
    opener = null;
}

function closeStop(): void {
    isStopAsked.value = false;
    returnFocus();
}

function settleSwitch(route: typeof retry, label: 'Retrying' | 'Checking'): void {
    if (props.agent.switchId === null) {
        router.reload();

        return;
    }

    switching.retry(route.url(props.agent.switchId), newRequestId(), label);
}

function readAgain(): void {
    router.reload({ onFinish: () => (pendingType.value = null) });
}

function checkCapacity(): void {
    pendingType.value = 'check-capacity';
    http.get(capacity.url(props.agent.id, { query: { mode: 'required_container' } }), {
        onSuccess: (answer) => {
            notice.value = answer.fits ? 'The host has room for this start now.' : (answer.explanation ?? null);
        },
        onFinish: () => (pendingType.value = null),
    });
}

function dismiss(): void {
    const operation = props.agent.status.operation;

    if (operation === null) {
        return;
    }

    pendingType.value = 'dismiss';
    http.requestId = operation.id;
    http.version = operation.stage;
    http.post(dismissLaunchOutcome.url(props.agent.id), { onSuccess: readAgain, onError: readAgain });
}

function cancelStart(): void {
    if (props.agent.sessionId === null) {
        return;
    }

    pendingType.value = 'cancel-start';
    http.requestId = newRequestId();
    http.post(cancelLaunch.url({ agent: props.agent.id, session: props.agent.sessionId }), {
        onSuccess: readAgain,
        onError: readAgain,
    });
}

/**
 * Stops the session the bar shows, at the generation it shows, once under a new request id, after the confirmation;
 * the bar then follows the stop from the page, and Stopped shows only when the page says so.
 */
function stop(): void {
    if (props.agent.sessionId === null) {
        return;
    }

    isStopAsked.value = false;

    pendingType.value = 'stop';
    const requestId = newRequestId();
    keyedPost(
        stopSession.url(props.agent.id),
        { requestId, sessionId: props.agent.sessionId, generation: props.agent.sessionGeneration },
        requestId,
        {
            onAccepted: () => undefined,
            onRefused: (reason) => (notice.value = reason),
            onUncertain: readAgain,
            onFinish: () => {
                pendingType.value = null;
                returnFocus();
            },
        },
    );
}

/**
 * Interrupts the current turn once; the session stays and the bar shows Interrupting, then the observed activity.
 */
function interrupt(): void {
    if (props.agent.sessionId === null) {
        return;
    }

    pendingType.value = 'interrupt';
    const requestId = newRequestId();
    keyedPost(interruptTurn.url(props.agent.id), { requestId, sessionId: props.agent.sessionId }, requestId, {
        onAccepted: () => undefined,
        onRefused: (reason) => (notice.value = reason),
        onUncertain: readAgain,
        onFinish: () => (pendingType.value = null),
    });
}

const handlers: Record<StatusActionData['type'], () => void> = {
    stop: () => {
        rememberOpener();
        isStopAsked.value = true;
    },
    interrupt,
    start: () => {
        rememberOpener();
        formMode.value = 'start';
    },
    resume: () => {
        rememberOpener();
        formMode.value = 'resume';
    },
    switch: () => {
        rememberOpener();
        formMode.value = 'switch';
    },
    retry: () => settleSwitch(retry, 'Retrying'),
    'recheck-switch': () => settleSwitch(recheck, 'Checking'),
    'check-status': () => {
        pendingType.value = 'check-status';
        readAgain();
    },
    'check-capacity': checkCapacity,
    'sign-in': () => router.visit(accountsPage.url()),
    'open-terminal': () => router.visit(terminalPage.url(props.agent.id)),
    dismiss,
    'cancel-start': cancelStart,
};
</script>

<template>
    <div class="flex flex-wrap items-center gap-1.5" aria-label="Session actions">
        <template v-if="agent.hasTerminal && agent.sessionId !== null">
            <Link
                :href="terminalPage.url(agent.id)"
                class="rounded-control border border-border-2 px-2.5 py-0.5 text-small text-text-2 hover:bg-hover hover:text-text"
                >Terminal</Link
            >
        </template>
        <template v-for="(action, index) in agent.status.actions" :key="action.type">
            <SessionAction
                :action="action"
                :is-primary="index === 0"
                :is-pending="pendingType === action.type"
                @activate="handlers[action.type]()"
            />
        </template>
        <template v-if="notice">
            <p class="max-w-[60ch] text-small text-text-3">{{ notice }}</p>
        </template>
        <template v-if="switching.progress.value && switching.state.value !== 'idle'">
            <p class="text-small text-text-3">{{ switching.progress.value }}</p>
        </template>
        <template v-if="switching.refusal.value">
            <p class="text-small text-danger">{{ switching.refusal.value }}</p>
        </template>
        <template v-if="formMode">
            <SessionForm
                :agent="agent"
                :mode="formMode"
                @close="
                    formMode = null;
                    returnFocus();
                "
            />
        </template>
        <template v-if="isStopAsked">
            <StopConfirmation
                :agent-name="agent.name"
                :is-pending="pendingType === 'stop'"
                @confirm="stop"
                @close="closeStop"
            />
        </template>
    </div>
</template>
