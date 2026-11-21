import type {
    SignInAttemptData,
    SignInMethod,
    SignInReceiptData,
} from '@generated/types/accounts';
import {
    cancelSignIn,
    signInAgain,
    startSignIn,
    submitCode,
} from '@generated/routes/accounts';
import { useForm } from '@inertiajs/vue3';
import { formSendingHooks } from '@kit/usePageChanges';
import type { Ref } from 'vue';
import { onBeforeUnmount, ref, watch } from 'vue';
import { readChallenge, readReceipt } from './signIn';
import type { SignInChallenge } from './signIn';

/**
 * How each wizard request reloads after it: only the page's own data, keeping the page and the open wizard as they are.
 */
const KEEP_THE_WIZARD = {
    only: ['page'],
    preserveScroll: true,
    preserveState: true,
};

/**
 * What the add-account wizard does with a sign-in: start one for a new account or an account again, send the code
 * or the secret the attempt waits for, and cancel it. While the followed attempt runs, its challenge is read over its
 * own no-store request every 2 s until it is there. A typed code or secret lives only here and is cleared once sent,
 * cancelled or left.
 */
export function signInActions(followed: Ref<SignInAttemptData | undefined>) {
    const start = useForm({ method: '' });
    const again = useForm({});
    const cancelling = useForm({});
    const answer = useForm({ code: '' });
    const challenge = ref<SignInChallenge>({ address: null, code: null });
    let timer: ReturnType<typeof setTimeout> | undefined;

    /**
     * A new account's start whose reply was lost: its request key is read back until the receipt says what became of
     * it. Only a receipt that knows of no start lets the same start be sent again, under the same key.
     */
    const isReconnecting = ref(false);
    const reconnected = ref<SignInReceiptData | null>(null);
    let lastStart: {
        key: string;
        driver: string;
        method: SignInMethod;
        isAbsent: boolean;
    } | null = null;
    let receiptTimer: ReturnType<typeof setTimeout> | undefined;

    async function reconnect(key: string, driver: string): Promise<void> {
        const receipt = await readReceipt(key, driver);

        if (lastStart?.key !== key) {
            return;
        }

        if (receipt === null || receipt.status === 'pending') {
            receiptTimer = setTimeout(() => void reconnect(key, driver), 2000);

            return;
        }

        isReconnecting.value = false;

        if (receipt.status === 'started') {
            reconnected.value = receipt;

            return;
        }

        if (receipt.status === 'refused') {
            start.setError(
                'method',
                receipt.refusal ?? 'The sign-in could not start.',
            );

            return;
        }

        lastStart.isAbsent = true;
        start.setError(
            'method',
            'The sign-in did not start. Continue to try again.',
        );
    }

    /**
     * Counts every begin, cancel and leave; a challenge read is shown only while its count and its attempt are still
     * the current ones, so a late answer for a cancelled or replaced attempt never shows.
     */
    let generation = 0;

    async function pollChallenge(
        attemptId: string,
        asked = generation,
    ): Promise<void> {
        const read = await readChallenge(attemptId);

        if (asked !== generation || followed.value?.id !== attemptId) {
            return;
        }

        challenge.value = read;

        if (read.address === null) {
            timer = setTimeout(
                () => void pollChallenge(attemptId, asked),
                2000,
            );
        }
    }

    function forget(): void {
        generation++;
        clearTimeout(timer);
        challenge.value = { address: null, code: null };
        answer.reset();
        answer.clearErrors();
    }

    watch(
        () => followed.value?.state,
        (state) => {
            if (
                state !== undefined &&
                !['starting', 'waiting', 'checking'].includes(state)
            ) {
                clearTimeout(timer);
                challenge.value = { address: null, code: null };
            }
        },
    );

    watch(
        () => followed.value?.id,
        (attemptId) => {
            forget();

            if (attemptId !== undefined) {
                void pollChallenge(attemptId);
            }
        },
        { immediate: true },
    );

    onBeforeUnmount(() => {
        forget();
        lastStart = null;
        clearTimeout(receiptTimer);
    });

    /**
     * Starts a new account's sign-in. A start the receipt said never happened goes again under its own key; any other
     * start gets a new one. A reply that never comes reconnects through the receipt.
     */
    function begin(driver: string, method: SignInMethod): void {
        generation++;
        clearTimeout(receiptTimer);
        const isRetry =
            lastStart?.isAbsent === true &&
            lastStart.driver === driver &&
            lastStart.method === method;
        const key =
            isRetry && lastStart !== null ? lastStart.key : crypto.randomUUID();
        lastStart = { key, driver, method, isAbsent: false };
        reconnected.value = null;
        start.clearErrors();
        const sending = formSendingHooks();
        let isAnswered = false;

        start
            .transform(() => ({ driver, method }))
            .submit(startSignIn(), {
                ...KEEP_THE_WIZARD,
                headers: { 'Idempotency-Key': key },
                ...sending,
                onSuccess: () => (isAnswered = true),
                onError: () => (isAnswered = true),
                onFinish: () => {
                    sending.onFinish();

                    if (!isAnswered && lastStart?.key === key) {
                        isReconnecting.value = true;
                        void reconnect(key, driver);
                    }
                },
            });
    }

    function beginAgain(accountId: string): void {
        generation++;
        again.submit(signInAgain({ account: accountId }), {
            ...KEEP_THE_WIZARD,
            headers: { 'Idempotency-Key': crypto.randomUUID() },
            ...formSendingHooks(),
        });
    }

    /**
     * Sends the code from the provider's page, or the token or key, that the attempt waits for.
     */
    function send(attemptId: string): void {
        const sending = formSendingHooks();

        // A sent code or secret is never kept: it clears on success and on a refusal alike, so it is never sent again.
        answer.submit(submitCode({ attempt: attemptId }), {
            ...KEEP_THE_WIZARD,
            headers: { 'Idempotency-Key': crypto.randomUUID() },
            ...sending,
            onSuccess: () => answer.reset(),
            onError: () => answer.reset('code'),
            onFinish: sending.onFinish,
        });
    }

    /**
     * Asks the host to cancel the attempt and says once whether it was: its challenge goes only when the cancel is
     * acknowledged, and a refused or lost reply keeps the attempt as it was.
     */
    function cancel(
        attemptId: string,
        settled: (isCancelled: boolean) => void = () => {},
    ): void {
        const sending = formSendingHooks();
        let isCancelled = false;

        cancelling.submit(cancelSignIn({ attempt: attemptId }), {
            ...KEEP_THE_WIZARD,
            ...sending,
            onSuccess: () => {
                isCancelled = true;
                forget();
            },
            onFinish: () => {
                sending.onFinish();
                settled(isCancelled);
            },
        });
    }

    return {
        start,
        again,
        cancelling,
        answer,
        challenge,
        isReconnecting,
        reconnected,
        begin,
        beginAgain,
        send,
        cancel,
        forget,
    };
}

export type SignInActions = ReturnType<typeof signInActions>;
