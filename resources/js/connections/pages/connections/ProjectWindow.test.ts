// @vitest-environment happy-dom
import type { ProjectTreeEntryData, ProjectWindowData } from '@generated/types/connections';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

const reload = vi.fn();

vi.mock('@kit/useWindowQuery', () => ({ useWindowReload: () => reload }));
vi.mock('@inertiajs/vue3', () => ({ Link: { template: '<a><slot /></a>' } }));

const { default: ProjectWindow } = await import('./ProjectWindow.vue');

function entry(path: string, isFolder: boolean, more: Partial<ProjectTreeEntryData> = {}): ProjectTreeEntryData {
    return { path, name: path.split('/').pop() ?? path, isFolder, size: 0, isOpen: false, isLoading: false, isFailed: false, children: [], ...more };
}

function windowData(status: ProjectWindowData['status'], entries: ProjectTreeEntryData[] = []): ProjectWindowData {
    return { status, projectLabel: 'Shop', machineLabel: 'Owner laptop', connectAddress: '/connections', entries };
}

afterEach(() => {
    reload.mockClear();
    vi.useRealTimers();
});

describe('the Project window', () => {
    it('asks the server for this window with the folder it opened', async () => {
        const view = mount(ProjectWindow, {
            props: { data: windowData('ready', [entry('src', true), entry('README.md', false)]) },
            attachTo: document.body,
        });

        await view.findAll('[role="treeitem"]')[0].trigger('keydown', { key: 'ArrowRight' });

        expect(reload).toHaveBeenCalledTimes(1);
        expect(reload.mock.calls[0][0]).toEqual({ open: ['src'] });
        view.unmount();
    });

    it('tells an empty project from a failed read and an offline machine', () => {
        const empty = mount(ProjectWindow, { props: { data: windowData('ready') } });
        const failed = mount(ProjectWindow, { props: { data: windowData('failed') } });
        const offline = mount(ProjectWindow, { props: { data: windowData('offline') } });

        expect(empty.find('[role="alert"]').exists()).toBe(false);
        expect(failed.find('[role="alert"]').exists()).toBe(true);
        expect(offline.text()).toContain('Owner laptop');
        expect(offline.text()).not.toBe(failed.text());
    });

    it('shows the skeleton while the host has not answered, asks again, then offers Retry', async () => {
        vi.useFakeTimers();
        const view = mount(ProjectWindow, { props: { data: windowData('pending') } });

        expect(view.find('[aria-busy="true"]').exists()).toBe(true);

        for (let poll = 1; poll <= 10; poll++) {
            await vi.advanceTimersByTimeAsync(700);
            await view.setProps({ data: windowData('pending') });
        }

        expect(reload).toHaveBeenCalledTimes(10);
        expect(view.find('[role="alert"]').exists()).toBe(true);

        await view.get('[role="alert"] button').trigger('click');
        expect(reload).toHaveBeenCalledTimes(11);
    });

    it('shows the tree once the host answered', async () => {
        const view = mount(ProjectWindow, { props: { data: windowData('pending') } });

        await view.setProps({ data: windowData('ready', [entry('src', true)]) });

        expect(view.findAll('[role="treeitem"]')).toHaveLength(1);
    });

    it('says when no project is connected and leads to Connect a project', () => {
        const view = mount(ProjectWindow, { props: { data: windowData('none') } });

        expect(view.get('a').attributes('href')).toBe('/connections');
    });
});
