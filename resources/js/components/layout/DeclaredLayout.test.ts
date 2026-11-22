// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { router } from '@inertiajs/vue3';
import { defineComponent, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { provideHostProp } from '@/framework/hostProp';
import DeclaredLayout from '@/components/layout/DeclaredLayout.vue';
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
        });
        const layout = (rows: string[], more: boolean) => ({
            root: part({
                tag: 'box',
                key: 'root',
                style: 'stack',
                children: [
                    part({
                        tag: 'collection',
                        key: 'rows',
                        style: 'list',
                        rows: rows.map(row),
                    }),
                    ...(more
                        ? [
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
                          ]
                        : []),
                ],
            }),
        });
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
});
