<script setup lang="ts">
import { computed, useId } from 'vue';
import TextField from '@/components/kit/TextField.vue';
import type { InertiaForm } from '@inertiajs/vue3';
import type { LayoutFieldData, LayoutPartData } from '@/generated/types/core';
import type { LayoutFormValues } from './layoutForm';

// A field inside a layout form: it edits its own value of the form, shows the server's error for its name and keeps
// what was typed when the form comes back refused; its id comes from this mount.
const props = defineProps<{
    field: LayoutFieldData;
    form: InertiaForm<LayoutFormValues>;
    part: LayoutPartData;
}>();
const fieldId = `layout-form-field-${useId()}`;
const value = computed({
    get: () => String(props.form[props.field.name]),
    set: (typed: string) => {
        props.form[props.field.name] = typed;
    },
});
</script>

<template>
    <TextField
        :id="fieldId"
        v-model="value"
        :label="part.text ?? ''"
        :hint="part.detail ?? undefined"
        :error="form.errors[props.field.name]"
    />
</template>
