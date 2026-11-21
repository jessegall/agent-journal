import type {
    SignInAttemptData,
    SignInMethod,
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
import { readChallenge } from './signIn';
import type { SignInChallenge } from './signIn';

/**
 * What the add-account wizard does with a sign-in: start one for a new account or an account again, send the code
 * or the secret the attempt waits for, and cancel it. While the followed attempt runs, its challenge is read over its
 * own no-store request every 2 s until it is there. A typed code or secret lives only here and is cleared once sent,
 * cancelled or left.
 */
export function signInActions(followed: Ref<SignInAttemptData | undefined>) {
    const start = useForm({});
    const again = useForm({});
    const cancelling = useForm({});
    const answer = useForm({ code: '' });
    const challenge = ref<SignInChallenge>({ address: null, code: null });
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function pollChallenge(attemptId: string): Promise<void> {
        challenge.value = await readChallenge(attemptId);

        if (
            challenge.value.address === null &&
            followed.value?.id === attemptId
        ) {
            timer = setTimeout(() => void pollChallenge(attemptId), 2000);
        }
    }

    function forget(): void {
        clearTimeout(timer);
        challenge.value = { address: null, code: null };
        answer.reset();
        answer.clearErrors();
    }

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

    onBeforeUnmount(forget);

    function begin(program: string, method: SignInMethod): void {
        start
            .transform(() => ({
                program,
                method,
                request_key: crypto.randomUUID(),
            }))
            .submit(startSignIn(), {
                preserveScroll: true,
                ...formSendingHooks(),
            });
    }

    function beginAgain(accountId: string): void {
        again
            .transform(() => ({ request_key: crypto.randomUUID() }))
            .submit(signInAgain({ account: accountId }), {
                preserveScroll: true,
                ...formSendingHooks(),
            });
    }

    /**
     * Sends the code from the provider's page, or the token or key, that the attempt waits for.
     */
    function send(attemptId: string): void {
        const sending = formSendingHooks();

        answer.submit(submitCode({ attempt: attemptId }), {
            preserveScroll: true,
            ...sending,
            onSuccess: () => answer.reset(),
            onFinish: sending.onFinish,
        });
    }

    function cancel(attemptId: string): void {
        forget();
        cancelling.submit(cancelSignIn({ attempt: attemptId }), {
            preserveScroll: true,
            ...formSendingHooks(),
        });
    }

    return {
        start,
        again,
        cancelling,
        answer,
        challenge,
        begin,
        beginAgain,
        send,
        cancel,
        forget,
    };
}

export type SignInActions = ReturnType<typeof signInActions>;
