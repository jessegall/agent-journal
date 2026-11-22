// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Field from './Field.vue';

describe('Field', () => {
    it('names its input with the label and keeps the typed value', async () => {
        const view = mount(Field, { props: { id: 'title', label: 'Title', modelValue: '' } });

        expect(view.get('label').attributes('for')).toBe('title');
        expect(view.get('input').attributes('id')).toBe('title');
        await view.get('input').setValue('A plan');
        expect(view.emitted('update:modelValue')?.at(-1)).toEqual(['A plan']);
    });

    it('points aria-describedby at the hint and the error and marks the input invalid', () => {
        const view = mount(Field, {
            props: { id: 'goal', label: 'Goal', modelValue: '', hint: 'One line', error: 'Required' },
        });
        const input = view.get('input');

        expect(input.attributes('aria-invalid')).toBe('true');
        expect(input.attributes('aria-describedby')).toBe('goal-hint goal-error');
        expect(view.get('#goal-hint').text()).toBe('One line');
        expect(view.get('#goal-error').text()).toBe('Required');
        expect(view.get('#goal-error').classes()).toContain('text-danger');
    });

    it('has no description and is not invalid without a hint or an error', () => {
        const input = mount(Field, { props: { id: 'name', label: 'Name', modelValue: '' } }).get('input');

        expect(input.attributes('aria-invalid')).toBeUndefined();
        expect(input.attributes('aria-describedby')).toBeUndefined();
    });

    it('is 30 px high in md and 28 px in sm, and draws a textarea when multiline', () => {
        expect(mount(Field, { props: { label: 'A', modelValue: '' } }).get('input').classes()).toContain('h-7.5');
        expect(mount(Field, { props: { label: 'A', modelValue: '', size: 'sm' } }).get('input').classes()).toContain('h-7');

        const area = mount(Field, { props: { label: 'A', modelValue: '', multiline: true, rows: 7 } }).get('textarea');

        expect(area.attributes('rows')).toBe('7');
        expect(area.classes()).toContain('resize-y');
    });

    it('submits on Enter from a one-line field outside a form, and on Command or Control with Enter from a textarea', async () => {
        const line = mount(Field, { props: { label: 'A', modelValue: '' } });
        const area = mount(Field, { props: { label: 'A', modelValue: '', multiline: true } });

        await line.get('input').trigger('keydown', { key: 'Enter' });
        expect(line.emitted('submit')).toHaveLength(1);

        await area.get('textarea').trigger('keydown', { key: 'Enter' });
        expect(area.emitted('submit')).toBeUndefined();
        await area.get('textarea').trigger('keydown', { key: 'Enter', metaKey: true });
        await area.get('textarea').trigger('keydown', { key: 'Enter', ctrlKey: true });
        expect(area.emitted('submit')).toHaveLength(2);
    });

    it('hides a secret and keeps the browser from filling a code', () => {
        const secret = mount(Field, { props: { label: 'Key', modelValue: '', secret: true } }).get('input');
        const code = mount(Field, { props: { label: 'Code', modelValue: '', code: true } }).get('input');

        expect(secret.attributes('type')).toBe('password');
        expect(secret.attributes('autocomplete')).toBe('new-password');
        expect(code.attributes('autocomplete')).toBe('one-time-code');
    });
});
