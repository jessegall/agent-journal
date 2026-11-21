// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { AgentOptionData } from '@generated/types/chat';


const posted: { url: string; body: Record<string, unknown> }[] = [];
type PostOptions = { onFinish?: () => void; onSuccess: (page: { flash: Record<string, unknown> }) => void };
const postOptions: PostOptions[] = [];

vi.mock('@inertiajs/vue3', () => ({
    Link: { template: '<a><slot /></a>' },
    router: {
        reload: () => undefined,
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
vi.mock('@kit/jsonRequests', () => ({
    getJson: async () => ({
        ok: true,
        value: {
            driver: 'claude-code',
            accounts: [
                { id: 'expired', label: 'Old account', unavailableReason: 'needs-sign-in', unavailableSentence: 'its account needs to sign in again', expiresAt: null, signInRevision: 1, isDefault: true },
                { id: 'ready', label: 'Work account', unavailableReason: null, unavailableSentence: null, expiresAt: null, signInRevision: 4, isDefault: false },
            ],
        },
    }),
}));
vi.mock('@kit/sessionStarts', () => ({
    accountsPage: { url: () => '/accounts' },
    eligibleAccounts: { url: (driver: string) => `/eligible/${driver}` },
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
