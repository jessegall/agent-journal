<script setup lang="ts">
import { computed, useId } from 'vue';
import Field from '@/components/kit/Field.vue';
import FieldError from '@/components/kit/FieldError.vue';
import Select from '@/components/kit/Select.vue';
import Toggle from '@/components/kit/Toggle.vue';
import type { InertiaForm } from '@inertiajs/vue3';
import type { LayoutFieldData, LayoutPartData } from '@/generated/types/core';
import type { LayoutFormValues } from './layoutForm';

// A field inside a layout form: it edits its own value, shows the server's error for its name and keeps what was typed
// after a refusal. A secret field hides what is typed, a choice shows its labels, and a switch, where declared, holds 1
// or 0.
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
const choiceLabelId = useId();
const choices = computed(() =>
    props.field.options.map((option, index) => ({ value: option, label: props.field.optionLabels[index] ?? option })),
);
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
    <template v-else-if="part.style === 'choice'">
        <div class="flex flex-col gap-1">
            <span :id="choiceLabelId" class="text-field text-text">{{ part.text }}</span>
            <Select
                v-model="value"
                :aria-labelledby="choiceLabelId"
                :options="choices"
                :invalid="form.errors[props.field.name] !== undefined"
            />
            <template v-if="form.errors[props.field.name]">
                <FieldError>{{ form.errors[props.field.name] }}</FieldError>
            </template>
        </div>
    </template>
    <template v-else>
        <Field
            :id="fieldId"
            v-model="value"
            :label="part.text ?? ''"
            :hint="part.detail ?? undefined"
            :secret="part.style === 'secret'"
            :multiline="part.style === 'area'"
            :error="form.errors[props.field.name]"
        />
    </template>
</template>
