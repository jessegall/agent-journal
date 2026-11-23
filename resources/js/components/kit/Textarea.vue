<script setup lang="ts">
import { useTemplateRef } from 'vue';

/**
 * A multi-line text input in the shared input look: at least 70 px high and resizable vertically. `bare` drops the
 * box and the resize handle for the composer and the comment bar. A parent that holds it by ref can focus() it.
 */
withDefaults(defineProps<{ rows?: number; invalid?: boolean; bare?: boolean }>(), {
    rows: 3,
    invalid: false,
    bare: false,
});
const value = defineModel<string>({ default: '' });
const element = useTemplateRef<HTMLTextAreaElement>('element');

defineExpose({ focus: (): void => element.value?.focus() });
</script>

<template>
    <textarea
        ref="element"
        v-model="value"
        :rows="rows"
        :aria-invalid="invalid || undefined"
        :class="
            bare
                ? 'min-w-0 resize-none bg-transparent text-field text-text outline-none placeholder:text-text-4'
                : 'input min-h-17.5 resize-y'
        "
    />
</template>
