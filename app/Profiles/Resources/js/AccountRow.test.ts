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
    secretSource: null,
    billingNote: 'Uses your subscription.',
    title: 'Sign in with ChatGPT',
    description:
        "Enter a short code on OpenAI's site. The rest happens by itself.",
    billingLabel: 'Subscription',
};

function account(overrides: Partial<AccountRowData> = {}): AccountRowData {
    return {
        id: 'acc-1',
        driver: 'codex',
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

async function openSettings(shown: ReturnType<typeof row>): Promise<void> {
    await shown
        .find('[aria-label="Settings of jesse@example.com"]')
        .trigger('click');
    await flushPromises();
}

function button(shown: ReturnType<typeof row>, text: string) {
    return shown.findAll('button').find((found) => found.text() === text);
}

afterEach(() => {
    forms.length = 0;
    document.body.innerHTML = '';
});

describe('an account row', () => {
    it('reads its driver and what it bills in one plain line, and says when it is the default', () => {
        expect(row().text()).toContain('Codex subscription');
        expect(row({ isChosen: true }).text()).toContain(
            'Codex subscription · Default',
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

    it('shows the expiry under its state, so an expiring row is no taller', () => {
        const shown = row({
            account: account({ expiresAt: '2026-12-01T00:00:00Z' }),
        });

        expect(shown.text()).toContain('Expires');
    });

    it('has one settings button and no other icon actions', () => {
        const labels = row()
            .findAll('li [aria-label]')
            .filter((found) => found.element.closest('dialog') === null)
            .map((found) => found.attributes('aria-label'));

        expect(labels).toEqual(['Settings of jesse@example.com']);
    });
});

describe('the settings dialog', () => {
    it('shows the facts the row leaves out', async () => {
        const shown = row({
            account: account({
                identity: 'jesse@example.com',
                workspace: 'Team Acme',
                runningCount: 3,
            }),
        });
        await openSettings(shown);

        expect(shown.text()).toContain('Sign in with ChatGPT');
        expect(shown.text()).toContain('Signed in as');
        expect(shown.text()).toContain('WorkspaceTeam Acme');
        expect(shown.text()).toContain('Running now3');
    });

    it('renames: it holds the current name and saves only a changed name', async () => {
        const shown = row();
        await openSettings(shown);

        expect(button(shown, 'Save')?.attributes('disabled')).toBeDefined();

        const naming = forms.find((form) => form.label === 'jesse@example.com');
        naming!.label = 'Work account';
        await flushPromises();

        expect(button(shown, 'Save')?.attributes('disabled')).toBeUndefined();

        await shown.find('form').trigger('submit');

        expect(naming!.submit).toHaveBeenCalledTimes(1);
    });

    it('keeps the host refusal under the name field', async () => {
        const shown = row();
        await openSettings(shown);
        const naming = forms.find((form) => form.label === 'jesse@example.com');
        naming!.errors = { label: "A name can't have a slash in it." };
        await flushPromises();

        expect(shown.text()).toContain("A name can't have a slash in it.");
    });

    it('makes another account the default, and says so for the default one', async () => {
        const other = row();
        await openSettings(other);
        await button(other, 'Make default')!.trigger('click');

        expect(forms.some((form) => form.submit.mock.calls.length === 1)).toBe(
            true,
        );

        const chosen = row({ isChosen: true });
        await openSettings(chosen);

        expect(chosen.text()).toContain(
            'This is the default account for new Codex starts.',
        );
        expect(button(chosen, 'Make default')).toBeUndefined();
    });

    it('asks inside the same dialog before it removes, with Back focused', async () => {
        const shown = row({ account: account({ runningCount: 2 }) });
        await openSettings(shown);
        await button(shown, 'Remove account...')!.trigger('click');
        await flushPromises();

        expect(shown.text()).toContain(
            '2 agents are still using it; it goes away when they finish.',
        );
        expect(document.activeElement?.textContent?.trim()).toBe('Back');
        expect(forms.every((form) => form.submit.mock.calls.length === 0)).toBe(
            true,
        );

        await button(shown, 'Remove')!.trigger('click');

        expect(forms.some((form) => form.submit.mock.calls.length === 1)).toBe(
            true,
        );
    });

    it('offers the way back first for an account that must sign in again', async () => {
        const shown = row({ account: account({ state: 'needs_sign_in' }) });
        await openSettings(shown);
        await button(shown, 'Sign in again')!.trigger('click');

        expect(shown.emitted('signInAgain')).toHaveLength(1);
    });
});
