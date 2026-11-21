// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { AgentOptionData } from '@generated/types/chat';
import type { JsonReply } from '@kit/jsonRequests';

type StartAnswer = { sessionId: string; newSession: boolean };

const posted: { url: string; body: Record<string, unknown> }[] = [];
const startReply: JsonReply<StartAnswer> = { ok: true, value: { sessionId: 'session-1', newSession: true } };

vi.mock('@inertiajs/vue3', () => ({
    Link: { template: '<a><slot /></a>' },
    router: { reload: () => undefined },
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
    postJson: async (url: string, body: Record<string, unknown>) => {
        posted.push({ url, body });

        return startReply;
    },
}));
vi.mock('@kit/sessionStarts', () => ({
    accountsPage: { url: () => '/accounts' },
    eligibleAccounts: { url: (driver: string) => `/eligible/${driver}` },
    startMain: { url: (profile: string) => `/profiles/${profile}/start-main` },
    switchMethod: { url: (profile: string) => `/profiles/${profile}/switch` },
    switchStage: { url: (requestId: string) => `/switches/${requestId}` },
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
    actions: ['start'],
    conversations: [],
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
});
