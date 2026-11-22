<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { nextTick, useTemplateRef, watch } from 'vue';
import FormErrors from '@/components/kit/FormErrors.vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import { formSendingHooks } from '@/composables/usePageChanges';
import { useHostProp } from '@/framework/hostProp';
import type { LayoutPartData } from '@/generated/types/core';
import { inertiaMethods, provideLayoutForm, startingValues, useFormDraft, useFormSent } from './layoutForm';

// A form of a declared layout: it sends its fields and fixed values to its one registered action and asks only for the
// prop of the window it is drawn in, keeping the window's state, so a refusal or a field error shows in place with the
// input kept and the focus on its first invalid field. A keyed form sends a new Idempotency-Key each time, and a
// form with a question asks it first. A form in a dialog tells the dialog once it was accepted.
const props = defineProps<{ part: LayoutPartData }>();
const hostProp = useHostProp();
const form = useForm(startingValues(props.part));
const element = useTemplateRef<HTMLFormElement>('element');
const sent = useFormSent();
const draft = useFormDraft();

watch(
    () => draft?.value,
    (fields) => {
        for (const [name, value] of Object.entries(fields ?? {})) {
            form[name] = value;
        }
    },
);
provideLayoutForm(form);

function send(): void {
    const target = props.part.form;

    if (target === undefined) {
        return;
    }

    if (target.confirmation !== undefined && !window.confirm(target.confirmation)) {
        return;
    }

    form.submit(inertiaMethods[target.method], target.href, {
        only: [hostProp],
        preserveState: true,
        preserveScroll: true,
        headers: target.isKeyed ? { 'Idempotency-Key': crypto.randomUUID() } : {},
        ...formSendingHooks(),
        onSuccess: sent,
        onError: () => {
            void nextTick(() => element.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
        },
    });
}
</script>

<template>
    <form
        ref="element"
        :data-layout-form="part.style"
        class="flex gap-3"
        :class="
            part.style === 'inline'
                ? 'flex-row flex-wrap items-end'
                : 'flex-col'
        "
        @submit.prevent="send"
    >
        <FormErrors :errors="form.errors" />
        <template v-for="child in part.children" :key="child.key">
            <LayoutPart :part="child" />
        </template>
    </form>
</template>
