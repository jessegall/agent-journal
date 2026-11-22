<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import FormErrors from '@/components/kit/FormErrors.vue';
import LayoutPart from '@/components/layout/LayoutPart.vue';
import { formSendingHooks } from '@/composables/usePageChanges';
import { useHostProp } from '@/framework/hostProp';
import type { LayoutPartData } from '@/generated/types/core';
import { inertiaMethods, provideLayoutForm, startingValues } from './layoutForm';

// A form of a declared layout: it sends its fields and fixed values to its one registered action and asks only for the
// prop of the window it is drawn in, keeping the window's state, so a refusal or a field error shows in place with the
// input kept.
const props = defineProps<{ part: LayoutPartData }>();
const hostProp = useHostProp();
const form = useForm(startingValues(props.part));
provideLayoutForm(form);

function send(): void {
    if (props.part.form === undefined) {
        return;
    }

    form.submit(inertiaMethods[props.part.form.method], props.part.form.href, {
        only: [hostProp],
        preserveState: true,
        preserveScroll: true,
        ...formSendingHooks(),
    });
}
</script>

<template>
    <form
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
