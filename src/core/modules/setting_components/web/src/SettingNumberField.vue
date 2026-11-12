<script setup>
import {computed} from "vue";

// a whole number with a minus and a plus beside it; the rule it breaks is said under it
const props = defineProps({
    modelValue: {type: [Number, String], default: ""},
    disabled: {type: Boolean, default: false},
    unit: {type: String, default: ""},
    least: {type: Number, default: 0},
    blank: {type: String, default: "A number is missing."},
    rule: {type: String, default: ""},
});
const emit = defineEmits(["update:modelValue"]);

const text = computed(() => String(props.modelValue).trim());
const isBlank = computed(() => text.value === "");
const isBelow = computed(() => !isBlank.value && !(Number.isInteger(Number(text.value)) && Number(text.value) >= props.least));
const ruleText = computed(() => props.rule || `Use a whole number of ${props.least} or more.`);
const problem = computed(() => (isBlank.value ? props.blank : isBelow.value ? ruleText.value : ""));
const step = (by) => emit("update:modelValue", Math.max(props.least, (Number(props.modelValue) || 0) + by));
</script>

<template>
    <span class="setting-number">
        <span class="field">
            <span :class="['step', {bad: problem}]">
                <button type="button" aria-label="Less" :disabled="disabled || Number(modelValue) <= least" @click="step(-1)">−</button>
                <input type="number" :min="least" :value="modelValue" :disabled="disabled" @input="emit('update:modelValue', $event.target.value)">
                <button type="button" aria-label="More" :disabled="disabled" @click="step(1)">+</button>
            </span>
            <template v-if="unit">
                <span class="unit">{{ unit }}</span>
            </template>
        </span>
        <template v-if="problem">
            <span class="problem" role="alert">{{ problem }}</span>
        </template>
    </span>
</template>

<style scoped>
.setting-number { display: flex; flex-direction: column; gap: 4px; }
.field { display: flex; align-items: center; gap: 8px; }
.step { display: flex; align-items: stretch; width: 132px; height: 28px; border: 1px solid var(--border-2); border-radius: 7px; background: var(--bg); overflow: hidden; }
.step:focus-within { border-color: var(--accent); }
.step.bad { border-color: var(--danger); }
.step button { flex: none; width: 28px; padding: 0; border: 0; background: none; color: var(--text-2); font-size: 15px; line-height: 1; cursor: pointer; }
.step button:hover { background: var(--hover); color: var(--text); }
.step button[disabled] { cursor: default; opacity: 0.35; }
.step input { flex: 1; min-width: 0; width: 100%; padding: 0; border: 0; border-inline: 1px solid var(--border-2); outline: 0; background: none; color: var(--text); font-family: var(--mono); font-size: 12px; text-align: center; appearance: textfield; }
.step input::-webkit-outer-spin-button, .step input::-webkit-inner-spin-button { margin: 0; appearance: none; }
.step input[disabled] { color: var(--text-2); }
.unit { color: var(--text-3); font-size: 12px; }
.problem { color: var(--danger); font-size: 12px; }
</style>
