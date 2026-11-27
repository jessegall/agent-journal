<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

/**
 * A multi-line text input in the shared input look: at least 70 px high and resizable vertically. `bare` drops the
 * box and the resize handle for the composer and the comment bar, in field text or, for the composer, body text. A
 * parent that holds it by ref can focus() it and reach its element, to size it to its text.
 */
const props = withDefaults(
    defineProps<{ rows?: number; invalid?: boolean; bare?: boolean; text?: 'field' | 'body' }>(),
    {
        rows: 3,
        invalid: false,
        bare: false,
        text: 'field',
    },
);
const value = defineModel<string>({ default: '' });
const look = computed(() => {
    if (!props.bare) {
        return 'input min-h-17.5 resize-y';
    }

    return [
        'min-w-0 resize-none bg-transparent text-text outline-none placeholder:text-text-4',
        props.text === 'body' ? 'text-body leading-[1.45]' : 'text-field',
    ];
});
const element = useTemplateRef<HTMLTextAreaElement>('element');

defineExpose({ focus: (): void => element.value?.focus(), element });
</script>

<template>
    <textarea
        ref="element"
        v-model="value"
        :rows="rows"
        :aria-invalid="invalid || undefined"
        :class="look"
    />
</template>
