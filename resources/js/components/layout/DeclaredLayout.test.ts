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
});
