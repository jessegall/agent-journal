<script setup lang="ts">
import { computed, useId } from 'vue';
import Field from '@/components/kit/Field.vue';
import Toggle from '@/components/kit/Toggle.vue';
import type { InertiaForm } from '@inertiajs/vue3';
import type { LayoutFieldData, LayoutPartData } from '@/generated/types/core';
import type { LayoutFormValues } from './layoutForm';

// A field inside a layout form: it edits its own value of the form, shows the server's error for its name and keeps
// what was typed when the form comes back refused; its id comes from this mount. A secret field hides what is typed,
// and a switch is drawn only where the declaration says so, holding 1 or 0.
const props = defineProps<{
    field: LayoutFieldData;
    form: InertiaForm<LayoutFormValues>;
    part: LayoutPartData;
}>();
const fieldId = `layout-form-field-${useId()}`;
const isOn = computed({
    get: () => String(props.form[props.field.name]) === '1',
    set: (on: boolean) => {
        props.form[props.field.name] = on ? '1' : '0';
    },
});
const value = computed({
    get: () => String(props.form[props.field.name]),
    set: (typed: string) => {
        props.form[props.field.name] = typed;
    },
});
</script>

<template>
    <template v-if="part.style === 'toggle'">
        <Toggle v-model="isOn" :label="part.text ?? ''" />
    </template>
    <template v-else>
        <Field
            :id="fieldId"
            v-model="value"
            :label="part.text ?? ''"
            :hint="part.detail ?? undefined"
            :secret="part.style === 'secret'"
            :error="form.errors[props.field.name]"
        />
    </template>
</template>
