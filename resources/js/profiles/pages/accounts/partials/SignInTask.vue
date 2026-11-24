<script setup lang="ts">
import type {
    SignInAttemptData,
    SignInMethodData,
} from '@generated/types/accounts';
import Button from '@kit/Button';
import Spinner from '@kit/Spinner';
import Field from '@kit/Field';
import { computed, ref, useId, watch } from 'vue';
import ChosenSignIn from './ChosenSignIn.vue';
import { codeDirection } from '../../../signIn';
import type { SignInActions } from '../../../signInActions';

/**
 * The wizard's second step, the chosen method's own task: Claude Code's sign-in page and the code it gives back,
 * Codex's code to enter on OpenAI's page, or the token or key a secret method takes, with where to get it. Until the
 * host has the sign-in page ready, it shows that the sign-in is starting. The form is sent by the footer's button.
 */
const props = defineProps<{
    driver: string;
    method: SignInMethodData;
    attempt: SignInAttemptData | undefined;
    actions: SignInActions;
    formId: string;
}>();

const direction = computed(() => codeDirection(props.driver));

/**
 * The task waits until the host has the sign-in ready: a renewal first waits for the agents running on the account,
 * a key or token for the attempt to wait for it, and a browser sign-in also for its page.
 */
const isWaitingForAgents = computed(
    () => props.attempt?.isWaitingForAgents === true,
);
// An attempt that was completed, cancelled or expired stops its progress: nothing more happens on the host.
const endedWords: Record<string, string> = {
    complete: 'This sign-in is complete.',
    cancelled: 'This sign-in was cancelled.',
    expired: 'This sign-in expired. Start it again to continue.',
};
const endedText = computed(() => (props.attempt === undefined ? null : (endedWords[props.attempt.state] ?? null)));
const isStarting = computed(
    () =>
        props.attempt === undefined ||
        isWaitingForAgents.value ||
        (props.method.isSecret
            ? props.attempt.state !== 'waiting'
            : props.actions.challenge.value.address === null),
);

const host = computed(() => {
    const address = props.actions.challenge.value.address;

    return address === null ? '' : new URL(address).host;
});

const fieldId = useId();

/**
 * What the copy button last did: copied, or refused by the browser, in which case the whole link is shown to select
 * by hand. It is forgotten when the attempt or its link changes.
 */
const copied = ref<'copied' | 'refused' | null>(null);

watch(
    () => [props.attempt?.id, props.actions.challenge.value.address],
    () => (copied.value = null),
);

async function copy(text: string | null): Promise<void> {
    if (text === null) {
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        copied.value = 'copied';
    } catch {
        copied.value = 'refused';
    }
}

/**
 * The most bytes an answer takes once its outer spaces are trimmed: a code 512, a key or token 4096. The whole paste
 * is measured, never cut to fit, and one past the bound is refused here with nothing sent.
 */
const answerByteLimit = computed(() => (props.method.isSecret ? 4096 : 512));

function send(): void {
    if (props.attempt === undefined) {
        return;
    }

    const bytes = new TextEncoder().encode(
        props.actions.answer.code.trim(),
    ).length;

    if (bytes === 0 || bytes > answerByteLimit.value) {
        props.actions.answer.setError(
            'code',
            `Paste the whole ${props.method.isSecret ? 'key or token' : 'code'}: it takes 1 to ${answerByteLimit.value} bytes.`,
        );

        return;
    }

    props.actions.send(props.attempt.id);
}

const openLink =
    'inline-flex h-6 items-center rounded-button border border-border-2 px-[9px] text-small text-text-2 hover:bg-hover hover:text-text';
</script>

<template>
    <ChosenSignIn :driver="driver" :method="method" />
    <template v-if="endedText !== null">
        <p class="flex flex-1 items-center justify-center pb-3 text-center text-field text-text-2" role="status">
            {{ endedText }}
        </p>
    </template>
    <template v-else-if="actions.challengeRead.value === 'failed'">
        <div
            class="flex flex-1 flex-col items-center justify-center gap-3 pb-3 text-center"
            role="alert"
        >
            <p class="text-field text-text-2">
                Could not reach the journal for this sign-in. It keeps waiting
                on the host.
            </p>
            <Button size="small" @click="actions.retryChallenge()"
                >Retry</Button
            >
        </div>
    </template>
    <template v-else-if="isStarting">
        <div
            class="flex flex-1 flex-col items-center justify-center gap-3 pb-3 text-center"
            role="status"
        >
            <Spinner large class="text-brand" />
            <p class="text-field text-text-2">
                {{
                    isWaitingForAgents
                        ? 'Waiting for running agents to finish…'
                        : 'Starting the sign-in…'
                }}
            </p>
            <template v-if="attempt?.isUnclaimed">
                <p class="max-w-[340px] text-small leading-relaxed text-text-3" role="alert">
                    No sign-in service has picked this up yet. The journal's sign-in service is not running or cannot
                    reach the journal; start it again and this sign-in continues.
                </p>
            </template>
        </div>
    </template>
    <template v-else-if="method.isSecret">
        <form
            :id="formId"
            class="flex flex-1 flex-col gap-4"
            @submit.prevent="send"
        >
            <template v-if="method.secretSource">
                <p
                    class="rounded-field bg-raised px-3.5 py-3 text-small leading-relaxed text-text-2"
                >
                    <b class="font-medium text-text">Where to get it.</b>
                    {{ method.secretSource }}
                </p>
            </template>
            <template v-if="actions.isAnswerLost.value">
                <p class="text-small text-text-2" role="alert">
                    Your last answer did not arrive. Paste it again.
                </p>
            </template>
            <Field
                :id="`sign-in-secret-${fieldId}`"
                v-model="actions.answer.code"
                :label="method.title"
                secret
                hint="Kept on the host only and never shown again."
                :error="actions.answer.errors.code"
            />
            <div class="flex-1" />
            <p class="text-meta leading-normal text-text-3">
                {{ method.billingNote }}
            </p>
        </form>
    </template>
    <template v-else-if="direction === 'outgoing'">
        <ol class="m-0 pl-[18px] text-field leading-[1.75] text-text-2">
            <li>Open OpenAI's page and sign in with ChatGPT.</li>
            <li>Enter this code there when it asks.</li>
        </ol>
        <div
            class="h-[68px] rounded-field border border-dashed border-border-3 bg-code-bg text-center font-mono text-[26px] leading-[68px] tracking-[0.28em] text-text"
            data-device-code
        >
            {{ actions.challenge.value.code }}
        </div>
        <div
            class="flex h-10 items-center gap-2 rounded-field border border-border-2 bg-raised pr-1.5 pl-3"
        >
            <span class="flex-1 text-field text-text-2"
                >{{ host }}
                <span class="text-text-3">· device sign-in</span></span
            >
            <Button size="small" @click="copy(actions.challenge.value.code)"
                >Copy code</Button
            >
            <a
                :href="actions.challenge.value.address ?? undefined"
                target="_blank"
                rel="noopener noreferrer"
                :class="openLink"
                >Open ↗</a
            >
        </div>
        <div class="flex-1" />
        <p class="flex items-center gap-2 text-small text-text-2" role="status">
            <Spinner />Waiting for you to finish on OpenAI's page…
        </p>
    </template>
    <template v-else>
        <form
            :id="formId"
            class="flex flex-1 flex-col gap-4"
            @submit.prevent="send"
        >
            <ol class="m-0 pl-[18px] text-field leading-[1.75] text-text-2">
                <li>Open Claude's sign-in page and sign in.</li>
                <li>Copy the code the page shows when you are done.</li>
                <li>Paste it below and send it.</li>
            </ol>
            <div
                class="flex h-10 items-center gap-2 rounded-field border border-border-2 bg-raised pr-1.5 pl-3"
            >
                <span class="flex-1 text-field text-text-2"
                    >{{ host }}
                    <span class="text-text-3">· sign-in page</span></span
                >
                <Button
                    size="small"
                    @click="copy(actions.challenge.value.address)"
                    >Copy link</Button
                >
                <a
                    :href="actions.challenge.value.address ?? undefined"
                    target="_blank"
                    rel="noopener noreferrer"
                    :class="openLink"
                    >Open ↗</a
                >
            </div>
            <template v-if="copied === 'refused'">
                <p class="text-small text-text-2" role="alert">
                    Copy failed. Select the link below and copy it yourself.
                </p>
                <Field
                    :id="`sign-in-link-${fieldId}`"
                    :model-value="actions.challenge.value.address ?? ''"
                    label="Link to Claude's sign-in page"
                    readonly
                />
            </template>
            <template v-else-if="copied === 'copied'">
                <p class="text-small text-text-2" role="status">Link copied.</p>
            </template>
            <template v-if="actions.isAnswerLost.value">
                <p class="text-small text-text-2" role="alert">
                    Your last code did not arrive. Paste it again.
                </p>
            </template>
            <Field
                :id="`sign-in-code-${fieldId}`"
                v-model="actions.answer.code"
                label="Code from the sign-in page"
                code
                hint="One piece of text, without spaces."
                :error="actions.answer.errors.code"
            />
            <div class="flex-1" />
            <p class="text-meta leading-normal text-text-3">
                You can close this window: the sign-in keeps waiting on the
                host. Resume it from the Accounts header.
            </p>
        </form>
    </template>
</template>
