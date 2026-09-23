<script setup>
import ProgressBar from "./ProgressBar.vue";

defineProps({
    title: {type: String, required: true},
    label: {type: String, default: ""},
    figure: {type: String, default: ""},
    detail: {type: String, default: ""},
    value: {type: Number, default: 0},
    max: {type: Number, default: 100},
    busy: Boolean,
});
</script>

<template>
    <div class="meter">
        <div class="meter-head">
            <template v-if="label">
                <span class="meter-label">{{ label }}</span>
            </template>
            <span class="meter-title">{{ title }}</span>
            <template v-if="figure">
                <span class="meter-figure">{{ figure }}</span>
            </template>
        </div>
        <ProgressBar :value="value" :max="max" :busy="busy" thin />
        <template v-if="detail || $slots.default">
            <div class="meter-foot">
                <span class="meter-detail">{{ detail }}</span>
                <slot />
            </div>
        </template>
    </div>
</template>

<style scoped>
.meter {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 0;
}

.meter-head {
    display: flex;
    align-items: baseline;
    gap: 8px;
    min-width: 0;
}

.meter-label {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.meter-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-2);
    font-size: 12.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.meter-figure {
    flex: none;
    color: var(--text-2);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
}

.meter-foot {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 18px;
}

.meter-detail {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 11.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
