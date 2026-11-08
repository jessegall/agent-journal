<script setup>
// a whole number with a minus and a plus beside it, never below 0
const props = defineProps({modelValue: {type: [Number, String], default: 0}, disabled: {type: Boolean, default: false}});
const emit = defineEmits(["update:modelValue"]);
const step = (by) => emit("update:modelValue", Math.max(0, (Number(props.modelValue) || 0) + by));
</script>

<template>
    <span class="step">
        <button type="button" :disabled="disabled || Number(modelValue) <= 0" aria-label="Less" @click="step(-1)">−</button>
        <input type="number" min="0" :value="modelValue" :disabled="disabled" @input="emit('update:modelValue', $event.target.value)">
        <button type="button" :disabled="disabled" aria-label="More" @click="step(1)">+</button>
    </span>
</template>

<style scoped>
.step { display: flex; align-items: stretch; width: 132px; height: 30px; border: 1px solid var(--border-2, var(--border)); border-radius: 8px; background: var(--bg); overflow: hidden; }
.step:focus-within { border-color: var(--accent); }
.step button { flex: none; width: 30px; padding: 0; border: 0; background: none; color: var(--text-2); font-size: 15px; line-height: 1; cursor: pointer; }
.step button:hover { background: var(--hover); color: var(--text); }
.step button[disabled] { cursor: default; opacity: 0.35; }
.step input { flex: 1; min-width: 0; width: 100%; padding: 0; border: 0; border-inline: 1px solid var(--border-inner, var(--border)); outline: 0; background: none; color: var(--text); font: inherit; font-size: 13px; font-weight: 500; font-variant-numeric: tabular-nums; text-align: center; appearance: textfield; }
.step input::-webkit-outer-spin-button, .step input::-webkit-inner-spin-button { margin: 0; appearance: none; }
.step input[disabled] { color: var(--text-2); }
</style>
