// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';

type SentForm = {
    submit: ReturnType<typeof vi.fn>;
    label?: string;
    errors: Record<string, string>;
};

const forms: SentForm[] = [];

vi.mock('@inertiajs/vue3', () => ({
    useForm: (fields: Record<string, unknown>) => {
        const form = reactive({
            ...fields,
            errors: {} as Record<string, string>,
            processing: false,
            submit: vi.fn(),
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
    accountStart: ({ session }: { session: string }) => ({
        url: `/starts/${session}`,
    }),
    activate: ({ account }: { account: string }) => ({
        url: `/accounts/${account}/activate`,
        method: 'post',
    }),
    rename: ({ account }: { account: string }) => ({
        url: `/accounts/${account}/name`,
        method: 'put',
    }),
    remove: ({ account }: { account: string }) => ({
        url: `/accounts/${account}`,
        method: 'delete',
    }),
    retryCleanup: ({ account }: { account: string }) => ({
        url: `/accounts/${account}/cleanup`,
        method: 'post',
    }),
}));
vi.mock('@kit/usePageChanges', () => ({
    formSendingHooks: () => ({
        onStart: () => undefined,
        onFinish: () => undefined,
    }),
}));

import type {
    AccountRowData,
    SignInMethodData,
} from '@generated/types/accounts';
import AccountRow from './AccountRow.vue';

const subscription: SignInMethodData = {
    method: 'oauth',
    isSecret: false,
    billingNote: 'Uses your subscription.',
    title: 'Sign in with ChatGPT',
    description:
        "Enter a short code on OpenAI's site. The rest happens by itself.",
    billingLabel: 'Subscription',
};

function account(overrides: Partial<AccountRowData> = {}): AccountRowData {
    return {
        id: 'acc-1',
        program: 'codex',
        label: 'jesse@example.com',
        signIn: subscription,
        state: 'signed_in',
        identity: null,
        workspace: null,
        isActive: false,
        runningCount: 0,
        checkedAt: null,
        expiresAt: null,
        cleanupProblem: null,
        awaitsCleanupRetry: false,
        recentStarts: [],
        ...overrides,
    };
}

function row(props: { account?: AccountRowData; isChosen?: boolean } = {}) {
    return mount(AccountRow, {
        attachTo: document.body,
        props: {
            account: props.account ?? account(),
            isChosen: props.isChosen ?? false,
        },
    });
}

afterEach(() => {
    forms.length = 0;
    document.body.innerHTML = '';
});

describe('an account row', () => {
    it('reads its program and what it bills in one plain line', () => {
        expect(row().text()).toContain('Codex subscription');
    });

    it('marks the default account with a filled star and offers the star to make another the default', async () => {
        expect(
            row({ isChosen: true })
                .find('[aria-label="jesse@example.com is the default"]')
                .attributes('aria-pressed'),
        ).toBe('true');

        const other = row({ isChosen: false });
        await other
            .find('[aria-label="Make jesse@example.com the default"]')
            .trigger('click');

        expect(forms.some((form) => form.submit.mock.calls.length === 1)).toBe(
            true,
        );
    });

    it('never repeats who it is signed in as under its name', () => {
        const shown = row({
            account: account({ label: 'Work', identity: 'jesse@example.com' }),
        });

        expect(shown.find('li > div').text()).not.toContain(
            'jesse@example.com',
        );
    });

    it('shows the rest in its details dialog', async () => {
        const shown = row({
            account: account({
                identity: 'jesse@example.com',
                workspace: 'Team Acme',
                runningCount: 3,
            }),
        });
        await shown
            .find('[aria-label="Details of jesse@example.com"]')
            .trigger('click');
        await flushPromises();

        expect(shown.text()).toContain('Sign in with ChatGPT');
        expect(shown.text()).toContain('Signed in as');
        expect(shown.text()).toContain('WorkspaceTeam Acme');
        expect(shown.text()).toContain('Running now3');
    });

    it('shows the expiry under its state, so an expiring row is no taller', () => {
        const shown = row({
            account: account({ expiresAt: '2026-12-01T00:00:00Z' }),
        });

        expect(shown.text()).toContain('Expires');
        expect(shown.text()).not.toContain('Its login');
    });
});

describe('the rename dialog', () => {
    it('opens from the pencil, holds the current name, and saves only a changed name', async () => {
        const shown = row();
        await shown
            .find('[aria-label="Rename jesse@example.com"]')
            .trigger('click');
        await flushPromises();

        const save = shown
            .findAll('button')
            .find((button) => button.text() === 'Save');
        expect(save?.attributes('disabled')).toBeDefined();

        const naming = forms.find((form) => form.label === 'jesse@example.com');
        naming!.label = 'Work account';
        await flushPromises();

        expect(save?.attributes('disabled')).toBeUndefined();
    });

    it('keeps the host refusal under the field', async () => {
        const shown = row();
        await shown
            .find('[aria-label="Rename jesse@example.com"]')
            .trigger('click');
        const naming = forms.find((form) => form.label === 'jesse@example.com');
        naming!.errors = { label: "A name can't have a slash in it." };
        await flushPromises();

        expect(shown.text()).toContain("A name can't have a slash in it.");
    });
});

describe('the remove dialog', () => {
    it('names the account and says what removal does, and removes only on confirm', async () => {
        const shown = row({ account: account({ runningCount: 2 }) });
        await shown
            .find('[aria-label="Remove jesse@example.com"]')
            .trigger('click');
        await flushPromises();

        expect(shown.text()).toContain(
            '2 agents are still using it; it goes away when they finish.',
        );
        expect(forms.every((form) => form.submit.mock.calls.length === 0)).toBe(
            true,
        );

        await shown
            .findAll('button')
            .find((button) => button.text() === 'Remove')!
            .trigger('click');

        expect(forms.some((form) => form.submit.mock.calls.length === 1)).toBe(
            true,
        );
    });
});
