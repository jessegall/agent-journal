// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import TextField from './TextField.vue';

describe('TextField', () => {
    it('draws its control with the one input look the domains share', () => {
        const wrapper = mount(TextField, { props: { id: 'title', label: 'Title', modelValue: '' } });

        expect(wrapper.find('input').classes()).toContain('input');
    });

    it('has that look defined, so a domain field with class input is never left to the browser', () => {
        const css = readFileSync(resolve(__dirname, '../../../css/app.css'), 'utf8');

        expect(css).toMatch(/\.input\s*\{\s*@apply [^;]*rounded-control[^;]*border-border-2/);
    });
});
