// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, reactive, ref } from 'vue';
import type { SignInAttemptData } from '@generated/types/accounts';

type Options = { onError?: () => void; onSuccess?: () => void };

const challengeAnswers: Array<
    (challenge: { address: string | null; code: string | null }) => void
> = [];
const sent: Options[] = [];

vi.mock('@inertiajs/vue3', () => ({
    useForm: (fields: Record<string, unknown>) => {
        const form = reactive({
            ...fields,
            processing: false,
            errors: {},
            reset(field?: string) {
                if (field === undefined || field === 'code') {
                    (form as Record<string, unknown>).code = '';
                }
            },
            clearErrors: () => undefined,
            transform: () => form,
            submit: (_route: unknown, options: Options) => sent.push(options),
        });

        return form;
    },
}));
vi.mock('@generated/routes/accounts', () => ({
    cancelSignIn: () => ({}),
    signInAgain: () => ({}),
    startSignIn: () => ({}),
    submitCode: () => ({}),
}));
vi.mock('@kit/usePageChanges', () => ({
    formSendingHooks: () => ({
        onStart: () => undefined,
        onFinish: () => undefined,
    }),
}));
vi.mock('./signIn', () => ({
    readChallenge: () =>
        new Promise((resolve) => challengeAnswers.push(resolve)),
}));

const { signInActions } = await import('./signInActions');

function mountActions(
    followed = ref<SignInAttemptData | undefined>({
        id: 'attempt-1',
    } as SignInAttemptData),
) {
    let actions: ReturnType<typeof signInActions> | undefined;
    mount(
        defineComponent({
            setup: () => {
                actions = signInActions(followed);

                return () => h('div');
            },
        }),
    );

    return { followed, actions: actions as ReturnType<typeof signInActions> };
}

describe('signInActions', () => {
    it('never shows a late challenge of an attempt that was replaced', async () => {
        const { followed, actions } = mountActions();

        followed.value = { id: 'attempt-2' } as SignInAttemptData;
        await flushPromises();
        challengeAnswers[0]({ address: 'https://old.example', code: 'OLD' });
        await flushPromises();
        expect(actions.challenge.value.address).toBeNull();

        challengeAnswers[1]({ address: 'https://new.example', code: 'NEW' });
        await flushPromises();
        expect(actions.challenge.value.address).toBe('https://new.example');
    });

    it('clears a refused code or secret, so it is never sent again', () => {
        const { actions } = mountActions();
        actions.answer.code = 'secret-token';

        actions.send('attempt-1');
        sent.at(-1)?.onError?.();

        expect(actions.answer.code).toBe('');
    });
});
