<script setup>
import Icon from "./Icon.vue";

// an information icon beside a label: hovering or focusing it shows the explanation, one line per entry, so the explanation does not sit under the control
defineProps({lines: {type: Array, required: true}, label: {type: String, default: "More information"}});
</script>

<template>
    <span class="info-tip">
        <button type="button" class="info-tip-icon" :aria-label="label" data-info-tip><Icon name="info" :size="13" /></button>
        <span class="info-tip-text" role="tooltip" data-info-tip-text>
            <template v-for="(line, index) in lines" :key="index">
                <span class="info-tip-line">{{ line }}</span>
            </template>
        </span>
    </span>
</template>

<style scoped>
.info-tip {
    position: relative;
    display: inline-flex;
    margin-left: 4px;
    vertical-align: middle;
}

.info-tip-icon {
    display: inline-flex;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-3);
    cursor: help;
}

.info-tip-text {
    position: absolute;
    z-index: 5;
    top: 100%;
    left: 0;
    display: none;
    flex-direction: column;
    gap: 3px;
    width: max-content;
    max-width: 320px;
    margin-top: 4px;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    white-space: normal;
}

.info-tip:hover .info-tip-text,
.info-tip:focus-within .info-tip-text {
    display: flex;
}
</style>
