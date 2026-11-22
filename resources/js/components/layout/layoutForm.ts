import type { Method } from '@inertiajs/core';
import type { InertiaForm } from '@inertiajs/vue3';
import { inject, provide } from 'vue';
import type { InjectionKey, Ref } from 'vue';
import type { ActionMethod, LayoutPartData } from '@/generated/types/core';

/**
 * The method Inertia sends for each method a registered action answers.
 */
export const inertiaMethods: Record<ActionMethod, Method> = {
    GET: 'get',
    POST: 'post',
    PATCH: 'patch',
    DELETE: 'delete',
};

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

const SENT: InjectionKey<() => void> = Symbol('journal.layout-form-sent');

/**
 * Lets a form stood in by a dialog tell the dialog its submission was accepted.
 */
export function provideFormSent(sent: () => void): void {
    provide(SENT, sent);
}

/**
 * What to do once the form this part stands in was accepted; nothing outside a dialog.
 */
export function useFormSent(): () => void {
    return inject(SENT, () => undefined);
}

const DRAFT: InjectionKey<Ref<Record<string, string> | null>> = Symbol('journal.layout-form-draft');

/**
 * Lets a dialog hand the fields a draft made to the form it holds, to fill it without sending it.
 */
export function provideFormDraft(draft: Ref<Record<string, string> | null>): void {
    provide(DRAFT, draft);
}

/**
 * The fields a draft made for the form this part stands in; none outside a dialog or before a draft.
 */
export function useFormDraft(): Ref<Record<string, string> | null> | null {
    return inject(DRAFT, null);
}
