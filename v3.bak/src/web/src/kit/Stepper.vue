<script setup>
import Icon from "./Icon.vue";

const props = defineProps({
    value: {type: Number, required: true},
    min: {type: Number, default: 1},
    max: {type: Number, default: 99},
    label: {type: String, default: ""},
    none: {type: String, default: ""},
});
const emit = defineEmits(["change"]);

function step(by) {
    const next = Math.min(props.max, Math.max(props.min, props.value + by));
    if (next !== props.value) emit("change", next);
}
</script>

<template>
    <span class="stepper" role="group" :aria-label="label" :title="label">
        <button type="button" class="stepper-button" :disabled="value <= min" aria-label="One fewer" @click="step(-1)">
            <Icon name="minus" :size="11" />
        </button>
        <span class="stepper-value">{{ none && value === 0 ? none : value }}</span>
        <button type="button" class="stepper-button" :disabled="value >= max" aria-label="One more" @click="step(1)">
            <Icon name="plus" :size="11" />
        </button>
    </span>
</template>

<style scoped>
.stepper {
    display: inline-flex;
    align-items: center;
    height: 22px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
    color: var(--text);
}

.stepper-button {
    display: grid;
    place-items: center;
    width: 20px;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.stepper-button:hover:enabled {
    color: var(--text);
}

.stepper-button:disabled {
    opacity: 0.35;
    cursor: default;
}

.stepper-value {
    min-width: 16px;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    text-align: center;
}
</style>
