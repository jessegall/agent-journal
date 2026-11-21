// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TextComposer from '../text/TextComposer.vue';
import TextField from './TextField.vue';

describe('TextField', () => {
    it('draws its control with the one input look the domains share', () => {
        const wrapper = mount(TextField, { props: { id: 'title', label: 'Title', modelValue: '' } });

        expect(wrapper.find('input').classes()).toContain('input');
    });

    it('gives a domain text control the same input class as the kit field', () => {
        const kit = mount(TextField, { props: { id: 'title', label: 'Title', modelValue: '' } });
        const composer = mount(TextComposer, {
            props: { modelValue: '', pending: false, errors: {}, placeholder: 'Write a comment', sendLabel: 'Send' },
        });

        expect(composer.find('textarea').classes()).toContain('input');
        expect(kit.find('input').classes()).toContain('input');
    });
});
