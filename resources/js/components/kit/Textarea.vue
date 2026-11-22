<script setup lang="ts">
/**
 * A multi-line text input in the shared input look: at least 70 px high and resizable vertically. `bare` drops the
 * box and the resize handle for the composer and the comment bar.
 */
withDefaults(defineProps<{ rows?: number; invalid?: boolean; bare?: boolean }>(), {
    rows: 3,
    invalid: false,
    bare: false,
});
const value = defineModel<string>({ default: '' });
</script>

<template>
    <textarea
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
