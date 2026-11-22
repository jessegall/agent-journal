// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TaskLogsData, TaskProofsData, TaskStreamEntryData } from '@generated/types/tasks';

type Callbacks = { onNetworkError: () => boolean; onHttpException: (response: { status: number }) => boolean };

const reloads: { data: Record<string, string>; callbacks: Callbacks }[] = [];

vi.mock('@inertiajs/vue3', () => ({
    router: {
        reload: ({ data, ...callbacks }: { data: Record<string, string> } & Callbacks) =>
            reloads.push({ data, callbacks }),
    },
}));

const { default: TaskLogsTab } = await import('./TaskLogsTab.vue');
const { default: TaskProofsTab } = await import('./TaskProofsTab.vue');

function entry(id: string, runNumber: number | undefined, text: string): TaskStreamEntryData {
    return {
        id,
        type: 'log',
        at: `2026-11-22T10:0${id}:00+00:00`,
        actorType: 'agent',
        actorId: 'worker',
        runNumber,
        text,
    } as TaskStreamEntryData;
}

beforeEach(() => {
    reloads.length = 0;
});

describe('TaskLogsTab', () => {
    it('reads its first page when opened and shows the entries in order with their runs, markup as text', async () => {
        const view = mount(TaskLogsTab, { props: { logs: undefined } });
        expect(reloads[0].data).toEqual({ section: 'logs' });

        await view.setProps({
            logs: {
                newest: {
                    before: '',
                    entries: [entry('1', 5, 'Read <b>the</b> schema.'), entry('2', undefined, 'Moved on.')],
                    olderBefore: '1,1',
                },
            } as TaskLogsData,
        });

        const items = view.findAll('ol[aria-label="Log entries"] li');
        expect(items.map((item) => item.find('p').text())).toEqual(['Read <b>the</b> schema.', 'Moved on.']);
        expect(items[0].text()).toContain('Run 5');
        expect(items[1].text()).toContain('Run unknown');
        expect(view.find('ol b').exists()).toBe(false);
    });

    it('keeps new entries behind a New entries button while older entries are on screen', async () => {
        const view = mount(TaskLogsTab, { props: { logs: undefined } });
        const newest = { before: '', entries: [entry('3', 5, 'Third.')], olderBefore: '2,0' };
        await view.setProps({ logs: { newest } as TaskLogsData });

        await view.findAll('button').find((button) => button.text() === 'Show older')?.trigger('click');
        expect(reloads.at(-1)?.data).toEqual({ section: 'logs', logs_before: '2,0' });
        await view.setProps({
            logs: { newest, older: { before: '2,0', entries: [entry('1', 5, 'First.'), entry('2', 5, 'Second.')] } } as TaskLogsData,
        });

        await view.setProps({
            logs: { newest: { before: '', entries: [entry('3', 5, 'Third.'), entry('4', 5, 'Fourth.')] } } as TaskLogsData,
        });

        expect(view.findAll('ol[aria-label="Log entries"] li')).toHaveLength(3);
        const pending = view.findAll('button').find((button) => button.text() === 'New entries (1)');
        expect(pending).toBeDefined();

        await pending?.trigger('click');
        expect(view.findAll('ol[aria-label="Log entries"] li')).toHaveLength(4);
    });
});

describe('TaskProofsTab', () => {
    it('says No proofs yet for an empty read and offers Retry for a failed one', async () => {
        const empty = mount(TaskProofsTab, { props: { proofs: undefined } });
        await empty.setProps({ proofs: { after: '', proofs: [] } as TaskProofsData });
        expect(empty.text()).toContain('No proofs yet');

        const failed = mount(TaskProofsTab, { props: { proofs: undefined } });
        reloads.at(-1)?.callbacks.onNetworkError();
        await flushPromises();
        expect(failed.text()).toContain('The proofs could not be read.');
        expect(failed.text()).not.toContain('passed');
        expect(failed.findAll('button').some((button) => button.text() === 'Retry')).toBe(true);
    });

    it('still lists a check whose result has not come or whose receipt is gone', async () => {
        const view = mount(TaskProofsTab, { props: { proofs: undefined } });
        await view.setProps({
            proofs: {
                after: '',
                proofs: [
                    {
                        id: 'c1',
                        operation: 'acme verify',
                        runNumber: 5,
                        producerType: 'agent',
                        producerId: 'worker',
                        processRunId: 'run-1',
                        registeredAt: '2026-11-22T10:00:00+00:00',
                    },
                ],
            } as TaskProofsData,
        });

        expect(view.text()).toContain('acme verify');
        expect(view.text()).toContain('Waiting for its result');
        expect(view.text()).toContain('Process run run-1, no receipt yet');
    });
});
