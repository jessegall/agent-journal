// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { TaskReaderData } from '@generated/types/tasks';

vi.mock('@inertiajs/vue3', () => ({ Link: { template: '<a><slot /></a>' } }));
vi.mock('@generated/routes/tasks', () => ({ list: { url: () => '/tasks' } }));
vi.mock('@kit/SlotSections', () => ({ default: { template: '<div />' } }));

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
