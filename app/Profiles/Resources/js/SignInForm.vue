<script setup lang="ts">
import type { SignInAttemptData } from '@generated/types/accounts';
import { cancelSignIn, signInAgain, startSignIn, submitCode } from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import Button from '@kit/Button';
import ConfirmAction from '@kit/ConfirmAction';
import FormErrors from '@kit/FormErrors';
import TextField from '@kit/TextField';
import { formSendingHooks } from '@kit/usePageChanges';
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { codeDirection, readChallenge } from './signIn';
import type { SignInChallenge } from './signIn';

/**
 * Signs in a new account of a program under a name, or a saved account again once the owner confirmed that no new
 * start uses it meanwhile and its running work must end first. While its sign-in runs the form shows the
 * challenge read over its own no-store request: Claude Code's address with a field for the code the provider gives
 * back, or Codex's code to enter on the provider's page. A typed code lives only in this form and is cleared once
 * sent, cancelled or left; the sign-in completes on the host, so closing the page loses nothing.
 */
const props = defineProps<{
    program: string;
    accountId: string | null;
    running: SignInAttemptData | undefined;
}>();

const start = useForm({ label: '' });
const again = useForm({});
const cancelling = useForm({});
const codeForm = useForm({ code: '' });
const challenge = ref<SignInChallenge>({ address: null, code: null });
const direction = computed(() => codeDirection(props.program));
let timer: ReturnType<typeof setTimeout> | undefined;

function begin(): void {
    start
        .transform((fields) => ({
            program: props.program,
            request_key: crypto.randomUUID(),
            label: fields.label,
        }))
        .submit(startSignIn(), { preserveScroll: true, ...formSendingHooks() });
}

function beginAgain(accountId: string): void {
    again
        .transform(() => ({ request_key: crypto.randomUUID() }))
        .submit(signInAgain({ account: accountId }), { preserveScroll: true, ...formSendingHooks() });
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
    cancelling.submit(cancelSignIn({ attempt: props.running.id }), { preserveScroll: true, ...formSendingHooks() });
}
</script>

<template>
    <div class="flex flex-col gap-2 px-4 py-3">
        <form
            v-if="running === undefined && accountId === null"
            class="flex items-end gap-2"
            @submit.prevent="begin"
        >
            <TextField
                :id="`new-account-${program}`"
                v-model="start.label"
                label="Account name"
                :maxlength="80"
                :error="start.errors.label"
            />
            <Button type="submit" variant="primary" size="small" :pending="start.processing">Sign in</Button>
        </form>
        <div v-else-if="running === undefined && accountId !== null">
            <ConfirmAction
                label="Sign in again"
                question="New starts wait and work running on this account must end first. Sign in again?"
                confirm-label="Sign in again"
                :pending="again.processing"
                @confirm="beginAgain(accountId)"
            />
        </div>
        <template v-else-if="running !== undefined">
            <p v-if="challenge.address === null" class="text-small text-text-3">Starting the sign-in…</p>
            <template v-else>
                <a
                    :href="challenge.address"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-small text-brand-text underline"
                    >Open the sign-in page</a
                >
                <p v-if="direction === 'outgoing' && challenge.code" class="text-small text-text-2">
                    Enter this code there: <span class="font-mono tracking-[0.2em]">{{ challenge.code }}</span>
                </p>
                <form v-if="direction === 'paste-back'" class="flex items-end gap-2" @submit.prevent="sendCode">
                    <TextField
                        :id="`sign-in-code-${running.id}`"
                        v-model="codeForm.code"
                        label="Code from the sign-in page"
                        code
                        :maxlength="512"
                        :error="codeForm.errors.code"
                    />
                    <Button type="submit" variant="primary" size="small" :pending="codeForm.processing"
                        >Send code</Button
                    >
                </form>
            </template>
            <div>
                <Button size="small" :pending="cancelling.processing" @click="cancel">Cancel sign-in</Button>
            </div>
        </template>
        <FormErrors :errors="start.errors" />
        <FormErrors :errors="again.errors" />
    </div>
</template>
