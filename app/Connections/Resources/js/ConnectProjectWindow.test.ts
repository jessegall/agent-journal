// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

const reload = vi.fn();
const postJson = vi.fn();
const deleteJson = vi.fn();

vi.mock('@inertiajs/vue3', () => ({ router: { reload } }));
vi.mock('@kit/jsonRequests', () => ({ postJson, deleteJson }));
vi.mock('@generated/routes/connections/invitations', () => ({
    issue: () => ({ url: '/settings/project-connections/invitations' }),
}));
vi.mock('@generated/routes/connections/bindings', () => ({
    revoke: ({ binding }: { binding: string }) => ({
        url: `/settings/project-connections/bindings/${binding}`,
    }),
}));

const { default: ConnectProjectWindow } = await import(
    './ConnectProjectWindow.vue'
);

const LINE =
    'curl -fsSL https://journal.example.com/install/Tk3_x-9QvZ0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0u | sh';

function windowWith(canIssue: boolean) {
    return mount(ConnectProjectWindow, {
        props: {
            data: {
                serverName: 'journal.example.com',
                canIssue,
                release: {
                    release: '1.0.0',
                    targets: [
                        {
                            name: 'darwin-arm64',
                            bytes: 9_000_000,
                            isMeasured: true,
                            prerequisites: ['git', 'curl'],
                            withheldProviders: [],
                            isSupported: true,
                        },
                        {
                            name: 'linux-amd64',
                            bytes: 9_000_000,
                            isMeasured: true,
                            prerequisites: ['git', 'curl'],
                            withheldProviders: ['codex'],
                            isSupported: false,
                        },
                    ],
                    withheldCapabilities: [],
                },
                bindings: [
                    {
                        id: 'binding-1',
                        machineLabel: 'Owner laptop',
                        projectLabel: 'Shop',
                        lastContactAt: null,
                        state: 'ready',
                    },
                ],
            },
        },
    });
}

function button(wrapper: ReturnType<typeof windowWith>, label: string) {
    const found = wrapper.findAll('button').find((each) => each.text() === label);
    if (found === undefined) {
        throw new Error(`no ${label} button`);
    }

    return found;
}

afterEach(() => {
    vi.clearAllMocks();
});

describe('ConnectProjectWindow', () => {
    it('shows each supported platform with its size and prerequisites and names a withheld provider', () => {
        const text = windowWith(true).text();

        expect(text).toContain('darwin-arm64: 9.0 MB to download and install. Needs git, curl.');
        expect(text).toContain('linux-amd64 is withheld: it does not run codex yet.');
    });

    it('generates a line, copies exactly its bytes and replaces it under the same action', async () => {
        const writeText = vi.fn();
        Object.assign(navigator, { clipboard: { writeText } });
        postJson.mockResolvedValue({
            ok: true,
            value: { installLine: LINE, expiresAt: '2026-11-21T12:10:00Z', invitationId: 'one' },
        });
        const wrapper = windowWith(true);

        await button(wrapper, 'Generate install line').trigger('click');
        await flushPromises();
        await button(wrapper, 'Copy').trigger('click');
        await button(wrapper, 'Replace').trigger('click');
        await flushPromises();

        expect(writeText).toHaveBeenCalledWith(LINE);
        expect(
            (wrapper.find('input').element as HTMLInputElement).value,
        ).toBe(LINE);
        const keys = postJson.mock.calls.map((call) => call[1].issuanceKey);
        expect(keys).toHaveLength(2);
        expect(keys[0]).toBe(keys[1]);
    });

    it('offers no install action while connecting projects is switched off', () => {
        const wrapper = windowWith(false);

        expect(wrapper.text()).toContain('Connecting projects is switched off');
        expect(wrapper.findAll('button').map((each) => each.text())).not.toContain(
            'Generate install line',
        );
    });

    it('opens again with no line and a new action', async () => {
        postJson.mockResolvedValue({
            ok: true,
            value: { installLine: LINE, expiresAt: '2026-11-21T12:10:00Z', invitationId: 'one' },
        });
        const first = windowWith(true);
        await button(first, 'Generate install line').trigger('click');
        await flushPromises();
        first.unmount();

        const again = windowWith(true);
        expect(again.find('input').exists()).toBe(false);
        await button(again, 'Generate install line').trigger('click');
        await flushPromises();

        expect(again.find('input').exists()).toBe(true);
        expect(postJson.mock.calls[0][1].issuanceKey).not.toBe(
            postJson.mock.calls[1][1].issuanceKey,
        );
    });

    it('revokes a connected folder and reloads only the page', async () => {
        deleteJson.mockResolvedValue({ ok: true, value: null });
        const wrapper = windowWith(true);

        await button(wrapper, 'Revoke').trigger('click');
        await flushPromises();

        expect(deleteJson).toHaveBeenCalledWith(
            '/settings/project-connections/bindings/binding-1',
        );
        expect(reload).toHaveBeenCalledWith({ only: ['page'] });
    });
});
