<script setup lang="ts">
import type {
    AccountRowData,
    DriverMethodsData,
    SignInAttemptData,
    SignInMethod,
    SignInMethodData,
} from '@generated/types/accounts';
import Button from '@kit/Button';
import Modal from '@kit/Modal';
import { computed, ref, watch } from 'vue';
import ChooseSignIn from './ChooseSignIn.vue';
import ChosenSignIn from './ChosenSignIn.vue';
import NameAccountStep from './NameAccountStep.vue';
import SignInOutcome from './SignInOutcome.vue';
import SignInTask from './SignInTask.vue';
import { attemptToRejoin, isLive } from './signIn';
import type { WizardRequest } from './signIn';
import { signInActions } from './signInActions';

/**
 * Adds an account in a modal of three steps: choose how to sign in, do that method's one task, and wait for the
 * check. It follows one sign-in attempt through the page's reloads; the sign-in completes on the host, so closing the
 * window loses nothing, and closing during the second step first asks whether to keep the sign-in waiting.
 */
const props = defineProps<{
    request: WizardRequest | null;
    methods: DriverMethodsData[];
    attempts: SignInAttemptData[];
    rows: AccountRowData[];
}>();

const emit = defineEmits<{ close: [] }>();

const driver = ref('claude-code');
const method = ref<SignInMethod | null>(null);
const followedId = ref<string | null>(null);
const awaited = ref<{ driver: string; accountId: string | null } | null>(null);
const isAskingToClose = ref(false);
const followed = computed(() =>
    props.attempts.find((attempt) => attempt.id === followedId.value),
);
const actions = signInActions(followed);
const formId = 'add-account-step';

function methodsOf(of: string): SignInMethodData[] {
    return props.methods.find((entry) => entry.driver === of)?.methods ?? [];
}

const shownDriver = computed(() => followed.value?.driver ?? driver.value);
const shownMethod = computed(() =>
    methodsOf(shownDriver.value).find(
        (option) => option.method === (followed.value?.method ?? method.value),
    ),
);

/**
 * Which step shows: the task while a sign-in starts or waits, the outcome once it is checked or has ended, else the
 * choice. A sign-in the user cancelled with Back returns to the choice.
 */
const step = computed<1 | 2 | 3>(() => {
    if (followed.value === undefined) {
        return awaited.value === null ? 1 : 2;
    }

    if (
        followed.value.state === 'starting' ||
        followed.value.state === 'waiting'
    ) {
        return 2;
    }

    return 3;
});

const accountName = computed(() => {
    const accountId = followed.value?.resultAccountId ?? null;

    return props.rows.find((row) => row.id === accountId)?.label ?? null;
});

/**
 * The account a key or token just added, while it still waits for its name: such a sign-in has no email to name it by.
 */
const namedAccountId = ref<string | null>(null);
const accountToName = computed(() => {
    const accountId = followed.value?.resultAccountId ?? null;

    if (
        followed.value?.state !== 'complete' ||
        shownMethod.value?.isSecret !== true ||
        accountId === namedAccountId.value
    ) {
        return undefined;
    }

    return props.rows.find((row) => row.id === accountId);
});

function markNamed(): void {
    namedAccountId.value = followed.value?.resultAccountId ?? null;
}

watch(
    () => props.request,
    (request) => {
        isAskingToClose.value = false;
        namedAccountId.value = null;
        followedId.value = null;
        awaited.value = null;
        method.value = null;

        if (request?.kind === 'resume') {
            followedId.value = request.attemptId;
        }

        if (request?.kind === 'again') {
            driver.value = request.driver;
            awaited.value = {
                driver: request.driver,
                accountId: request.accountId,
            };
            actions.beginAgain(request.accountId);
        }
    },
    { immediate: true },
);

watch(
    () => props.attempts,
    (attempts) => {
        if (awaited.value === null) {
            return;
        }

        const started = attemptToRejoin(
            attempts,
            awaited.value.driver,
            awaited.value.accountId,
        );

        if (started !== undefined) {
            followedId.value = started.id;
            awaited.value = null;
        }
    },
);

function begin(of: string, chosen: SignInMethod): void {
    followedId.value = null;
    driver.value = of;
    method.value = chosen;
    awaited.value = { driver: of, accountId: null };
    actions.begin(of, chosen);
}

function continueWithChoice(): void {
    if (method.value !== null) {
        begin(driver.value, method.value);
    }
}

function back(): void {
    if (followed.value !== undefined && isLive(followed.value)) {
        actions.cancel(followed.value.id);
    }

    followedId.value = null;
    awaited.value = null;
}

function chooseAnotherWay(): void {
    followedId.value = null;
    awaited.value = null;
}

function addAnother(): void {
    chooseAnotherWay();
    method.value = null;
}

function close(): void {
    actions.forget();
    emit('close');
}

/**
 * The close button and Escape: during the second step they first ask whether to keep the sign-in waiting.
 */
function askToClose(): void {
    if (
        step.value === 2 &&
        followed.value !== undefined &&
        !isAskingToClose.value
    ) {
        isAskingToClose.value = true;

        return;
    }

    close();
}

function cancelAndClose(): void {
    if (followed.value !== undefined) {
        actions.cancel(followed.value.id);
    }

    close();
}
</script>

<template>
    <Modal
        :is-open="request !== null"
        title="Add an account"
        :step-count="3"
        :step="step"
        @close="askToClose"
    >
        <template v-if="isAskingToClose && shownMethod !== undefined">
            <ChosenSignIn :driver="shownDriver" :method="shownMethod" />
            <div
                class="flex flex-1 flex-col items-center justify-center gap-3 pb-3 text-center"
            >
                <span
                    class="flex size-10 items-center justify-center rounded-full bg-chip text-lg font-semibold text-text-3"
                    >?</span
                >
                <h4 class="mt-1 font-semibold text-card text-text">
                    Keep the sign-in waiting?
                </h4>
                <p class="max-w-[340px] text-field leading-relaxed text-text-2">
                    It waits on the host until it expires. Resume it from the
                    Accounts header, or cancel it now.
                </p>
            </div>
        </template>
        <template v-else-if="step === 1">
            <ChooseSignIn
                v-model:driver="driver"
                v-model:method="method"
                :methods="methods"
                @confirm="continueWithChoice"
            />
        </template>
        <template v-else-if="step === 2 && shownMethod !== undefined">
            <SignInTask
                :driver="shownDriver"
                :method="shownMethod"
                :attempt="followed"
                :actions="actions"
                :form-id="formId"
            />
        </template>
        <template
            v-else-if="accountToName !== undefined && shownMethod !== undefined"
        >
            <NameAccountStep
                :driver="shownDriver"
                :method="shownMethod"
                :account="accountToName"
                :form-id="formId"
                @named="markNamed"
            />
        </template>
        <template
            v-else-if="followed !== undefined && shownMethod !== undefined"
        >
            <SignInOutcome
                :driver="shownDriver"
                :method="shownMethod"
                :attempt="followed"
                :account-name="accountName"
            />
        </template>
        <template #footer>
            <template v-if="isAskingToClose">
                <Button @click="isAskingToClose = false">← Stay</Button>
                <span class="flex-1" />
                <Button
                    variant="bordered"
                    :pending="actions.cancelling.processing"
                    @click="cancelAndClose"
                    >{{ actions.cancelling.processing ? 'Cancelling…' : 'Cancel sign-in' }}</Button
                >
                <Button variant="primary" @click="close">Keep waiting</Button>
            </template>
            <template v-else-if="step === 1">
                <span class="flex-1" />
                <Button @click="close">Cancel</Button>
                <Button
                    variant="primary"
                    :disabled="method === null"
                    :pending="actions.start.processing"
                    @click="continueWithChoice"
                    >Continue</Button
                >
            </template>
            <template v-else-if="step === 2">
                <Button :pending="actions.cancelling.processing" @click="back"
                    >← Back</Button
                >
                <span class="flex-1" />
                <template v-if="shownMethod?.isSecret">
                    <Button
                        type="submit"
                        :form="formId"
                        variant="primary"
                        :disabled="
                            followed === undefined || actions.answer.code === ''
                        "
                        :pending="actions.answer.processing"
                        >Add account</Button
                    >
                </template>
                <template v-else-if="shownDriver === 'codex'">
                    <span class="pr-2 text-small whitespace-nowrap text-text-3"
                        >Continues on its own</span
                    >
                </template>
                <template v-else>
                    <Button
                        type="submit"
                        :form="formId"
                        variant="primary"
                        :disabled="
                            followed === undefined ||
                            actions.challenge.value.address === null
                        "
                        :pending="actions.answer.processing"
                        >Send code</Button
                    >
                </template>
            </template>
            <template v-else-if="followed?.state === 'checking'">
                <span class="flex-1" />
                <Button @click="close">Close</Button>
            </template>
            <template v-else-if="accountToName !== undefined">
                <span class="flex-1" />
                <Button type="submit" :form="formId" variant="primary"
                    >Save</Button
                >
            </template>
            <template v-else-if="followed?.state === 'complete'">
                <Button @click="addAnother">Add another</Button>
                <span class="flex-1" />
                <Button variant="primary" @click="close">Done</Button>
            </template>
            <template v-else-if="followed?.state === 'already_added'">
                <Button @click="chooseAnotherWay">Choose another way</Button>
                <span class="flex-1" />
                <Button variant="primary" @click="close"
                    >Show the account</Button
                >
            </template>
            <template v-else-if="followed?.state === 'different_account'">
                <span class="flex-1" />
                <Button
                    variant="primary"
                    :pending="actions.start.processing"
                    @click="begin(followed.driver, followed.method)"
                    >Add it as a new account</Button
                >
            </template>
            <template v-else-if="followed !== undefined">
                <Button @click="chooseAnotherWay">Choose another way</Button>
                <span class="flex-1" />
                <Button
                    variant="primary"
                    :pending="actions.start.processing"
                    @click="begin(followed.driver, followed.method)"
                    >Start again</Button
                >
            </template>
        </template>
    </Modal>
</template>
