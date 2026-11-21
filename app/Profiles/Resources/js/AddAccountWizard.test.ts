// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';

type SentForm = {
    submit: ReturnType<typeof vi.fn>;
    sent: () => Record<string, unknown>;
    errors: Record<string, string>;
    code?: string;
};

const forms: SentForm[] = [];

vi.mock('@inertiajs/vue3', () => ({
    useForm: (fields: Record<string, unknown>) => {
        let shape: () => Record<string, unknown> = () => ({ ...fields });
        const form = reactive({
            ...fields,
            errors: {} as Record<string, string>,
            processing: false,
            submit: vi.fn(),
            sent: () => shape(),
            transform(next: () => Record<string, unknown>) {
                shape = next;

                return form;
            },
            reset() {
                Object.assign(form, fields);
            },
            clearErrors() {
                form.errors = {};
            },
        });
        forms.push(form as unknown as SentForm);

        return form;
    },
    Link: { template: '<a><slot /></a>' },
}));
vi.mock('@generated/routes/accounts', () => ({
    startSignIn: () => ({ url: '/accounts/sign-ins', method: 'post' }),
    signInAgain: ({ account }: { account: string }) => ({
        url: `/accounts/${account}/sign-in-again`,
        method: 'post',
    }),
    submitCode: ({ attempt }: { attempt: string }) => ({
        url: `/accounts/sign-ins/${attempt}/code`,
        method: 'post',
    }),
    cancelSignIn: ({ attempt }: { attempt: string }) => ({
        url: `/accounts/sign-ins/${attempt}`,
        method: 'delete',
    }),
    challenge: ({ attempt }: { attempt: string }) => ({
        url: `/accounts/sign-ins/${attempt}/challenge`,
    }),
}));
vi.mock('@kit/xsrfToken', () => ({ xsrfToken: () => 'token' }));
vi.mock('@kit/usePageChanges', () => ({
    formSendingHooks: () => ({
        onStart: () => undefined,
        onFinish: () => undefined,
    }),
}));

import type {
    AccountRowData,
    ProgramMethodsData,
    SignInAttemptData,
    SignInMethodData,
    SignInState,
} from '@generated/types/accounts';

const { default: AddAccountWizard } = await import('./AddAccountWizard.vue');

const claudeMethods: SignInMethodData[] = [
    {
        method: 'oauth',
        isSecret: false,
        billingNote: 'Uses your subscription.',
        title: 'Sign in with Claude',
        description: "Opens Claude's sign-in page.",
        billingLabel: 'Subscription',
    },
    {
        method: 'api_key',
        isSecret: true,
        billingNote: 'Billed to your API account.',
        title: 'API key',
        description: 'Paste a key from the Anthropic Console.',
        billingLabel: 'API usage',
        secretSource:
            'In the Anthropic Console, open API keys and create a key.',
    },
];
const methods: ProgramMethodsData[] = [
    { program: 'claude-code', methods: claudeMethods },
    { program: 'codex', methods: [claudeMethods[0]] },
];

function attempt(state: SignInState, fields: Partial<SignInAttemptData> = {}): SignInAttemptData {
    return {
        id: 'attempt-1',
        program: 'claude-code',
        method: 'api_key',
        type: 'new_account',
        accountId: null,
        state,
        expiresAt: '2026-11-21T12:00:00+00:00',
        refusal: null,
        ...fields,
    };
}

function accountRow(id: string, label: string): AccountRowData {
    return {
        id,
        program: 'claude-code',
        label,
        method: 'api_key',
        state: 'signed_in',
        identity: null,
        isActive: false,
        runningCount: 0,
        checkedAt: null,
        expiresAt: null,
        cleanupProblem: null,
        awaitsCleanupRetry: false,
        recentStarts: [],
    };
}

function openWizard() {
    return mount(AddAccountWizard, {
        attachTo: document.body,
        props: { request: { kind: 'new' }, methods, attempts: [], rows: [] },
    });
}

function button(view: ReturnType<typeof openWizard>, label: string) {
    const found = view
        .findAll('button')
        .find((candidate) => candidate.text().includes(label));

    if (found === undefined) {
        throw new Error(`No button ${label}`);
    }

    return found;
}

beforeEach(() => {
    forms.length = 0;
    vi.stubGlobal(
        'fetch',
        vi.fn(async () => ({
            ok: true,
            json: async () => ({ address: null, code: null }),
        })),
    );
});

afterEach(() => vi.unstubAllGlobals());

describe('AddAccountWizard', () => {
    it('walks a key sign-in from the choice to the account added', async () => {
        const view = openWizard();
        await flushPromises();
        const [start, , , answer] = forms;

        expect(view.findAll('[data-step-bar][data-done="true"]')).toHaveLength(
            1,
        );
        expect(button(view, 'Continue').attributes('disabled')).toBeDefined();
        expect(view.text()).toContain('Choose a way to sign in to continue.');

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('API key'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');

        expect(start.submit).toHaveBeenCalledWith(
            { url: '/accounts/sign-ins', method: 'post' },
            expect.anything(),
        );
        expect(start.sent()).toMatchObject({
            program: 'claude-code',
            method: 'api_key',
        });
        expect(view.text()).toContain('Starting the sign-in…');
        expect(view.findAll('[data-step-bar][data-done="true"]')).toHaveLength(
            2,
        );

        await view.setProps({ attempts: [attempt('waiting')] });
        await flushPromises();

        expect(view.text()).toContain('Where to get it.');
        expect(view.text()).toContain(
            'Kept on the host only and never shown again.',
        );

        await view.find('input[type="password"]').setValue('sk-ant-key');
        await view.find('form#add-account-step').trigger('submit');

        expect(answer.submit).toHaveBeenCalledWith(
            { url: '/accounts/sign-ins/attempt-1/code', method: 'post' },
            expect.anything(),
        );
        expect(answer.code).toBe('sk-ant-key');

        await view.setProps({ attempts: [attempt('checking')] });
        expect(view.text()).toContain('Checking the sign-in with Claude Code…');
        expect(view.findAll('[data-step-bar][data-done="true"]')).toHaveLength(
            3,
        );

        await view.setProps({
            attempts: [attempt('complete', { accountId: 'account-1' })],
            rows: [accountRow('account-1', 'Claude Code API key')],
        });
        expect(view.text()).toContain('Account added');
        expect(view.text()).toContain('Claude Code API key');
        expect(view.find('[data-mark="done"]').exists()).toBe(true);

        await button(view, 'Done').trigger('click');
        expect(view.emitted('close')).toHaveLength(1);
        view.unmount();
    });

    it("shows a refused key sign-in with the provider's reason and starts it again", async () => {
        const view = openWizard();
        await flushPromises();
        const [start] = forms;

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('API key'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        await view.setProps({ attempts: [attempt('waiting')] });
        await view.setProps({
            attempts: [attempt('failed', { refusal: 'invalid x-api-key' })],
        });

        expect(view.text()).toContain(
            'The sign-in was refused: invalid x-api-key',
        );
        expect(view.find('[data-mark="grey"]').exists()).toBe(true);

        await button(view, 'Start again').trigger('click');
        expect(start.submit).toHaveBeenCalledTimes(2);
        expect(start.sent()).toMatchObject({
            program: 'claude-code',
            method: 'api_key',
        });

        await button(view, 'Back').trigger('click');
        expect(view.findAll('[data-step-bar][data-done="true"]')).toHaveLength(
            1,
        );
        expect(button(view, 'Continue').attributes('disabled')).toBeUndefined();
        view.unmount();
    });

    it('asks before closing while the sign-in waits, and keeps the field error under the field', async () => {
        const view = openWizard();
        await flushPromises();
        const [, , cancelling, answer] = forms;

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('API key'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        await view.setProps({ attempts: [attempt('waiting')] });
        answer.errors.code = 'This is not a key.';
        await flushPromises();
        expect(view.text()).toContain('This is not a key.');

        await view.find('button[aria-label="Close"]').trigger('click');
        expect(view.text()).toContain('Keep the sign-in waiting?');
        expect(view.emitted('close')).toBeUndefined();

        await button(view, 'Cancel sign-in').trigger('click');
        expect(cancelling.submit).toHaveBeenCalledWith(
            { url: '/accounts/sign-ins/attempt-1', method: 'delete' },
            expect.anything(),
        );
        expect(view.emitted('close')).toHaveLength(1);
        view.unmount();
    });
});
