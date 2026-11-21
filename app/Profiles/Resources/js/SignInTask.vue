<script setup lang="ts">
import type {
    SignInAttemptData,
    SignInMethodData,
} from '@generated/types/accounts';
import Button from '@kit/Button';
import Spinner from '@kit/Spinner';
import TextField from '@kit/TextField';
import { computed } from 'vue';
import ChosenSignIn from './ChosenSignIn.vue';
import { codeDirection } from './signIn';
import type { SignInActions } from './signInActions';

/**
 * The wizard's second step, the chosen method's own task: Claude Code's sign-in page and the code it gives back,
 * Codex's code to enter on OpenAI's page, or the token or key a secret method takes, with where to get it. Until the
 * host has the sign-in page ready, it shows that the sign-in is starting. The form is sent by the footer's button.
 */
const props = defineProps<{
    program: string;
    method: SignInMethodData;
    attempt: SignInAttemptData | undefined;
    actions: SignInActions;
    formId: string;
}>();

const direction = computed(() => codeDirection(props.program));

const isStarting = computed(
    () =>
        props.attempt === undefined ||
        (!props.method.isSecret &&
            props.actions.challenge.value.address === null),
);

const host = computed(() => {
    const address = props.actions.challenge.value.address;

    return address === null ? '' : new URL(address).host;
});

function copy(text: string | null): void {
    if (text !== null) {
        void navigator.clipboard.writeText(text);
    }
}

function send(): void {
    if (props.attempt !== undefined) {
        props.actions.send(props.attempt.id);
    }
}

const openLink =
    'inline-flex h-6 items-center rounded-button border border-border-2 px-[9px] text-small text-text-2 hover:bg-hover hover:text-text';
</script>

<template>
    <ChosenSignIn :program="program" :method="method" />
    <template v-if="isStarting">
        <div
            class="flex flex-1 flex-col items-center justify-center gap-3 pb-3 text-center"
            role="status"
        >
            <Spinner large class="text-brand" />
            <p class="text-field text-text-2">Starting the sign-in…</p>
        </div>
    </template>
    <template v-else-if="method.isSecret">
        <form
            :id="formId"
            class="flex flex-1 flex-col gap-4"
            @submit.prevent="send"
        >
            <template v-if="method.whereToGetIt">
                <p
                    class="rounded-field bg-raised px-3.5 py-3 text-small leading-relaxed text-text-2"
                >
                    <b class="font-medium text-text">Where to get it.</b>
                    {{ method.whereToGetIt }}
                </p>
            </template>
            <TextField
                :id="`sign-in-secret-${attempt?.id}`"
                v-model="actions.answer.code"
                :label="method.cardTitle"
                secret
                :maxlength="4096"
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
            <TextField
                :id="`sign-in-code-${attempt?.id}`"
                v-model="actions.answer.code"
                label="Code from the sign-in page"
                code
                :maxlength="512"
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
