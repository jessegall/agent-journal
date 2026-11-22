<script setup lang="ts">
/**
 * On or off: a 30 × 18 switch whose 14 px knob slides over 120 ms. A native button with role switch, so Space and
 * Enter flip it; the label goes on aria-label.
 */
defineProps<{ label: string; disabled?: boolean }>();
const checked = defineModel<boolean>({ default: false });
</script>

<template>
    <button
        type="button"
        role="switch"
        :aria-checked="checked"
        :aria-label="label"
        :disabled="disabled"
        class="relative h-4.5 w-7.5 shrink-0 rounded-[9px] transition-colors duration-(--duration-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-45"
        :class="checked ? 'bg-brand' : 'bg-border-3'"
        @click="checked = !checked"
    >
        <span
            aria-hidden="true"
            class="absolute top-0.5 left-0.5 size-3.5 rounded-full transition-[translate] duration-(--duration-hover)"
            :class="checked ? 'translate-x-3.5 bg-on-brand' : 'bg-bg'"
        />
    </button>
</template>
