// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { reactive } from 'vue';
import type { AgentOptionData } from '@generated/types/chat';


const posted: { url: string; body: Record<string, unknown> }[] = [];
type PostOptions = {
    onFinish?: () => void;
    onSuccess: (page: { flash: Record<string, unknown> }) => void;
    onError: (errors: Record<string, string>) => void;
};
const postOptions: PostOptions[] = [];

// The chat window's prop on Home; asking it for a driver's accounts answers them as part of its data.
const shownPage = reactive<{ component: string; props: Record<string, unknown> }>({ component: 'Home', props: {} });
const accountsAnswer = {
    driver: 'claude-code',
    accounts: [
        { id: 'expired', label: 'Old account', unavailableReason: 'needs-sign-in', unavailableSentence: 'its account needs to sign in again', expiresAt: null, signInRevision: 1, isDefault: true },
        { id: 'ready', label: 'Work account', unavailableReason: null, unavailableSentence: null, expiresAt: null, signInRevision: 4, isDefault: false },
    ],
    modelChoices: ['claude-opus-5-5', 'claude-sonnet-5-5'],
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

        const options = form.findAll('select[id$="-account"] option');
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

        expect(form.findAll('select[id$="-account"] option')).toHaveLength(2);
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

    it('offers the profile's models, default first, and shows a model refusal under Model with the focus there', async () => {
        const form = mount(SessionForm, { props: { agent: idle, mode: 'start' }, attachTo: document.body });
        await flushPromises();

        const models = form.findAll('select[id$="-model"] option').map((option) => option.text());
        expect(models).toEqual(['claude-opus-5-5 (default)', 'claude-sonnet-5-5']);

        await form.find('form').trigger('submit');
        postOptions.at(-1)?.onError({ model: 'This profile does not allow that model.' });
        await flushPromises();

        const model = form.find('select[id$="-model"]');
        expect(model.attributes('aria-describedby')).toBe(`${model.attributes('id')}-description`);
        expect(form.find(`#${model.attributes('id')}-description`).text()).toBe('This profile does not allow that model.');
        expect(document.activeElement?.id).toBe(model.attributes('id'));
        expect((form.find('select[id$="-account"]').element as HTMLSelectElement).value).toBe('ready');
        form.unmount();
    });

    it('keeps the chosen second account through a refresh while another stays the default', async () => {
        const all = accountsAnswer.accounts;
        accountsAnswer.accounts = [
            { ...all[1], id: 'first', label: 'First account', isDefault: true },
            { ...all[1], id: 'second', label: 'Second account', isDefault: false },
        ];
        const form = mount(SessionForm, { props: { agent: idle, mode: 'start' } });
        await flushPromises();

        await form.find('select[id$="-account"]').setValue('second');
        shownPage.props = { window_chat_conversation: { state: 'ready', data: { eligibleAccounts: { ...accountsAnswer } } } };
        await flushPromises();

        expect((form.find('select[id$="-account"]').element as HTMLSelectElement).value).toBe('second');
        accountsAnswer.accounts = all;
        form.unmount();
    });

    it('gives two open dialogs their own field ids', async () => {
        const first = mount(SessionForm, { props: { agent: idle, mode: 'start' } });
        const second = mount(SessionForm, { props: { agent: idle, mode: 'start' } });
        await flushPromises();

        expect(first.find('select[id$="-model"]').attributes('id')).not.toBe(
            second.find('select[id$="-model"]').attributes('id'),
        );
        first.unmount();
        second.unmount();
    });
});
