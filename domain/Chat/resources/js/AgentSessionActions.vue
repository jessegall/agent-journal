<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { onMounted, ref, watch } from 'vue';
import { newRequestId } from '@kit/requestId';
import type { AgentOptionData, StatusActionData } from '@generated/types/chat';
import {
    accountsPage,
    cancelLaunch,
    dismissLaunchOutcome,
    recheck,
    retry,
    interruptTurn,
    stopSession,
    terminalPage,
} from '@kit/sessionStarts';
import { keyedPost } from '@kit/keyedPost';
import { sendPageAction } from '@kit/pageActions';
import { readPage } from '@kit/pageReads';
import { useOpenSessionDialog } from './composables/useChosenAgent';
import { useSwitchOperation } from './composables/useSwitchOperation';
import { openTerminalBesideChat } from './composables/useTerminalDock';
import SessionAction from './SessionAction.vue';
import SessionForm from './SessionForm.vue';
import StopConfirmation from './StopConfirmation.vue';

/**
 * What the chosen agent's status offers now, from the server's projection: each action maps to its route or dialog.
 * Start and Resume open the session form, Switch its switch form; Retry and Check and switch follow the
 * switch; Check status reads the agent again; Check capacity reads the host's room without reserving; Sign in opens
 * Accounts; Dismiss hides the launch outcome for this viewer; Cancel start cancels the launch. Each agent keeps its
 * own controls: its open dialog and a switch under way survive switching chats and a reload in this tab.
 */
const props = defineProps<{ agent: AgentOptionData }>();

const emit = defineEmits<{ dialog: [isOpen: boolean] }>();

type FormMode = 'start' | 'resume' | 'switch';

type CapacityAnswer = { fits: boolean; resource?: string; explanation?: string; remedy?: string };

const formModes: FormMode[] = ['start', 'resume', 'switch'];
const viewer = usePage().props.currentUser as { id: string } | undefined;
const openDialog = viewer === undefined ? undefined : useOpenSessionDialog(viewer.id, props.agent.id);
const kept = openDialog?.read() ?? null;
// The dialog this agent had open in this tab comes back, with the start or switch it follows.
const formMode = ref<FormMode | null>(formModes.find((mode) => mode === kept) ?? null);
const isStopAsked = ref(false);
// The button that opened a dialog, which gets the focus back when the dialog closes.
let opener: HTMLElement | null = null;
const notice = ref<string | null>(null);
const pendingType = ref<string | null>(null);
const switching = useSwitchOperation(() => props.agent);

watch([formMode, isStopAsked], ([mode, isAsked]) => emit('dialog', mode !== null || isAsked));
watch(formMode, (mode) => (mode === null ? openDialog?.forget() : openDialog?.keep(mode)));

// A switch already under way for this agent is followed again, never sent again.
onMounted(() => switching.resume());

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
    readPage<CapacityAnswer>('web.capacity', { agent: props.agent.id, mode: 'required_container' })
        .then((answer) => {
            notice.value = answer.fits ? 'The host has room for this start now.' : (answer.explanation ?? null);
        })
        .finally(() => (pendingType.value = null));
}

function dismiss(): void {
    const operation = props.agent.status.operation;

    if (operation === null) {
        return;
    }

    pendingType.value = 'dismiss';
    sendPageAction(
        dismissLaunchOutcome(props.agent.id),
        { requestId: operation.id, version: operation.stage },
        { only: [], onFinish: () => (pendingType.value = null) },
    );
}

function cancelStart(): void {
    if (props.agent.sessionId === null) {
        return;
    }

    pendingType.value = 'cancel-start';
    sendPageAction(
        cancelLaunch({ agent: props.agent.id, session: props.agent.sessionId }),
        { requestId: newRequestId() },
        { only: [], onFinish: () => (pendingType.value = null) },
    );
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

/**
 * Opens the agent's terminal beside the chat; with no chat window to take it, its own page opens instead.
 */
function openTerminal(): void {
    if (!openTerminalBesideChat(props.agent.id, props.agent.sessionId, props.agent.sessionGeneration)) {
        router.visit(terminalPage.url(props.agent.id));
    }
}

/**
 * A plain click opens the terminal beside the chat; a click that asks for a new tab or window follows the link.
 */
function openTerminalFromLink(event: MouseEvent): void {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
        return;
    }

    event.preventDefault();
    openTerminal();
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
    'open-terminal': openTerminal,
    dismiss,
    'cancel-start': cancelStart,
};
</script>

<template>
    <div class="flex flex-wrap items-center gap-1.5" aria-label="Session actions">
        <template v-if="agent.hasTerminal && agent.sessionId !== null">
            <a
                :href="terminalPage.url(agent.id)"
                data-terminal-action
                class="rounded-control border border-border-2 px-2.5 py-0.5 text-small text-text-2 hover:bg-hover hover:text-text"
                @click="openTerminalFromLink"
                >Terminal</a
            >
        </template>
        <template v-if="agent.needsAttention && agent.hasTerminal && agent.sessionId !== null">
            <p class="flex items-center gap-1.5 text-small text-text-2" role="status">
                The driver needs your attention.
                <button type="button" class="underline" @click="openTerminal">Open terminal</button>
            </p>
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
