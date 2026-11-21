// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { TaskListData } from '@generated/types/tasks';

const reads: string[] = [];

vi.mock('@inertiajs/vue3', () => ({
    router: { get: (url: string) => reads.push(url) },
    usePage: () => ({ url: '/tasks' }),
    Link: { template: '<a><slot /></a>' },
}));

const { default: TasksWindow } = await import('./TasksWindow.vue');

function tasks(rows: TaskListData['rows'], filters: Partial<TaskListData['filters']> = {}): TaskListData {
    return {
        rows,
        filters: { q: '', page: 1, holder: 'any', ...filters },
        pagination: { page: 1, lastPage: 1, total: rows.length },
    } as TaskListData;
}

describe('TasksWindow', () => {
    it('reads each row as Task 31 and its title, says Unassigned, and puts the actions beside the link', () => {
        const view = mount(TasksWindow, {
            props: { data: tasks([{ id: 'a', number: '31', title: 'Prepare records', state: 'open' }]) },
        });
        const link = view.get('a[aria-label^="Task 31"]');

        expect(link.text()).toContain('Task 31');
        expect(link.text()).toContain('Prepare records');
        expect(link.text()).toContain('Unassigned');
        expect(link.element.contains(view.get('button[aria-haspopup="menu"]').element)).toBe(false);
    });

    it('asks for unassigned tasks from the first page', async () => {
        const view = mount(TasksWindow, { props: { data: tasks([]) } });

        await view.get('select[aria-label="Held by"]').setValue('unassigned');

        expect(reads.at(-1)).toBe('/tasks?holder=unassigned');
    });

    it('keeps the filters on zero matches and offers Clear', () => {
        const view = mount(TasksWindow, { props: { data: tasks([], { q: 'missing', holder: 'unassigned' }) } });

        expect(view.text()).toContain('No tasks match "missing"');
        expect(view.findAll('button').some((button) => button.text() === 'Clear')).toBe(true);
    });
});
