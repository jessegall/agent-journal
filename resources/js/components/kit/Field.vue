<script setup lang="ts">
import { computed, useId } from 'vue';
import FieldError from './FieldError.vue';
import FieldHint from './FieldHint.vue';
import FieldLabel from './FieldLabel.vue';
import Input from './Input.vue';
import Textarea from './Textarea.vue';

/**
 * Typed input: its label above, an Input or a Textarea (or the control the default slot draws), the hint and the
 * error below. The control points aria-describedby at the hint and the error and shows aria-invalid; the typed value
 * is kept. A code field shows what a user types from another screen in a fixed-width face and is never filled in by
 * the browser; a secret field hides what is typed. Enter in a one-line field outside a form, and Command or Control
 * with Enter in a textarea, emit submit. The end slot sits inside a one-line field at its right end.
 */
const props = withDefaults(
    defineProps<{
        id?: string;
        label: string;
        hint?: string;
        error?: string;
        size?: 'md' | 'sm';
        width?: number;
        multiline?: boolean;
        rows?: number;
        maxlength?: number;
        code?: boolean;
        secret?: boolean;
        autocomplete?: string;
        disabled?: boolean;
        readonly?: boolean;
    }>(),
    {
        id: undefined,
        hint: undefined,
        error: undefined,
        size: 'md',
        width: undefined,
        multiline: false,
        rows: 3,
        maxlength: undefined,
        code: false,
        secret: false,
        autocomplete: 'off',
        disabled: false,
        readonly: false,
    },
);

const value = defineModel<string>({ default: '' });
const emit = defineEmits<{ submit: [] }>();

const fallbackId = useId();
const inputId = computed(() => props.id ?? fallbackId);
const hintId = computed(() => `${inputId.value}-hint`);
const errorId = computed(() => `${inputId.value}-error`);
const describedBy = computed(
    () => [props.hint && hintId.value, props.error && errorId.value].filter(Boolean).join(' ') || undefined,
);
const invalid = computed(() => (props.error ? true : undefined));

/** What the browser may fill in: nothing it keeps for a code or a secret, else what the field asks for. */
const autocompleteValue = computed(() => {
    if (props.code) {
        return 'one-time-code';
    }

    return props.secret ? 'new-password' : props.autocomplete;
});

function submitFromKeys(event: KeyboardEvent): void {
    if (event.key !== 'Enter') {
        return;
    }

    const inForm = (event.target as HTMLInputElement).form !== null;
    const allowed = props.multiline ? event.metaKey || event.ctrlKey : !inForm;

    if (allowed) {
        event.preventDefault();
        emit('submit');
    }
}
</script>

<template>
    <div class="flex flex-col" :style="width ? { width: `${width}px` } : undefined">
        <FieldLabel :for="inputId" data-field-label>{{ label }}</FieldLabel>
        <slot :id="inputId" :described-by="describedBy" :invalid="invalid">
            <div class="relative flex">
                <template v-if="multiline">
                    <Textarea
                        :id="inputId"
                        v-model="value"
                        :rows="rows"
                        :maxlength="maxlength"
                        :disabled="disabled"
                        :readonly="readonly"
                        :aria-describedby="describedBy"
                        :invalid="invalid"
                        class="flex-1"
                        @keydown="submitFromKeys"
                    />
                </template>
                <template v-else>
                    <Input
                        :id="inputId"
                        v-model="value"
                        :type="secret ? 'password' : 'text'"
                        :size="size"
                        :maxlength="maxlength"
                        :disabled="disabled"
                        :readonly="readonly"
                        :autocomplete="autocompleteValue"
                        :spellcheck="code ? false : undefined"
                        :aria-describedby="describedBy"
                        :invalid="invalid"
                        class="flex-1"
                        :class="{ 'font-mono tracking-[0.2em] uppercase': code, 'pr-20': $slots.end }"
                        @keydown="submitFromKeys"
                    />
                </template>
                <template v-if="$slots.end">
                    <span class="absolute inset-y-0 right-1 flex items-center"><slot name="end" /></span>
                </template>
            </div>
        </slot>
        <template v-if="hint">
            <FieldHint :id="hintId">{{ hint }}</FieldHint>
        </template>
        <template v-if="error">
            <FieldError :id="errorId">{{ error }}</FieldError>
        </template>
    </div>
</template>
