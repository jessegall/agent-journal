<script setup>
defineProps({modelValue: {type: String, default: ""}, disabled: {type: Boolean, default: false}, placeholder: {type: String, default: ""}});
const emit = defineEmits(["update:modelValue"]);
</script>

<template>
    <input class="setting-text" type="text" :value="modelValue" :placeholder="placeholder" :disabled="disabled" @input="emit('update:modelValue', $event.target.value)">
</template>

<style scoped>
.setting-text { width: 100%; height: 28px; padding: 0 10px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); color: var(--text); font-family: var(--mono); font-size: 11.5px; }
.setting-text:focus-visible { border-color: var(--accent); outline: 0; }
.setting-text::placeholder { color: var(--text-3); }
</style>
