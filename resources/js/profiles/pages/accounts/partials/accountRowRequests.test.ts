// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, it, vi } from 'vitest';
import type { AccountRowData } from '@generated/types/accounts';
import { holdsContract, RECORDED } from '@kit/testing/pageRequests';
import type { SentRequest } from '@kit/testing/pageRequests';

const sent: SentRequest[] = vi.hoisted(() => []);

vi.mock('@inertiajs/vue3', async () => ({
    ...(await import('@kit/testing/pageRequests')).recordingInertia(sent),
    Link: { template: '<a><slot /></a>' },
}));

const { default: AccountRow } = await import('./AccountRow.vue');

// A signed-in account whose last check could not tell and whose cleanup waits for a retry, so every button shows.
const account = {
    id: RECORDED.account,
    driver: 'claude-code',
    label: 'Work',
    signIn: {
        method: 'oauth',
        isSecret: false,
        secretSource: null,
        billingNote: 'Your Claude subscription pays for what agents use.',
        title: 'Sign in with Claude',
        description: 'Sign in on the Claude site.',
        billingLabel: 'Subscription',
    },
    state: 'authenticated',
    identity: null,
    workspace: null,
    isActive: false,
    runningCount: 0,
    checkedAt: null,
    expiresAt: null,
    cleanupProblem: 'folder_not_deleted',
    awaitsCleanupRetry: true,
    isHeldForCheck: true,
    isCheckInconclusive: true,
    nameRevision: 0,
    recentStarts: [],
} as unknown as AccountRowData;

function row() {
    return mount(AccountRow, {
        attachTo: document.body,
        global: { stubs: { teleport: true } },
        props: { account, isChosen: false, now: new Date('2026-11-21T12:00:00Z') },
    });
}

function press(shown: ReturnType<typeof row>, text: string) {
    return shown.findAll('button').find((found) => found.text() === text)?.trigger('click');
}

afterEach(() => {
    document.body.innerHTML = '';
});

describe('the Inertia submits of an account row, as the page sends them', () => {
    it('rechecks the account and retries its cleanup', async () => {
        const shown = row();

        await press(shown, 'Recheck');
        holdsContract('account-recheck', sent.at(-1));
        await press(shown, 'Retry cleanup');
        holdsContract('account-retry-cleanup', sent.at(-1));
    });

    it('makes the account the default and removes it from its settings', async () => {
        const shown = row();
        await shown.find('[aria-label="Settings of Work"]').trigger('click');
        await flushPromises();

        await press(shown, 'Make default');
        holdsContract('account-activate', sent.at(-1));
        await press(shown, 'Remove account');
        await flushPromises();
        await press(shown, 'Remove account');
        holdsContract('account-remove', sent.at(-1));
    });
});
