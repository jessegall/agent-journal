// @vitest-environment happy-dom
import type {
    ConnectProjectWindowData,
    InstallAttemptRowData,
} from '@generated/types/connections';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

const reload = vi.fn();
const destroy = vi.fn();
// The page's issue action answers with the line as its one-time flash.
const keyedPost = vi.fn(
    (
        _url: string,
        _body: Record<string, unknown>,
        _key: string,
        outcome: KeyedOutcome,
    ) => {
        outcome.onAccepted({
            issuedLine: {
                installLine: LINE,
                expiresAt: new Date(Date.now() + 600_000).toISOString(),
                invitationId: 'one',
                attemptReference: 'IA-ABCDEFGH',
                attemptVersion: keyedPost.mock.calls.length,
            },
        });
        outcome.onFinish?.();
    },
);

type KeyedOutcome = {
    onAccepted: (flash: Record<string, unknown>) => void;
    onFinish?: () => void;
};

vi.mock('@inertiajs/vue3', () => ({ router: { reload, delete: destroy } }));
vi.mock('@kit/keyedPost', () => ({ keyedPost }));
vi.mock('@generated/routes/connections/invitations', () => ({
    issue: () => ({ url: '/settings/project-connections/invitations' }),
    revoke: ({ invitation }: { invitation: string }) => ({
        url: `/settings/project-connections/invitations/${invitation}`,
    }),
}));
vi.mock('@generated/routes/connections/bindings', () => ({
    revoke: ({ binding }: { binding: string }) => ({
        url: `/settings/project-connections/bindings/${binding}`,
    }),
    revokeChosen: () => ({
        url: '/settings/project-connections/bindings/revoke',
    }),
}));

const { default: ConnectProjectWindow } =
    await import('./ConnectProjectWindow.vue');

const LINE =
    'curl -fsSL https://journal.example.com/install/Tk3_x-9QvZ0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0u | sh';

function windowData(
    canIssue: boolean,
    attempts: InstallAttemptRowData[] = [],
): ConnectProjectWindowData {
    return {
        serverName: 'journal.example.com',
        origin: 'https://journal.example.com',
        canIssue,
        projects: [
            {
                id: 'project-1',
                label: 'Shop',
                environments: [
                    { id: 'environment-main', label: 'Main' },
                    { id: 'environment-research', label: 'Research' },
                ],
            },
        ],
        release: {
            release: '1.0.0',
            targets: [
                {
                    name: 'darwin-arm64',
                    bytes: 9_000_000,
                    isMeasured: true,
                    prerequisites: ['git', 'curl'],
                    missingProviders: [],
                    isSupported: true,
                },
                {
                    name: 'linux-amd64',
                    bytes: 9_000_000,
                    isMeasured: true,
                    prerequisites: ['git', 'curl'],
                    missingProviders: ['codex'],
                    isSupported: false,
                },
            ],
            missingCapabilities: [],
        },
        attempts: { rows: attempts, nextCursor: null },
        bindings: {
            rows: [
                {
                    id: 'binding-1',
                    machineLabel: 'Owner laptop',
                    projectLabel: 'Shop',
                    lastContactAt: null,
                    state: 'ready',
                    projectId: 'project-1',
                    environmentId: 'environment-main',
                    environmentLabel: 'Main',
                    capabilities: [],
                    presenceExpiresAt: null,
                    stateText: 'Ready.',
                    signIns: [],
                },
            ],
            serverTime: new Date().toISOString(),
            refreshAt: null,
            nextCursor: null,
        },
    };
}

function windowWith(canIssue: boolean) {
    return mount(ConnectProjectWindow, {
        props: { data: windowData(canIssue) },
    });
}

function button(wrapper: ReturnType<typeof windowWith>, label: string) {
    const found = wrapper
        .findAll('button')
        .find((each) => each.text() === label);
    if (found === undefined) {
        throw new Error(`no ${label} button`);
    }

    return found;
}

afterEach(() => {
    vi.clearAllMocks();
});

describe('ConnectProjectWindow', () => {
    it('shows each supported platform with its size and prerequisites and names a provider not offered yet', () => {
        const text = windowWith(true).text();

        expect(text).toMatch(
            /darwin-arm64: 9\.0 MB to\s+download and install\.\s+Needs\s+git, curl\./,
        );
        expect(text).toMatch(
            /linux-amd64 is not offered yet, because it does not\s+run\s+codex\./,
        );
    });

    it('generates a line, copies exactly its bytes and replaces it under the same action', async () => {
        const writeText = vi.fn();
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText },
            configurable: true,
        });
        const wrapper = windowWith(true);

        await button(wrapper, 'Generate install line').trigger('click');
        await flushPromises();
        await button(wrapper, 'Copy').trigger('click');
        await button(wrapper, 'Replace').trigger('click');
        await flushPromises();

        expect(writeText).toHaveBeenCalledWith(LINE);
        expect(
            (wrapper.find('input[readonly]').element as HTMLInputElement).value,
        ).toBe(LINE);
        const keys = keyedPost.mock.calls.map((call) => call[1].issuanceKey);
        expect(keys).toHaveLength(2);
        expect(keys[0]).toBe(keys[1]);
        expect(keyedPost.mock.calls[1][1]).toMatchObject({
            attemptReference: 'IA-ABCDEFGH',
            seenVersion: '1',
        });
    });

    it('offers no install action while connecting projects is switched off', () => {
        const wrapper = windowWith(false);

        expect(wrapper.text()).toContain(
            'This journal is not issuing install lines.',
        );
        expect(
            wrapper.findAll('button').map((each) => each.text()),
        ).not.toContain('Generate install line');
    });

    it('opens again with no line and a new action', async () => {
        const first = windowWith(true);
        await button(first, 'Generate install line').trigger('click');
        await flushPromises();
        first.unmount();

        const again = windowWith(true);
        expect(again.find('input[readonly]').exists()).toBe(false);
        await button(again, 'Generate install line').trigger('click');
        await flushPromises();

        expect(again.find('input[readonly]').exists()).toBe(true);
        expect(keyedPost.mock.calls[0][1].issuanceKey).not.toBe(
            keyedPost.mock.calls[1][1].issuanceKey,
        );
    });

    it('revokes a connected folder through the page, answering only the page', async () => {
        const wrapper = windowWith(true);

        await button(wrapper, 'Revoke').trigger('click');
        await flushPromises();

        expect(destroy).toHaveBeenCalledWith(
            '/settings/project-connections/bindings/binding-1',
            expect.objectContaining({ only: ['page'], preserveState: true }),
        );
    });
    it('revokes every folder chosen on one machine in one action and shows each outcome', async () => {
        keyedPost.mockImplementationOnce((_url, _body, _key, outcome) => {
            outcome.onAccepted({ revokedBindings: { 'binding-1': 'Revoked' } });
        });
        const wrapper = windowWith(true);

        await button(wrapper, 'Choose all on Owner laptop').trigger('click');
        await button(wrapper, 'Revoke chosen (1)').trigger('click');
        await flushPromises();

        expect(keyedPost).toHaveBeenLastCalledWith(
            '/settings/project-connections/bindings/revoke',
            { bindings: ['binding-1'] },
            expect.any(String),
            expect.any(Object),
            ['page'],
        );
        expect(wrapper.text()).toContain('Revoked');
    });

    it('joins an explicit environment of a connected project', async () => {
        const wrapper = windowWith(true);

        await button(wrapper, 'Join a project').trigger('click');
        await wrapper
            .find('#join-environment')
            .setValue('environment-research');
        await button(wrapper, 'Generate install line').trigger('click');
        await flushPromises();

        expect(keyedPost.mock.calls[0][1]).toMatchObject({
            projectId: 'project-1',
            environmentId: 'environment-research',
        });
    });

    it('cancels the line at the version it saw and drops it from the window', async () => {
        destroy.mockImplementation(
            (_url: string, options: { onSuccess?: () => void }) =>
                options.onSuccess?.(),
        );
        const wrapper = windowWith(true);
        await button(wrapper, 'Generate install line').trigger('click');
        await flushPromises();

        await button(wrapper, 'Cancel').trigger('click');
        await flushPromises();

        expect(destroy).toHaveBeenCalledWith(
            '/settings/project-connections/invitations/one',
            expect.objectContaining({ data: { seenVersion: 1 } }),
        );
        expect(wrapper.find('input[readonly]').exists()).toBe(false);
        expect(wrapper.text()).toContain('Cancelled.');
    });

    it('drops its line at once when the journal reports its attempt spent', async () => {
        const wrapper = windowWith(true);
        await button(wrapper, 'Generate install line').trigger('click');
        await flushPromises();

        await wrapper.setProps({
            data: windowData(true, [
                {
                    reference: 'IA-ABCDEFGH',
                    target: 'New project',
                    state: 'spent',
                    version: 1,
                    createdAt: new Date().toISOString(),
                    bindingId: 'binding-1',
                },
            ]),
        });

        expect(wrapper.find('input[readonly]').exists()).toBe(false);
        expect(wrapper.text()).toContain('This line was used');
        expect(wrapper.find('a[href="#binding-binding-1"]').exists()).toBe(
            true,
        );
    });

    it('reads each folder as project and environment, device, status, then last contact, and names Revoke by its device', () => {
        const wrapper = windowWith(true);
        const row = wrapper.find('#binding-binding-1');
        const text = row.text();

        expect(text.indexOf('Shop / Main')).toBeLessThan(text.indexOf('Owner laptop'));
        expect(text.indexOf('Owner laptop')).toBeLessThan(text.indexOf('Ready'));
        expect(text.indexOf('Ready')).toBeLessThan(text.indexOf('Not in contact yet'));
        expect(row.find('button[aria-label^="Revoke connection for Owner laptop"]').exists()).toBe(true);
    });

    it('says when no project is connected yet', () => {
        const data = windowData(true);
        const wrapper = mount(ConnectProjectWindow, {
            props: { data: { ...data, bindings: { ...data.bindings, rows: [] } } },
        });

        expect(wrapper.text()).toContain('No connected projects');
    });

    it('offers Start for an eligible program with its command and names why another is unavailable', () => {
        const data = windowData(true);
        const [row] = data.bindings.rows;
        const wrapper = mount(ConnectProjectWindow, {
            props: {
                data: {
                    ...data,
                    bindings: {
                        ...data.bindings,
                        rows: [
                            {
                                ...row,
                                capabilities: [
                                    {
                                        driver: 'claude-code',
                                        label: 'Claude Code',
                                        canStart: true,
                                        startCommand: 'journal claude',
                                        unavailableReason: '',
                                    },
                                    {
                                        driver: 'codex',
                                        label: 'Codex',
                                        canStart: false,
                                        startCommand: 'journal codex',
                                        unavailableReason: 'Codex does not keep its hooks to one session yet.',
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        });
        const text = wrapper.find('#binding-binding-1').text();

        expect(text).toContain('journal claude');
        expect(text).toContain('Codex unavailable: Codex does not keep its hooks to one session yet.');
        expect(text).not.toContain('journal codex');
    });
});
