<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { nextTick, ref, useTemplateRef, watch } from 'vue';
import FormErrors from '@/components/kit/FormErrors.vue';
import LayoutConfirmation from '@/components/layout/LayoutConfirmation.vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import { formSendingHooks } from '@/composables/usePageChanges';
import { useHostProp } from '@/framework/hostProp';
import type { LayoutPartData } from '@/generated/types/core';
import { inertiaMethods, provideLayoutForm, startingValues, useFormDraft, useFormSent } from './layoutForm';

// A form of a declared layout: it sends its fields to its one registered action and reloads only its window's prop, so
// errors show in place with the input kept. A keyed form sends a new Idempotency-Key, a form with a question asks
// first, and a live form sends itself a moment after a change.
const props = defineProps<{ part: LayoutPartData }>();
const hostProp = useHostProp();
const form = useForm(startingValues(props.part));
const element = useTemplateRef<HTMLFormElement>('element');
const sentToDialog = useFormSent();
const isConfirmed = ref(false);
const draft = useFormDraft();

if (draft !== null) {
    watch(
        draft,
        (fields) => {
            if (fields === null) {
                return;
            }

            for (const [name, value] of Object.entries(fields)) {
                form[name] = value;
            }
        },
        { immediate: true },
    );
}
provideLayoutForm(form);

const LIVE_PAUSE_MS = 600;
const livePause = ref<ReturnType<typeof setTimeout>>();
const isTakingServerValues = ref(false);

// Values the server changed, such as a field Reset took back to its default, replace what the form holds; a value
// the viewer typed and the server refused is kept, since the server's value did not change.
watch(
    () => JSON.stringify(startingValues(props.part)),
    () => {
        isTakingServerValues.value = true;
        form.defaults(startingValues(props.part));
        form.reset();
        void nextTick(() => {
            isTakingServerValues.value = false;
        });
    },
);

watch(
    () => JSON.stringify(form.data()),
    () => {
        if (props.part.style !== 'live' || isTakingServerValues.value) {
            return;
        }

        clearTimeout(livePause.value);
        livePause.value = setTimeout(send, LIVE_PAUSE_MS);
    },
);

function send(): void {
    const target = props.part.form;

    if (target === undefined) {
        return;
    }

    if (target.confirmation !== undefined && !window.confirm(target.confirmation)) {
        return;
    }

    // The fixed values are the server's, such as the revision the page was read at, so they are sent as the latest
    // declaration holds them, never as they stood when the form was drawn.
    form.transform((values) => ({ ...values, ...(target.fixed ?? {}) }));
    form.submit(inertiaMethods[target.method], target.href, {
        only: [hostProp],
        preserveState: true,
        preserveScroll: true,
        headers: target.isKeyed ? { 'Idempotency-Key': crypto.randomUUID() } : {},
        ...formSendingHooks(),
        onSuccess: () => {
            sentToDialog();
            isConfirmed.value = target.confirmed !== undefined;
        },
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
    <template v-if="isConfirmed && part.form?.confirmed !== undefined">
        <LayoutConfirmation
            :text="part.form.confirmed"
            :undo="part.form.undo"
            @close="isConfirmed = false"
        />
    </template>
</template>
