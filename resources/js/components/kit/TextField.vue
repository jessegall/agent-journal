<script setup lang="ts">
import FormField from '@/components/kit/FormField.vue';

/**
 * A labelled one-line text field. A code field shows what a user types from another screen, such as a sign-in
 * code, in a fixed-width face, and is never filled in by the browser or kept by it.
 */
const props = withDefaults(
    defineProps<{
        id: string;
        label: string;
        error?: string;
        hint?: string;
        maxlength?: number;
        code?: boolean;
        autocomplete?: string;
        disabled?: boolean;
    }>(),
    {
        error: undefined,
        hint: undefined,
        maxlength: undefined,
        code: false,
        autocomplete: 'off',
        disabled: false,
    },
);

const value = defineModel<string>({ required: true });
</script>

<template>
    <FormField :id="id" :label="label" :error="error" :hint="hint">
        <template #default="field">
            <input
                :id="field.id"
                v-model="value"
                type="text"
                :maxlength="maxlength"
                :disabled="disabled"
                :autocomplete="code ? 'one-time-code' : props.autocomplete"
                :spellcheck="code ? false : undefined"
                :aria-invalid="field.invalid"
                :aria-describedby="field.describedBy"
                class="h-7 rounded-control border border-border-2 bg-transparent px-2.5 text-field text-text transition-colors duration-(--duration-hover) placeholder:text-text-4 focus-visible:border-brand focus-visible:outline-none disabled:opacity-45 aria-invalid:border-danger"
                :class="{ 'font-mono tracking-[0.2em] uppercase': code }"
            />
        </template>
    </FormField>
</template>
