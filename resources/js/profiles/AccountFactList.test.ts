// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';
import AccountFactList from './AccountFactList.vue';

describe('AccountFactList', () => {
    it('shows each fact as its term and value, and a fact whose slot is filled shows the slot', () => {
        const view = mount(AccountFactList, {
            props: {
                facts: [
                    { term: 'Running now', value: '1 agent' },
                    { term: 'Default', value: '' },
                ],
            },
            slots: { Default: () => h('button', 'Make default') },
        });

        expect(view.findAll('dt').map((term) => term.text())).toEqual([
            'Running now',
            'Default',
        ]);
        expect(view.findAll('dd').map((value) => value.text())).toEqual([
            '1 agent',
            'Make default',
        ]);
    });
});
