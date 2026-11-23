// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';

type SentForm = {
    submit: ReturnType<typeof vi.fn>;
    sent: () => Record<string, unknown>;
    errors: Record<string, string>;
    code?: string;
    label?: string;
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
            optimistic() {
                return form;
            },
            reset() {
                Object.assign(form, fields);
            },
            clearErrors() {
                form.errors = {};
            },
            setError(field: string, message: string) {
                form.errors = { ...form.errors, [field]: message };
            },
        });
        forms.push(form as unknown as SentForm);

        return form;
    },
    Link: { template: '<a><slot /></a>' },
    router: { reload: vi.fn() },
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
    rename: ({ account }: { account: string }) => ({
        url: `/accounts/${account}/name`,
        method: 'put',
    }),
    challenge: ({ attempt }: { attempt: string }) => ({
        url: `/accounts/sign-ins/${attempt}/challenge`,
    }),
    signInReceipt: ({ query }: { query: Record<string, string> }) => ({
        url: `/accounts/sign-ins/receipt?key=${query.key}&driver=${query.driver}`,
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
    DriverMethodsData,
    SignInAttemptData,
    SignInMethodData,
    SignInState,
} from '@generated/types/accounts';

const { default: AddAccountWizard } = await import('./AddAccountWizard.vue');
const { router } = await import('@inertiajs/vue3');

const claudeMethods: SignInMethodData[] = [
    {
        method: 'oauth',
        isSecret: false,
        secretSource: null,
        billingNote: 'Your Claude subscription pays for what agents use.',
        title: 'Sign in with Claude',
        description: "Opens Claude's sign-in page.",
        billingLabel: 'Subscription',
    },
    {
        method: 'api_key',
        isSecret: true,
        billingNote: 'Billed to the API key, apart from any subscription.',
        title: 'API key',
        description: 'Paste a key from the Anthropic Console.',
        billingLabel: 'API',
        secretSource:
            'In the Anthropic Console, open API keys and create a key.',
    },
];
const methods: DriverMethodsData[] = [
    { driver: 'claude-code', methods: claudeMethods },
    { driver: 'codex', methods: [claudeMethods[0]] },
];

function attempt(
    state: SignInState,
    fields: Partial<SignInAttemptData> = {},
): SignInAttemptData {
    return {
        id: 'attempt-1',
        driver: 'claude-code',
        method: 'api_key',
        type: 'new_account',
        accountId: null,
        resultAccountId: null,
        isResultUnmatchable: false,
        isWaitingForAgents: false,
        isUnclaimed: false,
        state,
        expiresAt: '2026-11-21T12:00:00+00:00',
        refusal: null,
        ...fields,
    };
}

function accountRow(id: string, label: string): AccountRowData {
    return {
        id,
        driver: 'claude-code',
        label,
        signIn: claudeMethods[1],
        state: 'signed_in',
        identity: null,
        workspace: null,
        isActive: false,
        runningCount: 0,
        checkedAt: null,
        expiresAt: null,
        cleanupProblem: null,
        awaitsCleanupRetry: false,
        isHeldForCheck: false,
        isCheckInconclusive: false,
        nameRevision: 0,
        recentStarts: [],
    };
}

function openWizard() {
    return mount(AddAccountWizard, {
        attachTo: document.body,
        global: { stubs: { teleport: true } },
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

afterEach(() => {
    vi.unstubAllGlobals();
    vi.mocked(router.reload).mockReset();
});

describe('AddAccountWizard', () => {
    it('starts one sign-in however often Continue is pressed', async () => {
        const view = openWizard();
        await flushPromises();
        const [start] = forms;

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('API key'))!
            .trigger('click');
        const continueButton = button(view, 'Continue');
        void continueButton.trigger('click');
        await continueButton.trigger('click');

        expect(start.submit).toHaveBeenCalledTimes(1);
    });

    it('follows a sign-in that was already running when its start joins it', async () => {
        const running = attempt('waiting', { method: 'oauth' });
        const view = mount(AddAccountWizard, {
            attachTo: document.body,
            global: { stubs: { teleport: true } },
            props: { request: { kind: 'new' }, methods, attempts: [running], rows: [] },
        });
        await flushPromises();

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('Sign in with Claude'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        await flushPromises();

        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('attempt-1'), expect.anything());
    });

    it('refuses a key past its byte bound with a field error and sends nothing', async () => {
        const view = openWizard();
        await flushPromises();
        const [start, , , answer] = forms;

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('API key'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        expect(start.submit).toHaveBeenCalledTimes(1);
        await view.setProps({ attempts: [attempt('waiting')] });
        await flushPromises();

        await view.find('input[type="password"]').setValue('é'.repeat(2049));
        await view.find('form').trigger('submit');

        expect(answer.submit).not.toHaveBeenCalled();
        expect(view.text()).toContain('it takes 1 to 4096 bytes');
    });

    it('shows the whole sign-in link to select when the browser refuses the copy', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => ({
                ok: true,
                json: async () => ({
                    address: 'https://claude.ai/oauth/authorize?state=1',
                    code: null,
                }),
            })),
        );
        Object.defineProperty(navigator, 'clipboard', {
            configurable: true,
            value: {
                writeText: vi.fn(async () =>
                    Promise.reject(new Error('denied')),
                ),
            },
        });
        const view = openWizard();
        await flushPromises();

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('Sign in with Claude'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        await view.setProps({
            attempts: [attempt('waiting', { method: 'oauth' })],
        });
        await flushPromises();
        await button(view, 'Copy link').trigger('click');
        await flushPromises();

        expect(view.text()).toContain('Copy failed.');
        const link = view
            .findAll('input')
            .find((input) => input.attributes('readonly') !== undefined);
        expect((link!.element as HTMLInputElement).value).toBe(
            'https://claude.ai/oauth/authorize?state=1',
        );
    });

    it('reconnects a start whose reply was lost to the attempt its key started', async () => {
        const replies = [
            { status: 'pending' },
            { status: 'started', attemptId: 'attempt-1' },
        ];
        vi.useFakeTimers();
        // The receipt is a page read: a partial reload of its prop alone, answered here as the server would.
        vi.mocked(router.reload).mockImplementation((options) => {
            const [prop] = options?.only ?? [];

            options?.onSuccess?.({
                props: { [prop]: prop.includes('receipt') ? replies.shift() : { address: null, code: null } },
            } as never);
        });
        const view = openWizard();
        await flushPromises();
        const [start] = forms;

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('API key'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        const options = start.submit.mock.calls[0][1];
        options.onFinish();
        await flushPromises();

        expect(view.text()).toContain('Reconnecting to the sign-in…');

        await view.setProps({ attempts: [attempt('waiting')] });
        await vi.advanceTimersByTimeAsync(2000);
        await flushPromises();

        expect(view.text()).toContain('Where to get it.');
        expect(start.submit).toHaveBeenCalledTimes(1);
        vi.useRealTimers();
    });

    it('shows a running subscription sign-in with Resume when a key was asked for', async () => {
        const view = openWizard();
        await flushPromises();

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('API key'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        await view.setProps({
            attempts: [attempt('waiting', { method: 'oauth' })],
        });
        await flushPromises();

        expect(view.text()).toContain('This sign-in is already running');
        expect(view.find('input[type="password"]').exists()).toBe(false);

        await button(view, 'Resume').trigger('click');

        expect(view.text()).not.toContain('This sign-in is already running');
        expect(view.text()).toContain('Starting the sign-in…');
        expect(view.find('input[type="password"]').exists()).toBe(false);
    });

    it('renews a key with its own words and keeps the field shut while agents finish', async () => {
        const view = mount(AddAccountWizard, {
            attachTo: document.body,
        global: { stubs: { teleport: true } },
            props: {
                request: {
                    kind: 'again',
                    driver: 'claude-code',
                    accountId: 'account-1',
                },
                methods,
                attempts: [],
                rows: [],
            },
        });
        const renewal = {
            type: 'sign_in_again' as const,
            accountId: 'account-1',
            method: 'api_key' as const,
        };
        await view.setProps({
            attempts: [
                attempt('starting', { ...renewal, isWaitingForAgents: true }),
            ],
        });
        await flushPromises();

        expect(view.text()).toContain('Waiting for running agents to finish…');
        expect(view.find('input[type="password"]').exists()).toBe(false);
        expect(
            button(view, 'Replace key').attributes('disabled'),
        ).toBeDefined();

        await view.setProps({ attempts: [attempt('waiting', renewal)] });
        await flushPromises();
        await view.find('input[type="password"]').setValue('sk-ant-new');
        expect(
            button(view, 'Replace key').attributes('disabled'),
        ).toBeUndefined();

        await view.setProps({
            attempts: [
                attempt('complete', {
                    ...renewal,
                    resultAccountId: 'account-1',
                }),
            ],
            rows: [accountRow('account-1', 'Work key')],
        });
        await flushPromises();

        expect(view.text()).toContain('Key replaced');
        expect(view.text()).not.toContain('Name this account');
        view.unmount();
    });

    it('says a browser renewal reconnected the account', async () => {
        const view = openWizard();
        await view.setProps({
            request: { kind: 'resume', attemptId: 'attempt-1' },
            attempts: [
                attempt('complete', {
                    type: 'sign_in_again',
                    accountId: 'account-1',
                    resultAccountId: 'account-1',
                    method: 'oauth',
                }),
            ],
        });
        await flushPromises();

        expect(view.text()).toContain('Account reconnected');
        view.unmount();
    });

    it('names the exact new row of a login with no email once the list has it', async () => {
        const view = openWizard();
        const added = attempt('complete', {
            method: 'oauth',
            resultAccountId: 'account-2',
        });
        await view.setProps({
            request: { kind: 'resume', attemptId: 'attempt-1' },
            attempts: [added],
            rows: [accountRow('account-1', 'First')],
        });
        await flushPromises();

        expect(view.text()).not.toContain('Name this account');

        await view.setProps({
            rows: [
                accountRow('account-1', 'First'),
                accountRow('account-2', 'Claude Code subscription'),
            ],
        });
        await flushPromises();

        expect(view.text()).toContain('Name this account');
        expect((view.find('input').element as HTMLInputElement).value).toBe(
            'Claude Code subscription',
        );
        view.unmount();
    });

    it('offers only Back to Accounts for a duplicate with no account it may read', async () => {
        const view = openWizard();
        await view.setProps({
            request: { kind: 'resume', attemptId: 'attempt-1' },
            attempts: [attempt('already_added', { resultAccountId: null })],
        });
        await flushPromises();

        expect(button(view, 'Back to Accounts').exists()).toBe(true);
        expect(view.text()).not.toContain('Show the account');
        expect(view.text()).not.toContain('Choose another way');

        await view.setProps({
            attempts: [
                attempt('already_added', { resultAccountId: 'account-1' }),
            ],
        });
        await button(view, 'Show the account').trigger('click');
        expect(view.emitted('close')).toEqual([['shown', 'account-1']]);
        view.unmount();
    });

    it('clears a key whose reply was lost and asks again only while the attempt still waits', async () => {
        const view = openWizard();
        await flushPromises();
        const [, , , answer] = forms;

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('API key'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        await view.setProps({ attempts: [attempt('waiting')] });
        await flushPromises();
        await view.find('input[type="password"]').setValue('sk-ant-key');
        await view.find('form').trigger('submit');
        answer.submit.mock.calls[0][1].onFinish();
        await flushPromises();

        expect(answer.code).toBe('');
        expect(view.text()).toContain('Your last answer did not arrive.');

        await view.setProps({ attempts: [attempt('checking')] });
        expect(view.text()).not.toContain('Your last answer did not arrive.');
        expect(view.text()).toContain('Checking the sign-in with Claude Code…');
        view.unmount();
    });

    it('tells an expired and an interrupted sign-in apart, each with Start again', async () => {
        const view = openWizard();

        for (const [state, text] of [
            ['expired', 'The sign-in took too long and was stopped.'],
            [
                'interrupted',
                'The sign-in stopped before your answer reached it',
            ],
        ] as const) {
            await view.setProps({
                request: { kind: 'resume', attemptId: 'attempt-1' },
                attempts: [attempt(state)],
            });
            await flushPromises();

            expect(view.text()).toContain(text);
            expect(button(view, 'Start again').exists()).toBe(true);
        }

        view.unmount();
    });

    it('offers Retry when the sign-in page cannot be read, and closes on a denial with nothing kept', async () => {
        const statuses = [0, 200, 403];
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => {
                const status = statuses.shift();

                if (status === 0) {
                    throw new Error('offline');
                }

                return {
                    ok: status === 200,
                    status,
                    json: async () => ({ address: null, code: null }),
                };
            }),
        );
        const view = openWizard();
        await flushPromises();

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('Sign in with Claude'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        await view.setProps({
            attempts: [attempt('waiting', { method: 'oauth' })],
        });
        await flushPromises();

        expect(view.text()).toContain(
            'Could not reach the journal for this sign-in.',
        );

        await button(view, 'Retry').trigger('click');
        await flushPromises();
        expect(view.text()).toContain('Starting the sign-in…');
        expect(view.emitted('close')).toBeUndefined();

        await view.setProps({
            attempts: [
                attempt('waiting', { method: 'oauth', id: 'attempt-2' }),
            ],
        });
        await view.setProps({
            request: { kind: 'resume', attemptId: 'attempt-2' },
        });
        await flushPromises();
        expect(view.emitted('close')).toEqual([['waiting']]);
        view.unmount();
    });

    it('follows one renewal in two tabs to the same result for that account', async () => {
        const renewing = {
            type: 'sign_in_again' as const,
            accountId: 'account-1',
            method: 'oauth' as const,
        };
        const tab = () =>
            mount(AddAccountWizard, {
                attachTo: document.body,
        global: { stubs: { teleport: true } },
                props: {
                    request: {
                        kind: 'again',
                        driver: 'claude-code',
                        accountId: 'account-1',
                    },
                    methods,
                    attempts: [],
                    rows: [accountRow('account-1', 'Work')],
                },
            });
        const tabs = [tab(), tab()];
        await flushPromises();

        for (const view of tabs) {
            await view.setProps({ attempts: [attempt('waiting', renewing)] });
            await view.setProps({
                attempts: [
                    attempt('complete', {
                        ...renewing,
                        resultAccountId: 'account-1',
                    }),
                ],
            });
            await flushPromises();

            expect(view.text()).toContain('Account reconnected');
            expect(view.text()).toContain('Work');
        }

        const renewals = forms.filter((form) =>
            form.submit.mock.calls.some(
                ([route]) => route.url === '/accounts/account-1/sign-in-again',
            ),
        );
        expect(renewals).toHaveLength(2);
        expect(
            renewals.map(
                (form) =>
                    form.submit.mock.calls[0][1].headers['Idempotency-Key'],
            ),
        ).toHaveLength(2);
        tabs.forEach((view) => view.unmount());
    });

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
            driver: 'claude-code',
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
        await view.find('form').trigger('submit');

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
            attempts: [attempt('complete', { resultAccountId: 'account-1' })],
            rows: [accountRow('account-1', 'Claude Code API key 2')],
        });
        await flushPromises();

        expect(view.text()).toContain('Name this account');
        const field = view.find<HTMLInputElement>('[id^="new-account-name-"]');
        expect(field.element.value).toBe('Claude Code API key 2');

        await field.setValue('Work key');
        await view.find('form').trigger('submit');
        const naming = forms.find((form) => form.label === 'Work key')!;
        expect(naming.submit).toHaveBeenCalledWith(
            { url: '/accounts/account-1/name', method: 'put' },
            expect.anything(),
        );

        naming.submit.mock.calls[0][1].onSuccess();
        await view.setProps({ rows: [accountRow('account-1', 'Work key')] });
        expect(view.text()).toContain('Account added');
        expect(view.text()).toContain('Work key');
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
            attempts: [
                attempt('failed', {
                    refusal:
                        'The provider did not accept the key or login. Check it and try again.',
                }),
            ],
        });

        expect(view.text()).toContain(
            'The provider did not accept the key or login. Check it and try again.',
        );
        expect(view.find('[data-mark="grey"]').exists()).toBe(true);

        await button(view, 'Start again').trigger('click');
        expect(start.submit).toHaveBeenCalledTimes(2);
        expect(start.sent()).toMatchObject({
            driver: 'claude-code',
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
        expect(view.emitted('close')).toBeUndefined();

        cancelling.submit.mock.calls[0][1].onSuccess();
        cancelling.submit.mock.calls[0][1].onFinish();
        expect(view.emitted('close')).toEqual([['cancelled']]);
        view.unmount();
    });

    it('goes back to the choice only once the host acknowledges the cancel', async () => {
        const view = openWizard();
        await flushPromises();
        const [, , cancelling] = forms;

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('API key'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        await view.setProps({ attempts: [attempt('waiting')] });
        await flushPromises();

        await button(view, 'Back').trigger('click');
        const options = cancelling.submit.mock.calls[0][1];
        options.onFinish();
        await flushPromises();
        expect(view.text()).toContain('Where to get it.');

        await button(view, 'Back').trigger('click');
        const second = cancelling.submit.mock.calls[1][1];
        second.onSuccess();
        second.onFinish();
        await flushPromises();
        expect(view.findAll('[role="radio"]').length).toBeGreaterThan(0);
        view.unmount();
    });

    it('leaves a waiting sign-in with Keep waiting and ends a sign-in cancelled elsewhere', async () => {
        const view = openWizard();
        await flushPromises();

        await view
            .findAll('[role="radio"]')
            .find((card) => card.text().includes('API key'))!
            .trigger('click');
        await button(view, 'Continue').trigger('click');
        await view.setProps({ attempts: [attempt('waiting')] });
        await flushPromises();

        await view.setProps({ attempts: [attempt('cancelled')] });
        await flushPromises();
        expect(view.text()).toContain('The sign-in was cancelled.');
        expect(view.find('input[type="password"]').exists()).toBe(false);

        await view.setProps({
            attempts: [attempt('waiting', { id: 'attempt-2' })],
        });
        await view.setProps({
            request: { kind: 'resume', attemptId: 'attempt-2' },
        });
        await flushPromises();
        await view.find('button[aria-label="Close"]').trigger('click');
        await button(view, 'Keep waiting').trigger('click');
        expect(view.emitted('close')).toEqual([['waiting']]);
        view.unmount();
    });
});
