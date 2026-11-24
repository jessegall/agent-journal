// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { router } from '@inertiajs/vue3';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { provideHostProp } from '@/framework/hostProp';
import DeclaredLayout from '@/pages/layout/DeclaredLayout.vue';
import type { LayoutPartData } from '@/generated/types/core';

function part(
    fields: Partial<LayoutPartData> &
        Pick<LayoutPartData, 'tag' | 'key' | 'style'>,
): LayoutPartData {
    return {
        size: null,
        text: null,
        detail: null,
        rows: [],
        children: [],
        tabs: [],
        ...fields,
    };
}

describe('a declared layout', () => {
    it('draws a heading, facts as term and value pairs, and an error notice as an alert', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'root',
                        style: 'stack',
                        children: [
                            part({
                                tag: 'text',
                                key: 'title',
                                style: 'heading',
                                text: 'Shelf',
                            }),
                            part({
                                tag: 'collection',
                                key: 'facts',
                                style: 'facts',
                                rows: [
                                    {
                                        key: 'count',
                                        label: 'Books',
                                        value: '2',
                                        query: {},
                                        isCurrent: false,
                                    hasColumns: false,
                                    },
                                ],
                            }),
                            part({
                                tag: 'notice',
                                key: 'failed',
                                style: 'error',
                                text: 'Not read',
                            }),
                        ],
                    }),
                },
            },
        });

        expect(view.find('h2').text()).toBe('Shelf');
        expect(view.find('dt').text()).toBe('Books');
        expect(view.find('dd').text()).toBe('2');
        expect(view.find('[role="alert"]').text()).toContain('Not read');
    });

    it('names why an action cannot run, links an action to its own window query, and tones a badge', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'root',
                        style: 'stack',
                        children: [
                            part({
                                tag: 'action',
                                key: 'approve',
                                style: 'primary',
                                size: 'normal',
                                text: 'Approve',
                                action: {
                                    query: {},
                                    reason: 'Only the owner approves',
                                    submits: false,
                                    appends: false,
                                },
                            }),
                            part({
                                tag: 'action',
                                key: 'next',
                                style: 'bordered',
                                size: 'normal',
                                text: 'Next page',
                                action: {
                                    query: { cursor: 'abc' },
                                    submits: false,
                                    appends: false,
                                },
                            }),
                            part({
                                tag: 'text',
                                key: 'state',
                                style: 'badge',
                                text: 'Open',
                                tone: 'good',
                            }),
                        ],
                    }),
                },
            },
            global: {
                stubs: {
                    Link: {
                        props: ['href'],
                        template: '<a :href="href"><slot /></a>',
                    },
                },
            },
        });

        const disabled = view.find('button[disabled]');
        const reasonId = disabled.attributes('aria-describedby');
        expect(disabled.text()).toBe('Approve');
        expect(view.find(`#${reasonId}`).text()).toBe(
            'Only the owner approves',
        );
        expect(view.find('a').attributes('href')).toContain('cursor=abc');
        expect(view.text()).toContain('Open');
    });

    it('sends a form with its fixed values and typed field, asking only for its own window prop', async () => {
        const visit = vi
            .spyOn(router, 'visit')
            .mockImplementation(() => undefined);
        const view = mount(
            defineComponent({
                setup() {
                    provideHostProp('window_documents_report');

                    return () =>
                        h(DeclaredLayout, {
                            data: {
                                root: part({
                                    tag: 'form',
                                    key: 'settle',
                                    style: 'inline',
                                    form: {
                                        method: 'POST',
                                        href: '/documents/reports/42/settle',
                                        fixed: { revision: 1 },
                                        isKeyed: false,
                                    },
                                    children: [
                                        part({
                                            tag: 'field',
                                            key: 'reason',
                                            style: 'text',
                                            size: 'normal',
                                            text: 'Reason',
                                            field: {
                                                name: 'reason',
                                                value: '',
                                                clears: [],
                                                options: [],
                                            },
                                        }),
                                        part({
                                            tag: 'action',
                                            key: 'save',
                                            style: 'primary',
                                            size: 'normal',
                                            text: 'Settle',
                                            action: {
                                                query: {},
                                                submits: true,
                                                appends: false,
                                            },
                                        }),
                                    ],
                                }),
                            },
                        });
                },
            }),
            { attachTo: document.body },
        );

        await view.find('input').setValue('Reviewed');
        await view.find('form').trigger('submit');

        const [href, options] = visit.mock.calls[0];
        expect(String(href)).toContain('/documents/reports/42/settle');
        expect(options).toMatchObject({
            method: 'post',
            data: { revision: 1, reason: 'Reviewed' },
            only: ['window_documents_report'],
            preserveState: true,
        });
        view.unmount();
        visit.mockRestore();
    });

    it('moves between tabs by arrow and chooses one by its own tab key, asking only for its window prop', async () => {
        const visit = vi
            .spyOn(router, 'visit')
            .mockImplementation(() => undefined);
        const view = mount(
            defineComponent({
                setup() {
                    provideHostProp('window_handbook_entry');

                    return () =>
                        h(DeclaredLayout, {
                            data: {
                                root: part({
                                    tag: 'tabs',
                                    key: 'tabs',
                                    style: 'tabs',
                                    tabs: [
                                        {
                                            key: 'text',
                                            label: 'Text',
                                            isChosen: true,
                                        },
                                        {
                                            key: 'references',
                                            label: 'References',
                                            isChosen: false,
                                        },
                                    ],
                                    children: [
                                        part({
                                            tag: 'body',
                                            key: 'text',
                                            style: 'prose',
                                            body: { html: '<p>Entry text</p>' },
                                        }),
                                    ],
                                }),
                            },
                        });
                },
            }),
            { attachTo: document.body },
        );
        const tabs = view.findAll('[role="tab"]');

        expect(tabs.map((tab) => tab.attributes('tabindex'))).toEqual([
            '0',
            '-1',
        ]);
        expect(tabs[0].attributes('aria-selected')).toBe('true');
        expect(view.find('[role="tabpanel"]').html()).toContain('Entry text');

        await tabs[0].trigger('keydown', { key: 'ArrowRight' });
        expect(document.activeElement).toBe(tabs[1].element);

        await tabs[1].trigger('click');
        const [href, options] = visit.mock.calls[0];
        expect(String(href)).toContain('tab=references');
        expect(options).toMatchObject({
            only: ['window_handbook_entry'],
            preserveState: true,
        });
        view.unmount();
        visit.mockRestore();
    });

    it('adds the rows a Show more reads to the rows shown, and keeps them when the read fails', async () => {
        const visit = vi
            .spyOn(router, 'visit')
            .mockImplementation(() => undefined);
        const row = (key: string) => ({
            key,
            label: key,
            value: '',
            query: {},
            isCurrent: false,
            hasColumns: false,
        });
        const layout = (rows: string[], more: boolean) => {
            const children = [
                part({
                    tag: 'collection',
                    key: 'rows',
                    style: 'list',
                    rows: rows.map(row),
                }),
            ];

            if (more) {
                children.push(
                    part({
                        tag: 'action',
                        key: 'more',
                        style: 'bordered',
                        size: 'normal',
                        text: 'Show more',
                        action: {
                            query: { after: 'b' },
                            submits: false,
                            appends: true,
                        },
                    }),
                );
            }

            return { root: part({ tag: 'box', key: 'root', style: 'stack', children }) };
        };
        const view = mount(DeclaredLayout, {
            props: { data: layout(['a', 'b'], true) },
        });

        await view.find('button').trigger('click');
        const [href, options] = visit.mock.calls[0];
        expect(String(href)).toContain('after=b');

        options?.onNetworkError?.(new Error('offline') as never);
        options?.onFinish?.({} as never);
        await view.vm.$nextTick();
        expect(view.findAll('li')).toHaveLength(2);
        expect(view.find('[role="alert"]').exists()).toBe(true);

        await view.find('button').trigger('click');
        await view.setProps({ data: layout(['c', 'd'], false) });
        options?.onFinish?.({} as never);
        await view.vm.$nextTick();
        expect(view.findAll('li').map((item) => item.text())).toEqual([
            'a',
            'b',
            'c',
            'd',
        ]);
        view.unmount();
        visit.mockRestore();
    });

    it('draws placeholder rows under one busy line, and a stale notice that reads only its own prop again', async () => {
        const reload = vi
            .spyOn(router, 'reload')
            .mockImplementation(() => undefined);
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'root',
                        style: 'stack',
                        children: [
                            part({
                                tag: 'notice',
                                key: 'loading',
                                style: 'skeleton',
                                text: 'Loading tasks',
                                placeholders: 4,
                            }),
                            part({
                                tag: 'notice',
                                key: 'stale',
                                style: 'stale',
                                text: 'Offline',
                            }),
                        ],
                    }),
                },
            },
        });

        expect(view.find('[aria-busy="true"]').exists()).toBe(true);
        expect(view.findAll('[aria-hidden="true"]')).toHaveLength(4);
        expect(view.find('[role="status"]').text()).toBe('Loading tasks');

        await view.findAll('button').at(-1)?.trigger('click');
        expect(reload).toHaveBeenCalledWith({ only: ['page'] });
        view.unmount();
        reload.mockRestore();
    });

    it('draws a measured reading as a fluid meter that speaks its value, maximum and label, or as a counted progress', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'root',
                        style: 'stack',
                        children: [
                            part({
                                tag: 'progress',
                                key: 'week',
                                style: 'meter',
                                progress: { value: 72, max: 100, label: 'Weekly allowance', unit: 'percent' },
                            }),
                            part({
                                tag: 'progress',
                                key: 'tasks',
                                style: 'counted',
                                progress: { value: 3, max: 8, label: 'Plan 4', unit: 'tasks' },
                            }),
                        ],
                    }),
                },
            },
        });
        const meter = view.get('[role="meter"]');

        expect(meter.attributes('aria-valuenow')).toBe('72');
        expect(meter.attributes('aria-valuemax')).toBe('100');
        expect(meter.attributes('aria-label')).toBe('Weekly allowance');
        expect(meter.attributes('aria-valuetext')).toBe('72 of 100 percent');
        expect(meter.classes()).toContain('max-w-55');
        expect(view.get('[role="progressbar"]').attributes('aria-valuenow')).toBe('3');
    });

    it('draws an allowance in use as its meter with the percent used, or in a row as the meter alone', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'root',
                        style: 'stack',
                        children: [
                            part({
                                tag: 'progress',
                                key: 'week',
                                style: 'usage',
                                progress: { value: 72, max: 100, label: 'This week used', unit: 'percent' },
                            }),
                            part({
                                tag: 'progress',
                                key: 'row',
                                style: 'usage-row',
                                detail: 'This week 72% used',
                                progress: { value: 40, max: 100, label: 'Usage', unit: 'percent' },
                            }),
                        ],
                    }),
                },
            },
        });
        const meters = view.findAll('[role="meter"]');

        expect(view.text()).toContain('72% used');
        expect(meters.map((meter) => meter.attributes('aria-valuenow'))).toEqual(['72', '40']);
    });

    it('draws the share of pieces finished as a short meter with its rounded percent beside it', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'progress',
                        key: 'plan',
                        style: 'share',
                        progress: { value: 3, max: 8, label: 'Plan 4', unit: 'tasks' },
                    }),
                },
            },
        });

        expect(view.get('[role="meter"]').attributes('aria-valuetext')).toBe('3 of 8 tasks');
        expect(view.text()).toContain('38%');
    });

    it('draws the leading and trailing parts of a row with only its title linking, and each fact piece as its own link', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'root',
                        style: 'stack',
                        children: [
                            part({
                                tag: 'collection',
                                key: 'rows',
                                style: 'list',
                                rows: [
                                    {
                                        key: 'run-1',
                                        label: 'Run 1',
                                        value: '',
                                        query: {},
                                        isCurrent: true,
                                        hasColumns: false,
                                        href: '/runs/1',
                                        leading: [part({ tag: 'text', key: 'driver', style: 'plain', text: 'Claude' })],
                                        trailing: [part({ tag: 'text', key: 'state', style: 'plain', text: 'Running' })],
                                    },
                                ],
                            }),
                            part({
                                tag: 'collection',
                                key: 'facts',
                                style: 'facts',
                                rows: [
                                    {
                                        key: 'waits',
                                        label: 'Waits for',
                                        value: '',
                                        query: {},
                                        isCurrent: false,
                                        hasColumns: false,
                                        fact: {
                                            pieces: [
                                                { label: 'Task 3', href: '/tasks/3' },
                                                { label: 'Task 4' },
                                            ],
                                        },
                                    },
                                ],
                            }),
                        ],
                    }),
                },
            },
            global: {
                stubs: {
                    Link: {
                        props: ['href'],
                        template: '<a :href="href"><slot /></a>',
                    },
                },
            },
        });
        const row = view.get('li');

        expect(row.findAll('a')).toHaveLength(1);
        expect(row.get('a').attributes('href')).toBe('/runs/1');
        expect(row.text()).toContain('Claude');
        expect(row.text()).toContain('Running');
        expect(view.get('dd').findAll('a')).toHaveLength(1);
        expect(view.get('dd').text()).toContain('Task 4');
    });

    it('follows the row link when the row is clicked anywhere, and draws the hover only on a row that opens', async () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'collection',
                        key: 'rows',
                        style: 'list',
                        rows: [
                            {
                                key: 'run-1',
                                label: 'Run 1',
                                value: 'Running',
                                query: {},
                                isCurrent: false,
                                hasColumns: false,
                                href: '/runs/1',
                            },
                            {
                                key: 'run-2',
                                label: 'Run 2',
                                value: 'Stopped',
                                query: {},
                                isCurrent: false,
                                hasColumns: false,
                            },
                        ],
                    }),
                },
            },
            global: {
                stubs: {
                    Link: {
                        props: ['href'],
                        template: '<a :href="href" @click.prevent><slot /></a>',
                    },
                },
            },
        });
        const [opening, plain] = view.findAll('li');
        const followed = vi.fn();
        opening.get('a').element.addEventListener('click', followed);

        await opening.get('span.shrink-0').trigger('click');

        expect(followed).toHaveBeenCalledTimes(1);
        expect(opening.get('div').classes()).toContain('hover:bg-hover');
        expect(plain.get('div').classes()).not.toContain('hover:bg-hover');
    });

    it('draws a row in columns as a grid whose state stands in the last column, with or without a meter before it', () => {
        const state = part({ tag: 'text', key: 'state', style: 'badge', text: 'Signed in' });
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'collection',
                        key: 'rows',
                        style: 'list',
                        rows: [
                            {
                                key: 'measured',
                                label: 'Work',
                                value: '',
                                query: {},
                                isCurrent: false,
                                hasColumns: true,
                                trailing: [part({ tag: 'text', key: 'usage', style: 'plain', text: '72' }), state],
                            },
                            {
                                key: 'unmeasured',
                                label: 'Personal',
                                value: '',
                                query: {},
                                isCurrent: false,
                                hasColumns: true,
                                trailing: [state],
                            },
                        ],
                    }),
                },
            },
        });
        const [measured, unmeasured] = view.findAll('li > div');
        const cells = (row: typeof measured) =>
            row
                .findAll(':scope > span')
                .slice(-2)
                .map((cell) => cell.text());

        expect(measured.classes()).toContain('grid');
        expect(cells(measured)).toEqual(['72', state.text]);
        expect(cells(unmeasured)).toEqual(['', state.text]);
    });

    it('draws a settings group in the kit rows with the value below its label in a block row, chips and a switch only where declared', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'settings',
                        style: 'settings',
                        children: [
                            part({ tag: 'text', key: 'title', style: 'heading', text: 'Profile' }),
                            part({ tag: 'text', key: 'help', style: 'muted', text: 'Who it works as' }),
                            part({
                                tag: 'box',
                                key: 'rows',
                                style: 'settings-group',
                                children: [
                                    part({
                                        tag: 'box',
                                        key: 'row-models',
                                        style: 'setting-block',
                                        children: [
                                            part({ tag: 'text', key: 'title', style: 'plain', text: 'Models' }),
                                            part({
                                                tag: 'box',
                                                key: 'models',
                                                style: 'row',
                                                children: [part({ tag: 'text', key: 'chip-0', style: 'chip', text: 'fast' })],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
            },
        });

        expect(view.get('section').attributes('aria-label')).toBe('Profile');
        expect(view.find('[role="group"]').exists()).toBe(true);
        expect(view.get('.flex-col.items-stretch').text()).toContain('Models');
        expect(view.get('.flex-col.items-stretch').text()).toContain('fast');
        expect(view.find('[role="switch"]').exists()).toBe(false);
    });

    it('opens the menu of a focused row with the Menu key or Shift and F10, only when the row has one', async () => {
        const view = mount(DeclaredLayout, {
            attachTo: document.body,
            props: {
                data: {
                    root: part({
                        tag: 'collection',
                        key: 'rows',
                        style: 'list',
                        rows: [
                            {
                                key: 'with-menu',
                                label: 'With menu',
                                value: '',
                                query: {},
                                isCurrent: false,
                                hasColumns: false,
                                menu: {
                                    key: 'task',
                                    label: 'Actions for task 1',
                                    groups: [{ key: 'main', items: [{ key: 'open', label: 'Open', href: '/tasks/1', method: 'GET' }] }],
                                },
                            },
                            { key: 'plain', label: 'Plain', value: '', query: {}, isCurrent: false, hasColumns: false },
                        ],
                    }),
                },
            },
            global: { stubs: { Link: { props: ['href'], template: '<a :href="href"><slot /></a>' } } },
        });
        const rows = view.findAll('li');

        const shownMenus = () =>
            view.findAll<HTMLElement>('[role="menu"]').filter((menu) => menu.element.style.display !== 'none');

        await rows[1].trigger('keydown', { key: 'ContextMenu' });
        expect(shownMenus()).toHaveLength(0);

        await rows[0].trigger('keydown', { key: 'F10', shiftKey: true });
        expect(shownMenus()).toHaveLength(1);
        view.unmount();
    });

    it('draws a card box as a labelled group with its icon, title, badge and permitted action', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'question-4',
                        style: 'card',
                        children: [
                            part({
                                tag: 'box',
                                key: 'head',
                                style: 'row',
                                children: [
                                    part({ tag: 'text', key: 'icon', style: 'icon', text: 'speech' }),
                                    part({ tag: 'text', key: 'title', style: 'plain', text: 'Which branch?' }),
                                    part({ tag: 'text', key: 'badge', style: 'badge', text: 'Waiting', tone: 'warn' }),
                                ],
                            }),
                            part({
                                tag: 'box',
                                key: 'actions',
                                style: 'row',
                                children: [
                                    part({
                                        tag: 'action',
                                        key: 'answer',
                                        style: 'bordered',
                                        size: 'normal',
                                        text: 'Answer',
                                        action: { query: {}, href: '/chat/4', submits: false, appends: false },
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
            },
            global: { stubs: { Link: { props: ['href'], template: '<a :href="href"><slot /></a>' } } },
        });
        const card = view.get('[role="group"]');

        expect(card.attributes('aria-label')).toBe('Which branch?');
        expect(card.text()).toContain('Waiting');
        expect(card.get('a').attributes('href')).toBe('/chat/4');
    });

    it('shows only the reader with Back to the owning list at a record address, and sets the reader width', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'split',
                        style: 'split',
                        split: {
                            listWidth: 430,
                            narrowShows: 'reader',
                            readerWidth: 'settings',
                            back: { href: '/tasks?state=open&page=2', label: 'Tasks' },
                        },
                        children: [
                            part({ tag: 'box', key: 'list', style: 'stack' }),
                            part({ tag: 'text', key: 'facts', style: 'plain', text: 'Facts' }),
                        ],
                    }),
                },
            },
            global: { stubs: { Link: { props: ['href'], template: '<a :href="href"><slot /></a>' } } },
        });

        expect(view.find('a[href="/tasks?state=open&page=2"]').text()).toContain('Tasks');
        expect(view.findAll('section')[0].classes()).toContain('hidden');
        expect(view.find('.max-w-180').text()).toContain('Facts');
    });

    it('keeps the title and creation on the first line of the bar, the views and search after them', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'header',
                        style: 'bar',
                        children: ['title', 'views', 'search', 'creation'].map((key) =>
                            part({ tag: 'text', key, style: 'plain', text: key }),
                        ),
                    }),
                },
            },
        });
        const slots = view.findAll('[data-layout-box="bar"] > div');

        expect(slots.map((slot) => slot.text())).toEqual(['title', 'views', 'search', 'creation']);
        expect(slots[3].classes()).toContain('order-3');
        expect(slots[1].classes()).toContain('w-full');
    });

    it('draws a reader box in the kit Reader: the wrapping title, the metadata line, the actions and the body', () => {
        const view = mount(DeclaredLayout, {
            props: {
                data: {
                    root: part({
                        tag: 'box',
                        key: 'detail',
                        style: 'reader',
                        children: [
                            part({ tag: 'text', key: 'title', style: 'heading', text: 'A long title' }),
                            part({
                                tag: 'box',
                                key: 'metadata',
                                style: 'row',
                                children: [part({ tag: 'text', key: 'plan', style: 'plain', text: 'Plan 2' })],
                            }),
                            part({
                                tag: 'box',
                                key: 'actions',
                                style: 'row',
                                children: [part({ tag: 'text', key: 'open', style: 'plain', text: 'Open' })],
                            }),
                            part({ tag: 'text', key: 'body', style: 'plain', text: 'Body text' }),
                        ],
                    }),
                },
            },
        });

        expect(view.get('article h2').text()).toBe('A long title');
        expect(view.get('article header').text()).toContain('Plan 2');
        expect(view.get('article header').text()).toContain('Open');
        expect(view.get('article > div').text()).toContain('Body text');
    });

    it('opens a dialog from its opener, keeps its form inside, and returns the focus to the opener on Cancel', async () => {
        const view = mount(DeclaredLayout, {
            attachTo: document.body,
            props: {
                data: {
                    root: part({
                        tag: 'dialog',
                        key: 'create',
                        style: 'dialog',
                        dialog: { title: 'Create task', confirmation: 'Task created' },
                        children: [
                            part({
                                tag: 'action',
                                key: 'open',
                                style: 'bordered',
                                size: 'normal',
                                text: 'Create task',
                                action: { query: {}, submits: false, appends: false },
                            }),
                            part({
                                tag: 'form',
                                key: 'form',
                                style: 'stack',
                                form: { method: 'POST', href: '/tasks', fixed: {}, isKeyed: true },
                                children: [],
                            }),
                        ],
                    }),
                },
            },
        });

        expect(document.body.querySelector('[role="dialog"]')).toBeNull();

        const opener = view.get('button');
        opener.element.focus();
        await opener.trigger('click');

        expect(document.body.querySelector('[role="dialog"]')).not.toBeNull();
        expect(document.body.querySelector('form[data-layout-form="stack"]')).not.toBeNull();

        const cancel = [...document.body.querySelectorAll('button')].find((button) => button.textContent === 'Cancel');
        cancel?.click();
        await view.vm.$nextTick();

        expect(document.body.querySelector('[role="dialog"]')).toBeNull();
        expect(document.activeElement).toBe(opener.element);
        view.unmount();
    });
});
