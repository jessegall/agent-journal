<script setup>
// a few exclusive choices side by side, the one chosen marked
defineProps({modelValue: {type: String, default: ""}, options: {type: Array, required: true}, disabled: {type: Boolean, default: false}});
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <div class="setting-segments" role="radiogroup">
        <template v-for="option in options" :key="option.value">
            <button type="button" role="radio" :class="{on: option.value === modelValue}" :aria-checked="option.value === modelValue ? 'true' : 'false'" :disabled="disabled" :data-segment="option.value" @click="emit('update:modelValue', option.value)">{{ option.label }}</button>
        </template>
    </div>
</template>

<style scoped>
.setting-segments { display: inline-flex; gap: 2px; padding: 2px; border: 1px solid var(--border-2); border-radius: 8px; background: var(--bg); }
.setting-segments button { padding: 4px 12px; border: 0; border-radius: 6px; background: none; color: var(--text-2); font: inherit; font-size: 12px; cursor: pointer; }
.setting-segments button:hover { color: var(--text); }
.setting-segments button.on { background: var(--accent-dim); color: var(--accent-text); font-weight: 500; }
.setting-segments button[disabled] { cursor: default; opacity: 0.55; }
</style>
