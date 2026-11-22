// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { TaskReaderData } from '@generated/types/tasks';

vi.mock('@inertiajs/vue3', () => ({ Link: { template: '<a><slot /></a>' } }));
vi.mock('@generated/routes/tasks', () => ({ list: { url: () => '/tasks' } }));
vi.mock('@kit/SlotSections', () => ({ default: { template: '<div />' } }));
vi.mock('@kit/CommentsPanel', () => ({ default: { template: '<div />' } }));

const { default: TaskWindow } = await import('./TaskWindow.vue');

function reader(changes: Partial<TaskReaderData> = {}): TaskReaderData {
    return {
        number: '31',
        title: 'Prepare records',
        state: 'started',
        revision: 1,
        brief: 'First part.\n\nSecond part,\nwith a line.',
        latestRun: 4,
        sections: [],
        label: 'task 31',
        actions: { mayStart: false, mayBlock: false, mayCancel: false, runNumber: 4 },
        comments: { items: [], nextAfter: null },
        ...changes,
    } as TaskReaderData;
}

describe('TaskWindow', () => {
    it('names the number and title first, then the state and the facts apart', () => {
        const text = mount(TaskWindow, { props: { data: reader() } }).text();

        expect(text.indexOf('Task 31')).toBeLessThan(text.indexOf('Prepare records'));
        expect(text.indexOf('Prepare records')).toBeLessThan(text.indexOf('Started'));
        expect(text).toContain('Unassigned');
        expect(text).toContain('Run 4');
        expect(text).toContain('Nobody');
    });

    it('shows the brief as text in order and says No brief yet when it is empty', () => {
        const paragraphs = mount(TaskWindow, { props: { data: reader() } })
            .findAll('[role="tabpanel"] p')
            .map((paragraph) => paragraph.text());

        expect(paragraphs).toEqual(['First part.', 'Second part,\nwith a line.']);
        expect(mount(TaskWindow, { props: { data: reader({ brief: '' }) } }).text()).toContain('No brief yet');
    });

    it('binds the Brief tab to its labelled panel', () => {
        const view = mount(TaskWindow, { props: { data: reader() } });
        const tab = view.get('[role="tab"]');
        const panel = view.get('[role="tabpanel"]');

        expect(tab.attributes('aria-controls')).toBe(panel.attributes('id'));
        expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'));
    });
});

describe('TaskWindow after a start', () => {
    it('shows the new run number and the actor taking it, with Start offered only when the domain offers it', () => {
        const started = mount(TaskWindow, {
            props: {
                data: reader({
                    latestRun: 5,
                    runningNow: { actorType: 'agent', actorId: 'w1', actorLabel: 'Worker one' },
                    actions: { mayStart: false, mayBlock: true, mayCancel: true, runNumber: 5, startReason: 'Task 31 is already being worked on.' },
                }),
            },
        });

        expect(started.text()).toContain('Run 5');
        expect(started.text()).toContain('Worker one');
        expect(started.text()).toContain('Task 31 is already being worked on.');
        expect(started.findAll('button').some((button) => button.text() === 'Start task')).toBe(false);
    });
});
