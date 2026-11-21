// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import type { AgentOptionData } from '@generated/types/chat';


const posted: { url: string; body: Record<string, unknown> }[] = [];
type PostOptions = { onFinish?: () => void; onSuccess: (page: { flash: Record<string, unknown> }) => void };
const postOptions: PostOptions[] = [];

// The chat window's prop on Home; asking it for a driver's accounts answers them as part of its data.
const shownPage = reactive<{ component: string; props: Record<string, unknown> }>({ component: 'Home', props: {} });
const accountsAnswer = {
    driver: 'claude-code',
    accounts: [
        { id: 'expired', label: 'Old account', unavailableReason: 'needs-sign-in', unavailableSentence: 'its account needs to sign in again', expiresAt: null, signInRevision: 1, isDefault: true },
        { id: 'ready', label: 'Work account', unavailableReason: null, unavailableSentence: null, expiresAt: null, signInRevision: 4, isDefault: false },
    ],
};

// How many of the next account reads fail, as when the journal cannot be reached.
const readFailures = { count: 0 };

vi.mock('@inertiajs/vue3', () => ({
    Link: { template: '<a><slot /></a>' },
    usePage: () => shownPage,
    router: {
        reload: (options: { only: string[]; onError?: (errors: Record<string, string>) => void }) => {
            if (readFailures.count > 0) {
                readFailures.count--;
                options.onError?.({ page: 'The accounts could not be read.' });

                return;
            }

            shownPage.props = { [options.only[0]]: { state: 'ready', data: { eligibleAccounts: { ...accountsAnswer } } } };
        },
        on: () => () => undefined,
        post: (url: string, body: Record<string, unknown>, options: PostOptions) => {
            posted.push({ url, body });
            postOptions.push(options);
            options.onFinish?.();
        },
    },
}));
vi.mock('@kit/Modal', () => ({
    default: { template: '<div><slot /><slot name="footer" /></div>' },
}));
vi.mock('@kit/sessionStarts', () => ({
    accountsPage: { url: () => '/accounts' },
    startMain: { url: (profile: string) => `/profiles/${profile}/start-main` },
    switchMethod: { url: (profile: string) => `/profiles/${profile}/switch` },
}));

const { default: SessionForm } = await import('./SessionForm.vue');

const idle: AgentOptionData = {
    id: 'main',
    name: 'Main agent',
    profileKey: 'journal-main',
    retired: false,
    presence: 'idle',
    presenceLabel: 'Idle',
    sessionId: null,
    sessionGeneration: 0,
    hasTerminal: false,
    switchId: null,
    switchStage: null,
    switchStageLabel: null,
    isSwitchOver: true,
    actions: ['start'],
    conversations: [],
    startRefusal: null,
    status: {
        sessionState: 'stopped',
        label: 'Stopped',
        reason: null,
        remedy: null,
        operation: null,
        commandOutcome: null,
        observationAgeSeconds: null,
        actions: [{ type: 'start', label: 'Start session' }],
    },
};

describe('SessionForm', () => {
    it('chooses the ready account over an expired default, says why the other is unavailable, and sends one request id twice', async () => {
        const form = mount(SessionForm, { props: { agent: idle, mode: 'start' } });
        await flushPromises();

        const options = form.findAll('#session-account option');
        expect(options.map((option) => [option.text(), option.attributes('disabled') !== undefined])).toEqual([
            ['Old account: its account needs to sign in again', true],
            ['Work account', false],
        ]);
        expect(form.text()).toContain('Starts Claude Code as its default variant, on Work account.');

        await form.find('form').trigger('submit');
        await flushPromises();
        await form.find('form').trigger('submit');
        await flushPromises();

        expect(posted.map((sent) => [sent.url, sent.body.accountId, sent.body.accountRevision])).toEqual([
            ['/profiles/journal-main/start-main', 'ready', 4],
            ['/profiles/journal-main/start-main', 'ready', 4],
        ]);
        expect(posted[0].body.requestId).toBe(posted[1].body.requestId);
        form.unmount();
    });

    it('disables Start and points to Accounts when every account is unavailable', async () => {
        const all = accountsAnswer.accounts;
        accountsAnswer.accounts = [all[0]];
        const form = mount(SessionForm, { props: { agent: idle, mode: 'start' } });
        await flushPromises();

        expect(form.text()).toContain('None of its accounts can start now.');
        const start = form.findAll('button').find((candidate) => candidate.text() === 'Start session');
        expect(start?.attributes('disabled')).toBeDefined();
        accountsAnswer.accounts = all;
        form.unmount();
    });

    it('offers Retry when the accounts could not be read', async () => {
        readFailures.count = 1;
        const form = mount(SessionForm, { props: { agent: idle, mode: 'start' } });
        await flushPromises();

        expect(form.text()).toContain('The accounts could not be read.');
        await form.findAll('button').find((candidate) => candidate.text() === 'Retry')!.trigger('click');
        await flushPromises();

        expect(form.findAll('#session-account option')).toHaveLength(2);
        form.unmount();
    });

    it('shows Starting at once and Ready only once the session the start answered with runs', async () => {
        const form = mount(SessionForm, { props: { agent: idle, mode: 'start' } });
        await flushPromises();
        await form.find('form').trigger('submit');
        expect(form.text()).toContain('Starting');

        await form.setProps({ agent: { ...idle, presence: 'working', sessionId: 'session-2' } });
        postOptions.at(-1)?.onSuccess({ flash: { startedSessionId: 'session-1' } });
        await flushPromises();
        expect(form.text()).toContain('Another session is running; this start is not confirmed yet');

        await form.setProps({ agent: { ...idle, presence: 'working', sessionId: 'session-1' } });
        postOptions.at(-1)?.onSuccess({ flash: { startedSessionId: 'session-1' } });
        await flushPromises();
        expect(form.text()).toContain('Ready');
        form.unmount();
    });
});
