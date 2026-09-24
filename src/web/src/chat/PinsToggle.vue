<script setup>
import Icon from "../kit/Icon.vue";
import {usePins} from "./pins.js";

const props = defineProps({notices: {type: Array, required: true}, inline: Boolean});
const {pins, minimised, toggle} = usePins(() => props.notices);
</script>

<template>
    <template v-if="pins.length">
        <button
            type="button"
            :class="['pins-toggle', {minimised, inline}]"
            :title="minimised ? 'Show the pinned links' : 'Tuck the pinned links into this corner'"
            @click.stop="toggle"
        >
            <Icon :name="minimised ? 'pin' : 'up'" :size="12" />
            <template v-if="minimised">
                <span class="pins-count">{{ pins.length }}</span>
            </template>
        </button>
    </template>
</template>

<style scoped>
.pins-toggle {
    position: absolute;
    right: 10px;
    bottom: -30px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 24px;
    padding: 0 7px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--raised);
    color: var(--text-3);
    font: inherit;
    font-size: 11px;
    cursor: pointer;
    transition:
        color 0.15s,
        border-color 0.15s,
        transform 0.2s var(--ease);
}

.pins-toggle.inline {
    position: static;
    height: 20px;
    padding: 0 6px;
    border-color: transparent;
    background: none;
}

.pins-toggle:hover {
    border-color: var(--border-2);
    color: var(--text);
}

.pins-toggle.minimised {
    color: #4fc3d7;
}

.pins-count {
    font-variant-numeric: tabular-nums;
}
</style>
