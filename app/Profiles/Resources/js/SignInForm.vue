<script setup lang="ts">
import type {
    SignInAttemptData,
    SignInMethod,
    SignInMethodData,
} from '@generated/types/accounts';
import {
    cancelSignIn,
    signInAgain,
    startSignIn,
    submitCode,
} from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import ConfirmAction from '@kit/ConfirmAction';
import FormErrors from '@kit/FormErrors';
import Spinner from '@kit/Spinner';
import TextField from '@kit/TextField';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { programName } from './accountLooks';
import { codeDirection, endedMessage, readChallenge } from './signIn';
import type { SignInChallenge } from './signIn';

/**
 * Signs in a new account of a program, named later from who it proved to be, or a saved account again once the owner confirmed that no new
 * start uses it meanwhile and its running work must end first. While its sign-in runs the form shows the
 * challenge read over its own no-store request: Claude Code's address with a field for the code the provider gives
 * back, or Codex's code to enter on the provider's page. A typed code lives only in this form and is cleared once
 * sent, cancelled or left; the sign-in completes on the host, so closing the page loses nothing.
 */
const props = defineProps<{
    program: string;
    accountId: string | null;
    running: SignInAttemptData | undefined;
    ended: SignInAttemptData | undefined;
    methods: SignInMethodData[];
    accountMethod: SignInMethod | null;
}>();

const chosenMethod = ref<SignInMethod>(props.methods[0]?.method ?? 'oauth');
const runningMethod = computed(() =>
    props.methods.find((option) => option.method === props.running?.method),
);
const againLabel = computed(() =>
    props.accountMethod === 'api_key' ? 'Replace key' : 'Sign in again',
);
const secretForm = useForm({ code: '' });

function sendSecret(): void {
    if (props.running === undefined) {
        return;
    }

    const sending = formSendingHooks();

    secretForm.submit(submitCode({ attempt: props.running.id }), {
        preserveScroll: true,
        ...sending,
        onFinish: () => {
            sending.onFinish();
            secretForm.reset();
        },
    });
}

const methodNames: Record<SignInMethod, string> = {
    oauth: 'Sign in with the provider',
    provider_token: 'Provider token',
    api_key: 'API key',
};

const endedNote = computed(() =>
    props.ended === undefined ? null : endedMessage(props.ended),
);

const start = useForm({});
const again = useForm({});
const cancelling = useForm({});
const codeForm = useForm({ code: '' });
const challenge = ref<SignInChallenge>({ address: null, code: null });
const direction = computed(() => codeDirection(props.program));
let timer: ReturnType<typeof setTimeout> | undefined;

function begin(): void {
    start
        .transform(() => ({
            program: props.program,
            method: chosenMethod.value,
            request_key: crypto.randomUUID(),
        }))
        .submit(startSignIn(), { preserveScroll: true, ...formSendingHooks() });
}

function beginAgain(accountId: string): void {
    again
        .transform(() => ({ request_key: crypto.randomUUID() }))
        .submit(signInAgain({ account: accountId }), {
            preserveScroll: true,
            ...formSendingHooks(),
        });
}

async function pollChallenge(attemptId: string): Promise<void> {
    challenge.value = await readChallenge(attemptId);

    if (challenge.value.address === null && props.running?.id === attemptId) {
        timer = setTimeout(() => void pollChallenge(attemptId), 2000);
    }
}

function forgetChallenge(): void {
    clearTimeout(timer);
    challenge.value = { address: null, code: null };
    codeForm.reset();
}

watch(
    () => props.running?.id,
    (attemptId) => {
        forgetChallenge();

        if (attemptId !== undefined) {
            void pollChallenge(attemptId);
        }
    },
    { immediate: true },
);

onBeforeUnmount(forgetChallenge);

function sendCode(): void {
    if (props.running === undefined) {
        return;
    }

    const sending = formSendingHooks();

    codeForm.submit(submitCode({ attempt: props.running.id }), {
        preserveScroll: true,
        ...sending,
        onFinish: () => {
            sending.onFinish();
            codeForm.reset();
        },
    });
}

function cancel(): void {
    if (props.running === undefined) {
        return;
    }

    forgetChallenge();
    cancelling.submit(cancelSignIn({ attempt: props.running.id }), {
        preserveScroll: true,
        ...formSendingHooks(),
    });
}
</script>

<template>
    <div class="flex flex-col gap-2 px-4 py-3">
        <template v-if="running === undefined && accountId === null">
            <form class="flex flex-col gap-2" @submit.prevent="begin">
                <template v-if="methods.length > 1">
                    <fieldset class="flex flex-col gap-1">
                        <legend class="text-small text-text-3">
                            How to sign in
                        </legend>
                        <template
                            v-for="option in methods"
                            :key="option.method"
                        >
                            <label class="flex items-baseline gap-2 text-small">
                                <input
                                    v-model="chosenMethod"
                                    type="radio"
                                    :name="`method-${program}`"
                                    :value="option.method"
                                />
                                <span class="text-text">{{
                                    methodNames[option.method]
                                }}</span>
                                <span class="text-text-3">{{
                                    option.billingNote
                                }}</span>
                            </label>
                        </template>
                    </fieldset>
                </template>
                <Button
                    type="submit"
                    variant="primary"
                    size="small"
                    :pending="start.processing"
                    >Sign in</Button
                >
            </form>
        </template>
        <template v-else-if="running === undefined && accountId !== null">
            <div>
                <ConfirmAction
                    :label="againLabel"
                    :question="`New starts wait and work running on this account must end first. ${againLabel}?`"
                    :confirm-label="againLabel"
                    :pending="again.processing"
                    @confirm="beginAgain(accountId)"
                />
            </div>
        </template>
        <template v-else-if="running?.state === 'checking'">
            <p
                class="flex items-center gap-2 text-small text-text-2"
                role="status"
            >
                <Spinner />
                Checking the sign-in with {{ programName(program) }}…
            </p>
        </template>
        <template v-else-if="running !== undefined && runningMethod?.isSecret">
            <form class="flex items-end gap-2" @submit.prevent="sendSecret">
                <TextField
                    :id="`sign-in-secret-${running.id}`"
                    v-model="secretForm.code"
                    :label="methodNames[running.method]"
                    secret
                    :maxlength="4096"
                    :error="secretForm.errors.code"
                />
                <Button
                    type="submit"
                    variant="primary"
                    size="small"
                    :pending="secretForm.processing"
                    >Send</Button
                >
            </form>
            <div>
                <Button
                    size="small"
                    :pending="cancelling.processing"
                    @click="cancel"
                    >Cancel sign-in</Button
                >
            </div>
        </template>
        <template v-else-if="running !== undefined">
            <template v-if="challenge.address === null">
                <p class="text-small text-text-3">Starting the sign-in…</p>
            </template>
            <template v-else>
                <a
                    :href="challenge.address"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-small text-brand-text underline"
                    >Open the sign-in page</a
                >
                <template v-if="direction === 'outgoing' && challenge.code">
                    <p class="text-small text-text-2">
                        Enter this code there:
                        <span class="font-mono tracking-[0.2em]">{{
                            challenge.code
                        }}</span>
                    </p>
                </template>
                <template v-if="direction === 'paste-back'">
                    <form
                        class="flex items-end gap-2"
                        @submit.prevent="sendCode"
                    >
                        <TextField
                            :id="`sign-in-code-${running.id}`"
                            v-model="codeForm.code"
                            label="Code from the sign-in page"
                            code
                            :maxlength="512"
                            :error="codeForm.errors.code"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            size="small"
                            :pending="codeForm.processing"
                            >Send code</Button
                        >
                    </form>
                </template>
            </template>
            <div>
                <Button
                    size="small"
                    :pending="cancelling.processing"
                    @click="cancel"
                    >Cancel sign-in</Button
                >
            </div>
        </template>
        <template v-if="running === undefined && endedNote !== null">
            <p class="text-small text-text-2" role="status">{{ endedNote }}</p>
            <template
                v-if="
                    ended?.state === 'different_account' && accountId !== null
                "
            >
                <div>
                    <Button
                        size="small"
                        :pending="start.processing"
                        @click="begin"
                        >Add account</Button
                    >
                </div>
            </template>
        </template>
        <FormErrors :errors="start.errors" />
        <FormErrors :errors="again.errors" />
    </div>
</template>
