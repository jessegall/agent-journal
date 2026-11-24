<script setup lang="ts">
import { useTemplateRef } from 'vue';

/**
 * A one-line text input in the shared input look: md is 30 px high, sm is 28 px; a --border-2 border, radius
 * --radius-field, --bg fill, --text-field; the focus ring at offset 1; invalid (aria-invalid) turns the border
 * --danger. `bare` drops the box for an input that sits inside another control, such as the search field. A parent that
 * holds it by ref can focus() it.
 */
withDefaults(defineProps<{ size?: 'md' | 'sm'; invalid?: boolean; bare?: boolean }>(), {
    size: 'md',
    invalid: false,
    bare: false,
});
const value = defineModel<string>({ default: '' });
const element = useTemplateRef<HTMLInputElement>('element');

defineExpose({ focus: (): void => element.value?.focus() });
</script>

<template>
    <input
        ref="element"
        v-model="value"
        :aria-invalid="invalid || undefined"
        :class="
            bare
                ? 'min-w-0 bg-transparent text-field text-text outline-none placeholder:text-text-4'
                : ['input', size === 'sm' ? 'h-7 min-h-7 px-[9px]' : 'h-7.5']
        "
    />
</template>
