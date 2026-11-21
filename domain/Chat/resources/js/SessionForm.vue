<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import Button from '@kit/Button';
import FormField from '@kit/FormField';
import Modal from '@kit/Modal';
import { getJson } from '@kit/jsonRequests';
import { followPage } from '@kit/followPage';
import { keyedPost } from '@kit/keyedPost';
import { newRequestId } from '@kit/requestId';
import { useSwitchOperation } from './composables/useSwitchOperation';
import type { AgentOptionData } from '@generated/types/chat';
import type { DriverVariant, HookDriver } from '@kit/CoreTypes';
import {
    accountsPage,
    eligibleAccounts,
    startMain,
    switchMethod,
    type EligibleAccountData,
    type EligibleAccountsData,
} from '@kit/sessionStarts';

/**
 * Starts, resumes or switches the chosen agent's session: the driver, the variant (the profile's default unless one
 * is chosen, kept for the agent when asked), the account among those the driver may run with, and for a resume the
 * conversation it continues. The form makes one request id when it opens, so a second press repeats the same start.
 * A start reads Ready only once the host runs it, and shows the host's refusal when its start was refused; a switch
 * shows each stage it passes until it ends.
 */
const props = defineProps<{
    agent: AgentOptionData;
    mode: 'start' | 'resume' | 'switch';
}>();

const emit = defineEmits<{ close: [] }>();

type SessionChoice = {
    requestId: string;
    agentId: string;
    model: string;
    driver: HookDriver;
    variant: DriverVariant | null;
    saveVariant: boolean;
    accountId: string | undefined;
    accountRevision: number | undefined;
    conversationId: string | null;
};

const drivers: { value: HookDriver; label: string }[] = [
    { value: 'claude-code', label: 'Claude Code' },
    { value: 'codex', label: 'Codex' },
];
const variants: { value: DriverVariant | ''; label: string }[] = [
    { value: '', label: "The profile's default" },
    { value: 'terminal', label: 'Terminal' },
    { value: 'headless', label: 'Headless' },
];
const titles = { start: 'Start session', resume: 'Resume a conversation', switch: 'Switch session' };

const requestId = newRequestId();
const switching = useSwitchOperation(() => props.agent);
const driver = ref<HookDriver>(props.agent.conversations[0]?.driver ?? 'claude-code');
const variant = ref<DriverVariant | ''>('');
const saveVariant = ref(false);
const accounts = ref<EligibleAccountData[]>([]);
const accountId = ref<string | null>(null);
const conversationId = ref<string | null>(props.mode === 'resume' ? (props.agent.conversations[0]?.id ?? null) : null);
const refusal = ref<string | null>(null);
const progress = ref<string | null>(null);
const sending = ref(false);
let startedSessionId: string | null = null;
let following: { stop: () => void } | undefined;

const account = computed(() => accounts.value.find((choice) => choice.id === accountId.value));
const review = computed(() => {
    const driverLabel = drivers.find((choice) => choice.value === driver.value)?.label;
    const variantLabel = variant.value === '' ? 'its default variant' : variant.value;

    return `${driverLabel} as ${variantLabel}, on ${account.value?.label ?? 'no account'}`;
});
const isSwitchOpen = computed(() => ['sending', 'following', 'uncertain'].includes(switching.state.value));
const canSubmit = computed(
    () => account.value !== undefined && account.value.unavailableReason === null && !sending.value && !isSwitchOpen.value,
);
// A switch shows its own stage and refusal; a start or resume shows the form's.
const shownProgress = computed(() => (props.mode === 'switch' ? switching.progress.value : progress.value));
const shownRefusal = computed(() => (props.mode === 'switch' ? switching.refusal.value : null) ?? refusal.value);

async function readAccounts(chosen: HookDriver): Promise<void> {
    const reply = await getJson<EligibleAccountsData>(eligibleAccounts.url(chosen));
    accounts.value = reply.ok ? reply.value.accounts : [];
    refusal.value = reply.ok ? null : reply.message;
    const preferred = accounts.value.find((choice) => choice.isDefault && choice.unavailableReason === null)
        ?? accounts.value.find((choice) => choice.unavailableReason === null);
    accountId.value = preferred?.id ?? null;
}

watch(driver, readAccounts, { immediate: true });

function sessionChoice(): SessionChoice {
    return {
        requestId,
        agentId: props.agent.id,
        model: 'default',
        driver: driver.value,
        variant: variant.value === '' ? null : variant.value,
        saveVariant: saveVariant.value,
        accountId: account.value?.id,
        accountRevision: account.value?.signInRevision,
        conversationId: conversationId.value,
    };
}

/**
 * Starts or resumes once under the form's request id, through Inertia. Starting or Resuming shows at once and stays
 * until the page shows the session the start answered with running; a session another request started is shown as
 * it is, and does not confirm this one.
 */
function start(): void {
    progress.value = props.mode === 'resume' ? 'Resuming' : 'Starting';
    refusal.value = null;
    sending.value = true;
    keyedPost(startMain.url(props.agent.profileKey), sessionChoice(), requestId, {
        onAccepted: (flash) => {
            startedSessionId = typeof flash.startedSessionId === 'string' ? flash.startedSessionId : null;
            followStart();
        },
        onRefused: (reason) => {
            refusal.value = reason;
            progress.value = null;
        },
        onUncertain: () => followStart(),
        onFinish: () => (sending.value = false),
    });
}

/**
 * Shows the start as the page has it now, and answers whether this request's session runs.
 */
function showStart(): boolean {
    const shown = props.agent;

    if (startedSessionId !== null && shown.sessionId === startedSessionId && shown.startRefusal !== null) {
        progress.value = null;
        refusal.value = shown.startRefusal;

        return true;
    }

    if (startedSessionId !== null && shown.sessionId === startedSessionId && shown.presence === 'working') {
        progress.value = 'Ready';

        return true;
    }

    if (shown.presence === 'working' && shown.sessionId !== startedSessionId) {
        progress.value = 'Another session is running; this start is not confirmed yet';
    }

    return false;
}

function followStart(): void {
    if (!showStart()) {
        following = followPage(showStart);
    }
}

/**
 * Sends the switch once under the form's request id, through Inertia; the dialog then follows its stage from the
 * page until it is over.
 */
function switchSession(): void {
    switching.begin(requestId, switchMethod.url(props.agent.profileKey), {
        ...sessionChoice(),
        variant: variant.value === '' ? 'terminal' : variant.value,
        expectedSessionId: props.agent.sessionId,
        expectedGeneration: props.agent.sessionGeneration,
    });
}

function submit(): void {
    if (!canSubmit.value) {
        return;
    }

    if (props.mode === 'switch') {
        switchSession();

        return;
    }

    start();
}

onBeforeUnmount(() => following?.stop());
</script>

<template>
    <Modal :is-open="true" :title="titles[mode]" @close="emit('close')">
        <form class="flex flex-col gap-3" @submit.prevent="submit">
            <template v-if="mode === 'switch'">
                <p class="text-small text-text-3">
                    {{ agent.name }} stops its current session first; the new one starts once the stop is confirmed.
                    Your draft stays.
                </p>
            </template>
            <template v-if="mode === 'resume'">
                <fieldset class="flex flex-col gap-1">
                    <legend class="text-small text-text-2">Conversation</legend>
                    <template v-for="conversation in agent.conversations" :key="conversation.id">
                        <label class="flex items-center gap-2 text-small text-text">
                            <input v-model="conversationId" type="radio" :value="conversation.id" />
                            {{ drivers.find((choice) => choice.value === conversation.driver)?.label }},
                            {{ new Date(conversation.startedAt).toLocaleString() }}
                        </label>
                    </template>
                    <label class="flex items-center gap-2 text-small text-text">
                        <input v-model="conversationId" type="radio" :value="null" />
                        Start a new conversation instead
                    </label>
                </fieldset>
            </template>
            <FormField id="session-driver" label="Driver">
                <template #default="{ id }">
                    <select :id="id" v-model="driver" class="rounded-control border border-border-2 bg-transparent px-2 py-1 text-body">
                        <template v-for="choice in drivers" :key="choice.value">
                            <option :value="choice.value">{{ choice.label }}</option>
                        </template>
                    </select>
                </template>
            </FormField>
            <FormField id="session-variant" label="Variant">
                <template #default="{ id }">
                    <select :id="id" v-model="variant" class="rounded-control border border-border-2 bg-transparent px-2 py-1 text-body">
                        <template v-for="choice in variants" :key="choice.value">
                            <option :value="choice.value">{{ choice.label }}</option>
                        </template>
                    </select>
                </template>
            </FormField>
            <label class="flex items-center gap-2 text-small text-text-2">
                <input v-model="saveVariant" type="checkbox" :disabled="variant === ''" />
                Use as default for this agent
            </label>
            <FormField id="session-account" label="Account">
                <template #default="{ id }">
                    <template v-if="accounts.length === 0">
                        <p class="text-small text-text-3">
                            No account can run this driver.
                            <Link :href="accountsPage.url()" class="underline">Add account</Link>
                        </p>
                    </template>
                    <template v-else>
                        <select :id="id" v-model="accountId" class="rounded-control border border-border-2 bg-transparent px-2 py-1 text-body">
                            <template v-for="choice in accounts" :key="choice.id">
                                <option :value="choice.id" :disabled="choice.unavailableReason !== null">
                                    {{ choice.label }}<template v-if="choice.unavailableSentence">: {{ choice.unavailableSentence }}</template>
                                </option>
                            </template>
                        </select>
                    </template>
                </template>
            </FormField>
            <p class="text-small text-text-2">Starts {{ review }}.</p>
            <template v-if="shownProgress">
                <p class="text-small text-text" aria-live="polite">{{ shownProgress }}</p>
            </template>
            <template v-if="shownRefusal">
                <p class="text-small text-danger" role="alert">{{ shownRefusal }}</p>
            </template>
        </form>
        <template #footer>
            <Button variant="ghost" @click="emit('close')">Cancel</Button>
            <Button variant="primary" :disabled="!canSubmit" @click="submit">{{ titles[mode] }}</Button>
        </template>
    </Modal>
</template>
