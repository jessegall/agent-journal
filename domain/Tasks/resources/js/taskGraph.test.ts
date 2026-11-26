// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import type { TaskGraph as TaskGraphProps } from '@generated/types/tasks';
import TaskGraph from './pages/tasks/TaskGraph.vue';

function graph(overrides: Partial<TaskGraphProps> = {}): TaskGraphProps {
    return {
        planId: 'plan-1',
        version: 'v1',
        returnAddress: '/plans/1',
        nodes: [
            { id: 'a', number: 1, title: 'First', status: 'open', address: '/tasks/1', mayEditWaits: true },
            { id: 'b', number: 2, title: 'Second', status: 'open', address: '/tasks/2', mayEditWaits: false, reason: 'Not yours' },
            { id: 'c', number: 3, title: 'Third', status: 'open', address: '/tasks/3', mayEditWaits: true },
        ],
        edges: [{ prerequisiteId: 'a', dependentId: 'b', isSatisfied: false }],
        ...overrides,
    };
}

describe('the task graph', () => {
    it('draws one arrow from the prerequisite to the dependent', () => {
        const view = mount(TaskGraph, { props: graph() });

        expect(view.findAll('[data-edge]').map((path) => path.attributes('data-edge'))).toEqual(['a>b']);
    });

    it('selects a chain on a node and fills the inspector, and Escape clears it and gives the focus back', async () => {
        const view = mount(TaskGraph, { props: graph(), attachTo: document.body });
        const first = view.get('[data-node="a"]');

        await first.trigger('click');
        expect(view.get('[aria-label="Selected task"]').text()).toContain('First');
        expect(view.get('[data-node="b"]').classes()).toContain('bg-sel');
        expect(view.get('[data-node="c"]').classes()).not.toContain('bg-sel');

        await view.get('section').trigger('keydown', { key: 'Escape' });
        expect(view.find('[aria-label="Selected task"]').exists()).toBe(false);
        expect(document.activeElement).toBe(first.element);
        view.unmount();
    });

    it('opens a task with a return address that selects its node again', async () => {
        const view = mount(TaskGraph, { props: graph() });

        await view.get('[data-node="a"]').trigger('click');
        const open = view.findAll('a').find((link) => link.text() === 'Open task');

        expect(open?.attributes('href')).toBe(`/tasks/1?return=${encodeURIComponent('/plans/1?node=a')}`);
    });

    it('keeps the facts of a task whose waits the caller may not change and disables the change with its reason', async () => {
        const view = mount(TaskGraph, { props: graph() });

        await view.get('[data-node="b"]').trigger('click');

        expect(view.get('[aria-label="Selected task"]').text()).toContain('Second');
        expect(view.get('aside button[disabled]').text()).toBe('Change waits');
        expect(view.get('#graph-change-reason').text()).toBe('Not yours');
    });

    it('marks the bottlenecks when asked', async () => {
        const view = mount(TaskGraph, { props: graph() });

        await view.get('[role="switch"]').trigger('click');

        expect(view.get('[data-node="a"]').text()).toContain('Bottleneck');
        expect(view.get('[data-node="c"]').text()).not.toContain('Bottleneck');
    });

    it('tells a plan with no tasks from a plan whose tasks wait for none', () => {
        const none = mount(TaskGraph, { props: graph({ nodes: [], edges: [] }) });
        const free = mount(TaskGraph, { props: graph({ edges: [] }) });

        expect(none.findAll('[data-node]')).toHaveLength(0);
        expect(none.text()).toContain('no tasks');
        expect(free.findAll('[data-node]')).toHaveLength(3);
        expect(free.find('[role="status"]').exists()).toBe(true);
    });

    it('shows Suggest off with its reason when no service gives an address', () => {
        const view = mount(TaskGraph, { props: graph() });
        const suggest = view.findAll('button').find((button) => button.text() === 'Suggest');

        expect(suggest?.attributes('disabled')).toBeDefined();
        expect(view.find('#graph-suggest-reason').exists()).toBe(true);
    });

    it('draws Now and Suggested with both figures, an action bar and Discard back to the plain graph', async () => {
        const view = mount(TaskGraph, {
            props: graph({
                suggestion: { baseVersion: 'v1', edges: [{ prerequisiteId: 'a', dependentId: 'c', isSatisfied: false }] },
                destinations: { apply: '/apply' },
            }),
        });
        const compare = view.get('[data-compare]');

        expect(compare.findAll('h3').map((heading) => heading.text())).toEqual(['Now', 'Suggested']);
        expect(compare.text()).toContain('Longest chain');
        expect(compare.find('[data-mark="added"]').exists()).toBe(true);
        expect(compare.find('[data-mark="removed"]').exists()).toBe(true);
        expect(view.get('[data-action-bar]').text()).toContain('Apply');

        await view.get('[data-action-bar]').findAll('button').at(-1)?.trigger('click');
        expect(view.find('[data-compare]').exists()).toBe(false);
    });

    it('offers Apply only with an address, and keeps the comparison on a conflict with Reload and recompute', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation((_url, _data, options) => {
            options?.onHttpException?.({ status: 409 } as never);
        });
        const without = mount(TaskGraph, { props: graph({ suggestion: { baseVersion: 'v1', edges: [] } }) });

        expect(without.get('[data-action-bar]').text()).not.toContain('Apply');

        const view = mount(TaskGraph, {
            props: graph({ suggestion: { baseVersion: 'v1', edges: [] }, destinations: { apply: '/apply' } }),
        });

        await view.get('[data-action-bar]').findAll('button')[0].trigger('click');

        expect(view.find('[data-compare]').exists()).toBe(true);
        expect(view.get('[role="alert"]').text()).toContain('Reload and recompute');
        post.mockRestore();
    });
});
