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
import Spinner from '@kit/Spinner';
import { computed, ref, useId, watch } from 'vue';
import ChooseSignIn from './ChooseSignIn.vue';
import ChosenSignIn from './ChosenSignIn.vue';
import NameAccountStep from './NameAccountStep.vue';
import SignInOutcome from './SignInOutcome.vue';
import SignInTask from './SignInTask.vue';
import { driverName } from './accountLooks';
import { attemptToRejoin, isLive, secretSubmitLabel } from './signIn';
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

/**
 * How the wizard was closed: with its sign-in left waiting, with it cancelled, or with nothing running.
 */
const emit = defineEmits<{
    close: [
        ending: 'waiting' | 'cancelled' | 'renewed' | 'shown' | 'closed',
        accountId?: string,
    ];
}>();

const driver = ref('claude-code');
const method = ref<SignInMethod | null>(null);
const followedId = ref<string | null>(null);
const awaited = ref<{ driver: string; accountId: string | null } | null>(null);
const isAskingToClose = ref(false);
const followed = computed(() =>
    props.attempts.find((attempt) => attempt.id === followedId.value),
);
const actions = signInActions(followed);
const formId = `add-account-step-${useId()}`;

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

/**
 * The row the sign-in made, renewed or matched, found only by the id the server gave the attempt.
 */
const resultRow = computed(() => {
    const accountId = followed.value?.resultAccountId ?? null;

    return props.rows.find((row) => row.id === accountId);
});
const accountName = computed(() => resultRow.value?.label ?? null);
const accountIdentity = computed(() => resultRow.value?.identity ?? null);

/**
 * The account a key or token, or a login that named no email, just added, while it still waits for its name: such a
 * sign-in has no email to name it by.
 */
const namedAccountId = ref<string | null>(null);
const accountToName = computed(() => {
    if (
        followed.value?.state !== 'complete' ||
        followed.value.type !== 'new_account' ||
        resultRow.value === undefined ||
        resultRow.value.id === namedAccountId.value
    ) {
        return undefined;
    }

    const hasNoEmail = resultRow.value.identity === null;

    return shownMethod.value?.isSecret === true || hasNoEmail
        ? resultRow.value
        : undefined;
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

watch(
    () => actions.reconnected.value,
    (receipt) => {
        if (receipt?.attemptId) {
            followedId.value = receipt.attemptId;
            awaited.value = null;
        }
    },
);

watch(
    () => actions.start.errors,
    (errors) => {
        if (Object.keys(errors).length > 0) {
            awaited.value = null;
        }
    },
);

/**
 * A sign-in of another method already running for the program, such as a subscription sign-in while a key was
 * asked for in another tab: it shows with Resume or Cancel before it takes any input.
 */
const isOtherMethodRunning = computed(
    () =>
        followed.value !== undefined &&
        isLive(followed.value) &&
        method.value !== null &&
        followed.value.method !== method.value,
);

/**
 * Why the last start did not begin a sign-in, shown under the choice it was made with.
 */
const startRefusal = computed(
    () => Object.values(actions.start.errors)[0] as string | undefined,
);

function resume(): void {
    method.value = followed.value?.method ?? method.value;
}

function cancelAndChooseAgain(): void {
    if (followed.value !== undefined) {
        actions.cancel(followed.value.id);
    }

    chooseAnotherWay();
}

/**
 * Start again after an ended sign-in: a renewal renews the same account again, a new account starts a new sign-in.
 */
function startAgain(ended: SignInAttemptData): void {
    if (ended.type === 'new_account' || ended.accountId === null) {
        begin(ended.driver, ended.method);

        return;
    }

    followedId.value = null;
    awaited.value = { driver: ended.driver, accountId: ended.accountId };
    actions.beginAgain(ended.accountId);
}

function begin(of: string, chosen: SignInMethod): void {
    followedId.value = null;
    driver.value = of;
    method.value = chosen;
    awaited.value = { driver: of, accountId: null };
    actions.begin(of, chosen);
}

/**
 * Starts the chosen sign-in once: a second press while that start is pending starts nothing.
 */
function continueWithChoice(): void {
    if (method.value !== null && awaited.value === null) {
        begin(driver.value, method.value);
    }
}

/**
 * Back during a live task cancels it and returns to the choice once the host acknowledges the cancel; a refused or
 * lost cancel keeps the task where it was.
 */
function back(): void {
    if (followed.value === undefined || !isLive(followed.value)) {
        chooseAnotherWay();

        return;
    }

    actions.cancel(followed.value.id, (isCancelled) => {
        if (isCancelled) {
            chooseAnotherWay();
        }
    });
}

function chooseAnotherWay(): void {
    followedId.value = null;
    awaited.value = null;
}

function addAnother(): void {
    chooseAnotherWay();
    method.value = null;
}

/**
 * Closes on the account a duplicate sign-in matched, so it can be renewed from its own row.
 */
function showAccount(accountId: string): void {
    actions.forget();
    emit('close', 'shown', accountId);
}

function close(): void {
    const ended = followed.value;
    actions.forget();

    if (ended !== undefined && isLive(ended)) {
        emit('close', 'waiting');

        return;
    }

    if (
        ended?.state === 'complete' &&
        ended.type === 'sign_in_again' &&
        ended.accountId !== null
    ) {
        emit('close', 'renewed', ended.accountId);

        return;
    }

    emit('close', 'closed');
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

/**
 * Cancel sign-in on closing: the wizard closes once the host acknowledges the cancel, and stays asking otherwise.
 */
function cancelAndClose(): void {
    if (followed.value === undefined) {
        close();

        return;
    }

    actions.cancel(followed.value.id, (isCancelled) => {
        if (isCancelled) {
            actions.forget();
            emit('close', 'cancelled');
        }
    });
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
            <template v-if="startRefusal !== undefined">
                <p class="text-small text-danger" role="alert">
                    {{ startRefusal }}
                </p>
            </template>
        </template>
        <template v-else-if="step === 2 && actions.cancelling.processing">
            <div
                class="flex flex-1 flex-col items-center justify-center gap-3 pb-3 text-center"
                role="status"
            >
                <Spinner large class="text-brand" />
                <p class="text-field text-text-2">Cancelling the sign-in…</p>
            </div>
        </template>
        <template v-else-if="step === 2 && isOtherMethodRunning">
            <ChosenSignIn :driver="shownDriver" :method="shownMethod!" />
            <div
                class="flex flex-1 flex-col items-center justify-center gap-3 pb-3 text-center"
                role="status"
            >
                <h4 class="mt-1 font-semibold text-card text-text">
                    This sign-in is already running
                </h4>
                <p class="max-w-[340px] text-field leading-relaxed text-text-2">
                    Only one new {{ driverName(shownDriver) }} account signs in
                    at a time. Resume this one, or cancel it and choose again.
                </p>
            </div>
        </template>
        <template v-else-if="step === 2 && actions.isReconnecting.value">
            <div
                class="flex flex-1 flex-col items-center justify-center gap-3 pb-3 text-center"
                role="status"
            >
                <Spinner large class="text-brand" />
                <p class="text-field text-text-2">
                    Reconnecting to the sign-in…
                </p>
            </div>
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
                :account-identity="accountIdentity"
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
                    >{{
                        actions.cancelling.processing
                            ? 'Cancelling…'
                            : 'Cancel sign-in'
                    }}</Button
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
            <template v-else-if="step === 2 && isOtherMethodRunning">
                <Button
                    :pending="actions.cancelling.processing"
                    @click="cancelAndChooseAgain"
                    >Cancel sign-in</Button
                >
                <span class="flex-1" />
                <Button variant="primary" @click="resume">Resume</Button>
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
                            followed?.state !== 'waiting' ||
                            followed.isWaitingForAgents ||
                            actions.answer.code === ''
                        "
                        :pending="actions.answer.processing"
                        >{{ secretSubmitLabel(followed) }}</Button
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
            <template
                v-else-if="
                    followed?.state === 'already_added' &&
                    followed.resultAccountId !== null
                "
            >
                <Button @click="chooseAnotherWay">Choose another way</Button>
                <span class="flex-1" />
                <Button
                    variant="primary"
                    @click="showAccount(followed.resultAccountId)"
                    >Show the account</Button
                >
            </template>
            <template v-else-if="followed?.state === 'already_added'">
                <span class="flex-1" />
                <Button variant="primary" @click="close"
                    >Back to Accounts</Button
                >
            </template>
            <template
                v-else-if="
                    followed?.state === 'different_account' ||
                    followed?.state === 'unverified'
                "
            >
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
                    :pending="
                        actions.start.processing || actions.again.processing
                    "
                    @click="startAgain(followed)"
                    >Start again</Button
                >
            </template>
        </template>
    </Modal>
</template>
