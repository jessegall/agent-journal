<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

/**
 * A one-line text input in the shared input look, md or sm, whose border turns to danger when invalid; `bare` drops the
 * box for an input inside another control. A parent holding it by ref can focus() it. Measures:
 * docs/designs/kit-components.md.
 */
const props = withDefaults(defineProps<{ size?: 'md' | 'sm'; invalid?: boolean; bare?: boolean }>(), {
    size: 'md',
    invalid: false,
    bare: false,
});
const value = defineModel<string>({ default: '' });
const look = computed(() => {
    if (props.bare) {
        return 'min-w-0 bg-transparent text-field text-text outline-none placeholder:text-text-4';
    }

    return ['input', props.size === 'sm' ? 'h-7 min-h-7 px-[9px]' : 'h-7.5'];
});
const element = useTemplateRef<HTMLInputElement>('element');

defineExpose({ focus: (): void => element.value?.focus() });
</script>

<template>
    <input
        ref="element"
        v-model="value"
        :aria-invalid="invalid || undefined"
        :class="look"
    />
</template>
