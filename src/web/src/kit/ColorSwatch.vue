<script setup>
import TextInput from "./TextInput.vue";

defineProps({value: {type: String, default: ""}, label: {type: String, default: ""}});
const emit = defineEmits(["change"]);
</script>

<template>
    <label class="swatch" :style="{'--swatch': value || 'var(--text-4)'}" title="Pick a color">
        <TextInput class="swatch-input" type="color" :value="value || '#000000'" :aria-label="label" @change="emit('change', $event.target.value)" />
        <span>{{ value }}</span>
    </label>
</template>

<style scoped>
.swatch {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 28px;
    padding: 0 10px 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    color: var(--text-2);
    font-family: var(--mono);
    font-size: 11.5px;
    cursor: pointer;
}

.swatch::before {
    content: "";
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--swatch);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--text) 18%, transparent);
}

.swatch:hover {
    border-color: var(--border-3);
    background: var(--hover);
    color: var(--text);
}

.swatch:focus-within {
    border-color: var(--accent);
}

.swatch-input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
}
</style>
