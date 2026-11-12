<script setup>
import {computed} from "vue";
import {CUSTOM_PRESET} from "./currentPreset.js";

// the preset of a settings screen: the presets side by side with the one the form matches marked, Custom when it
// matches none, a link to read what a preset is, and a slot on the right for finding a setting
const props = defineProps({presets: {type: Array, required: true}, current: {type: String, required: true}, disabled: {type: Boolean, default: false}});
const emit = defineEmits(["pick", "open-page"]);

const options = computed(() => [...props.presets.map((preset) => ({key: preset.key, name: preset.name})), {key: CUSTOM_PRESET, name: "Custom"}]);
</script>

<template>
    <div class="setting-preset-band">
        <span class="label">Preset</span>
        <div class="seg" role="radiogroup" aria-label="Preset">
            <template v-for="option in options" :key="option.key">
                <button type="button" role="radio" :class="{on: option.key === current}" :aria-checked="option.key === current ? 'true' : 'false'" :disabled="disabled || option.key === 'custom'" :data-preset="option.key" @click="emit('pick', option.key)">{{ option.name }}</button>
            </template>
        </div>
        <button type="button" class="link" data-preset-page @click="emit('open-page')">What is a preset?</button>
        <div class="find"><slot /></div>
    </div>
</template>

<style scoped>
.setting-preset-band { display: flex; align-items: center; gap: 10px; padding: 0 18px 12px; }
.label { color: var(--text-3); font-size: 12px; }
.seg { display: inline-flex; gap: 2px; padding: 2px; border: 1px solid var(--border-2); border-radius: 8px; background: var(--bg); }
.seg button { padding: 4px 12px; border: 0; border-radius: 6px; background: none; color: var(--text-2); font: inherit; font-size: 12px; cursor: pointer; }
.seg button:hover:not([disabled]) { color: var(--text); }
.seg button.on { background: var(--accent-dim); color: var(--accent-text); font-weight: 500; }
.seg button[disabled] { cursor: default; }
.seg button[disabled]:not(.on) { opacity: 0.55; }
.link { padding: 4px 2px; border: 0; background: none; color: var(--accent-text); font: inherit; font-size: 12px; cursor: pointer; }
.find { margin-left: auto; }
</style>
