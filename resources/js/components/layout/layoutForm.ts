import type { InertiaForm } from '@inertiajs/vue3';
import { inject, provide } from 'vue';
import type { InjectionKey } from 'vue';
import type { LayoutPartData } from '@/generated/types/core';

export type LayoutFormValues = Record<string, string | number>;

const FORM: InjectionKey<InertiaForm<LayoutFormValues>> = Symbol(
    'journal.layout-form',
);

/**
 * Lets the fields and actions drawn inside a layout form bind to that form.
 */
export function provideLayoutForm(form: InertiaForm<LayoutFormValues>): void {
    provide(FORM, form);
}

/**
 * The layout form this part stands in, or null outside any form.
 */
export function useLayoutForm(): InertiaForm<LayoutFormValues> | null {
    return inject(FORM, null);
}

/**
 * The values a form starts with: its fixed values and the value each field inside it shows now.
 */
export function startingValues(form: LayoutPartData): LayoutFormValues {
    const values: LayoutFormValues = { ...(form.form?.fixed ?? {}) };
    const pending = [...form.children];

    while (pending.length > 0) {
        const part = pending.shift()!;

        if (part.field !== undefined) {
            values[part.field.name] = part.field.value;
        }

        pending.push(...part.children);
    }

    return values;
}
