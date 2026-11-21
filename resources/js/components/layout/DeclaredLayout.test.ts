// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DeclaredLayout from '@/components/layout/DeclaredLayout.vue';
import type { LayoutPartData } from '@/generated/types/core';

function part(
    fields: Partial<LayoutPartData> &
        Pick<LayoutPartData, 'tag' | 'key' | 'variant'>,
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
                        variant: 'stack',
                        children: [
                            part({
                                tag: 'text',
                                key: 'title',
                                variant: 'heading',
                                text: 'Shelf',
                            }),
                            part({
                                tag: 'collection',
                                key: 'facts',
                                variant: 'facts',
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
                                variant: 'error',
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
});
