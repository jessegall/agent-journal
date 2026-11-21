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
            transform() {
                return form;
            },
            optimistic() {
                return form;
            },
        });
        forms.push(form as unknown as SentForm);

        return form;
    },
    Link: { template: '<a><slot /></a>' },
}));
vi.mock('@generated/routes/accounts', () => ({
    recheck: ({ account }: { account: string }) => ({
        url: `/accounts/${account}/recheck`,
        method: 'post',
    }),
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
    AccountUsageWindowData,
    SignInMethodData,
} from '@generated/types/accounts';
import AccountRow from './AccountRow.vue';

const subscription: SignInMethodData = {
    method: 'oauth',
    isSecret: false,
    secretSource: null,
    billingNote: 'Your Claude subscription pays for what agents use.',
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
        isHeldForCheck: false,
        isCheckInconclusive: false,
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
            now: new Date('2026-11-21T12:00:00Z'),
        },
    });
}

const week: AccountUsageWindowData = {
    limitId: 'claude',
    slot: 'seven_day',
    usedPercent: 42,
    windowMinutes: null,
    resetsAt: '2026-11-23T10:00:00Z',
    observedAt: '2026-11-21T11:00:00Z',
};
const fiveHours: AccountUsageWindowData = {
    ...week,
    slot: 'five_hour',
    usedPercent: 17,
    resetsAt: '2026-11-21T15:00:00Z',
};

function usageLineOf(shown: ReturnType<typeof row>): string | undefined {
    return shown
        .findAll('li > div > span')
        .map((found) => found.text())
        .find((text) => / used|Est\. |Latest thread/.test(text));
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
    it('reads its driver, what it bills, its state and whether it is the default in one line under its name', () => {
        const line = row({ isChosen: true }).find('li > div > div');

        expect(line.text()).toContain('Codex subscription');
        expect(line.text()).toContain('Default');
        expect(line.text()).toContain('Signed in');
        expect(row().find('li > div > div').text()).not.toContain('Default');
    });

    it('offers Recheck once the check could not tell, and only then', async () => {
        const held = row({ account: account({ isHeldForCheck: true }) });
        expect(held.text()).toContain(
            'Agents cannot start with it until the check ends.',
        );
        expect(held.text()).not.toContain('Recheck');
        held.unmount();

        const pending = row({
            account: account({
                isHeldForCheck: true,
                isCheckInconclusive: true,
            }),
        });
        expect(pending.text()).toContain('Verification pending');
        const recheckButton = pending
            .findAll('button')
            .find((candidate) => candidate.text() === 'Recheck');
        await recheckButton!.trigger('click');
        expect(
            forms.some((form) =>
                form.submit.mock.calls.some(
                    ([route]) => route.url === '/accounts/acc-1/recheck',
                ),
            ),
        ).toBe(true);
        pending.unmount();
    });

    it('reads Checking while a renewal that did not finish waits for its check', () => {
        const view = row({ account: account({ isHeldForCheck: true }) });

        expect(view.text()).toContain('Checking');
        expect(view.text()).toContain('StateChecking');
        expect(view.text()).not.toMatch(/StateSigned in|·Signed in/);
        view.unmount();
    });

    it('never repeats who it is signed in as under its name', () => {
        const shown = row({
            account: account({ label: 'Work', identity: 'jesse@example.com' }),
        });

        expect(shown.find('li > div').text()).not.toContain(
            'jesse@example.com',
        );
    });

    it('shows the expiry on the line under its name, so its buttons keep their room', () => {
        const shown = row({
            account: account({ expiresAt: '2026-12-01T00:00:00Z' }),
        });

        expect(shown.find('li > div > div').text()).toContain('Expires');
    });

    it('opens its settings tip to the left of the button, inside the card, with a pointer', () => {
        const tip = row().find('[role="tooltip"]');

        expect(tip.classes()).toContain('right-full');
        expect(tip.find('[aria-hidden="true"]').exists()).toBe(true);
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
        expect(shown.text()).toContain('Running now3 agents');
    });

    it('renames: Save shows inside the field only for a changed name, and Enter saves it', async () => {
        const shown = row();
        await openSettings(shown);

        expect(button(shown, 'Save')).toBeUndefined();

        const naming = forms.find((form) => form.label === 'jesse@example.com');
        naming!.label = 'Work account';
        await flushPromises();

        expect(button(shown, 'Save')).toBeDefined();

        await shown.find('form').trigger('submit');

        expect(naming!.submit).toHaveBeenCalledTimes(1);
    });

    it('shows why a default choice was refused when another was chosen meanwhile', async () => {
        const shown = row();
        await openSettings(shown);

        await button(shown, 'Make default')!.trigger('click');
        const choosing = forms.find((form) =>
            form.submit.mock.calls.some(
                ([route]) => route.url === '/accounts/acc-1/activate',
            ),
        );
        choosing!.errors.command =
            'Another default account was chosen for codex meanwhile; the current one is shown.';
        await flushPromises();

        expect(shown.text()).toContain(
            'Another default account was chosen for codex meanwhile',
        );
    });

    it('puts the saved name back on Escape and keeps the dialog open', async () => {
        const shown = row();
        await openSettings(shown);
        const naming = forms.find((form) => form.label === 'jesse@example.com');
        naming!.label = 'Work account';
        await flushPromises();

        await shown.find('input').trigger('keydown', { key: 'Escape' });

        expect(naming!.label).toBe('jesse@example.com');
        expect(shown.emitted('close')).toBeUndefined();
    });

    it('opens without taking the focus into the name', async () => {
        const shown = row();
        await openSettings(shown);

        expect(document.activeElement).not.toBe(shown.find('input').element);
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

        expect(chosen.text()).toContain('DefaultDefault');
        expect(button(chosen, 'Make default')).toBeUndefined();
    });

    it('asks inside the same dialog before it removes, with Back focused', async () => {
        const shown = row({ account: account({ runningCount: 2 }) });
        await openSettings(shown);
        await button(shown, 'Remove account')!.trigger('click');
        await flushPromises();

        expect(shown.text()).toContain(
            '2 agents are still using it; it goes away when they finish.',
        );
        expect(document.activeElement?.textContent?.trim()).toBe('Back');
        expect(forms.every((form) => form.submit.mock.calls.length === 0)).toBe(
            true,
        );

        expect(shown.text()).toContain('Remove this account?');

        await button(shown, 'Remove account')!.trigger('click');

        expect(forms.some((form) => form.submit.mock.calls.length === 1)).toBe(
            true,
        );
    });

    it('keeps a refused removal on the row after its dialog closed', async () => {
        const shown = row({ account: account({}) });
        await openSettings(shown);
        await button(shown, 'Remove account')!.trigger('click');
        await flushPromises();
        await button(shown, 'Remove account')!.trigger('click');
        const sent = forms.find((form) => form.submit.mock.calls.length === 1)!;

        sent.submit.mock.calls[0][1].onError({
            command: 'The account is still signing in.',
        });
        await flushPromises();

        expect(shown.find('[role="alert"]').text()).toBe(
            'The account is still signing in.',
        );
    });

    it('offers the way back first for an account that must sign in again', async () => {
        const shown = row({ account: account({ state: 'needs_sign_in' }) });
        await openSettings(shown);
        await button(shown, 'Sign in again')!.trigger('click');

        expect(shown.emitted('signInAgain')).toHaveLength(1);
    });

    it('shows one Week line for an account with both windows and both windows in settings', async () => {
        const shown = row({
            account: account({ usage: { windows: [fiveHours, week] } }),
        });

        expect(usageLineOf(shown)).toMatch(/^Week 42% used, resets \S+$/);
        await openSettings(shown);
        const usage = document.querySelector('[aria-label="Usage"]');

        expect(usage?.textContent).toContain('Week');
        expect(usage?.textContent).toContain('42% used, resets');
        expect(usage?.textContent).toContain('5-hour');
        expect(usage?.textContent).toContain('17% used, resets');
    });

    it('shows the five-hour line for an account with only that window', () => {
        const shown = row({
            account: account({ usage: { windows: [fiveHours] } }),
        });

        expect(usageLineOf(shown)).toMatch(/^5-hour 17% used, resets /);
    });

    it('shows no usage line and no usage part for an account without a reading', async () => {
        const shown = row();

        expect(usageLineOf(shown)).toBeUndefined();
        await openSettings(shown);

        expect(document.querySelector('[aria-label="Usage"]')).toBeNull();
    });

    it('shows a positive cost below a cent as less than a cent', () => {
        const shown = row({
            account: account({
                usage: {
                    windows: [],
                    monthCost: {
                        usd: '0.004000000000',
                        observations: 2,
                        monthStart: '2026-11-01T00:00:00+00:00',
                        lastObservedAt: '2026-11-21T10:00:00+00:00',
                    },
                },
            }),
        });

        expect(usageLineOf(shown)).toBe('Est. < $0.01 this month');
    });
});

describe('usage on an open page', () => {
    it('drops a window from the row line once the clock passes its reset, without a reload', async () => {
        const shown = row({
            account: account({ usage: { windows: [fiveHours, week] } }),
        });

        expect(usageLineOf(shown)).toMatch(/^Week 42% used/);

        await shown.setProps({ now: new Date('2026-11-23T11:00:00Z') });

        expect(usageLineOf(shown)).toBeUndefined();
    });

    it('keeps the open settings, a typed name and the focus when the account changes', async () => {
        const shown = row();
        await openSettings(shown);
        const field = document.querySelector<HTMLInputElement>(
            '#account-name-acc-1',
        )!;
        const naming = forms.find((form) => form.label === 'jesse@example.com');
        naming!.label = 'Typed name';
        field.focus();
        await flushPromises();

        await shown.setProps({
            account: account({ usage: { windows: [week] } }),
        });
        await flushPromises();

        expect(document.querySelector('dialog[open]')).not.toBeNull();
        expect(naming!.label).toBe('Typed name');
        expect(document.activeElement).toBe(field);
        expect(document.querySelector('[aria-label="Usage"]')).not.toBeNull();
    });
});
